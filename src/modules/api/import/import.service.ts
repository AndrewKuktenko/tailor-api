import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {Model, Types} from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import * as mime from 'mime-types';
import * as papa from 'papaparse';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as config from 'config';
import * as papaparse from 'papaparse';
import { IMPORT_STATUS } from 'src/interfaces/import.status';
import { S3ImportDto } from './dto/s3.import.dto';
import { CreateImportDto } from './dto/create.import.dto';
import { EVENT_TYPES } from 'src/interfaces/event.types';
import { matchImportData } from 'src/utils/matchImportData';
import { InjectModel } from '@nestjs/mongoose';
import { ImportModel } from './models/import.model';
import Hospital from 'src/interfaces/hospital.model';
import Patient from 'src/interfaces/patient.model';
import { SOURCE_TYPE } from 'src/interfaces/source.type';
import { HospitalModel } from './models/hospital.model';
import { PatientModel } from './models/patient.model';

AWS.config.update({
  region: config.get('aws.region'),
  accessKeyId: config.get('aws.accessKeyId'),
  secretAccessKey: config.get('aws.secretKey'),
});

const MAX_REQUESTS_FREQUENCY = 5000;
const MAX_BATCH_SIZE = 250;
const PATIENT_PROPERTIES = [
  'patientid',
  'mrn',
  'patientdob',
  'dod_ts',
  'deceased',
  'deathdate',
  'lastname',
  'firstname',
  'gender',
  'sex',
  'line',
  'city',
  'state',
  'zipcode',
];

const HOSPITAL_PROPERTIES = [
  'treatmentline',
  'treatmentid',
  'patientid',
  'protocolid',
  'startdate',
  'enddate',
  'status',
  'displayname',
  'diagnose',
  'cycles',
];

@Injectable()
export class ImportService {
  constructor(
    @InjectModel('Import') private readonly importModel: Model<ImportModel>,
    @InjectModel('Hospital') private readonly hospitalModel: Model<HospitalModel>,
    @InjectModel('Patient') private readonly patientModel: Model<PatientModel>,
  ) {}

  private readonly s3 = new AWS.S3();
  private readonly logger = new Logger(ImportService.name);

  async generatePreSignedRequest(sourceType) {
    const fileType: string = mime.extension(sourceType);
    const key = `${uuidv4()}.${fileType}`;
    const bucket = config.get('aws.bucket.import');

    const params = {
      Bucket: bucket.name,
      Conditions: [
        ['content-length-range', 1, 157286400],
        { acl: 'public-read' },
      ],
      Expires: 120,
      Fields: {
        Key: key,
        Acl: 'public-read',
      },
    };

    return new Promise((resolve, reject) => {
      this.s3.createPresignedPost(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  async preprocess(data: S3ImportDto) {
    try {
      const responseData = {
        data: [],
        headers: [],
      };
      const parseStream: NodeJS.ReadWriteStream = papa.parse(
        papa.NODE_STREAM_INPUT,
        { header: true },
      );
      const bucket = config.get('aws.bucket.import');

      const awsReadStream = this.s3
        .getObject({
          Bucket: bucket.name,
          Key: data.key,
        })
        .createReadStream()
        .pipe(parseStream);
      const chunks = [];

      const parseStreamHandler = (chunk) => {
        if (chunks.length === 3) {
          awsReadStream.emit('close');
        } else {
          chunks.push(chunk);
        }
      };

      await new Promise<void>((resolve, reject) => {
        parseStream.on('data', parseStreamHandler);

        parseStream.on('end', () => {
          resolve();
        });

        parseStream.on('close', () => {
          resolve();
        });

        parseStream.on('error', (err) => {
          reject(err);
        });

        awsReadStream.on('end', () => {
          resolve();
        });

        awsReadStream.on('close', () => {
          resolve();
        });

        awsReadStream.on('error', (err) => {
          reject(err);
        });
      });

      responseData.data = chunks;

      if (chunks.length) {
        responseData.headers = Object.keys(chunks[0]);
      }

      return responseData;
    } catch (err) {
      this.logger.error('Import preprocess error', err);
    }
  }

  @OnEvent(EVENT_TYPES.CREATE_IMPORT_EVENT)
  async createImport(createImportDto: CreateImportDto) {
    this.logger.log(`Import started`);
    const key = createImportDto.dataFileUrl.split('/').pop();
    const defaultProperties =
      createImportDto.source === SOURCE_TYPE.PATIENT
        ? PATIENT_PROPERTIES
        : HOSPITAL_PROPERTIES;

    if (!key) {
      this.logger.error('Failed to upload. No file key');
      throw new BadRequestException({
        message: 'Failed to upload',
      });
    }

    const importEntity = new this.importModel({
      name: createImportDto.name,
      dataFileUrl: createImportDto.dataFileUrl,
      source: createImportDto.source,
      status: IMPORT_STATUS.IN_PROGRESS,
      type: createImportDto.type,
    });

    try {
      await importEntity.save();
    } catch (err) {
      this.logger.error(`Failed to create import: ${err}`);
      throw new BadRequestException({
        message: 'Failed to create import',
      })
    }

    const s3DataFileParams = {
      Bucket: config.get('aws.bucket.import.name'),
      Key: key,
    };

    const s3Stream = this.s3.getObject(s3DataFileParams).createReadStream();

    s3Stream.on('error', async (error) => {
      this.logger.error(`Import: data stream error ${error}`);
      await this.importModel.updateOne({ _id: importEntity._id }, { $set: { status: IMPORT_STATUS.FAILED }, notes: 'Import error' });
    });

    const parseStream = papaparse.parse(papaparse.NODE_STREAM_INPUT, {
      header: true,
    });
    s3Stream.pipe(parseStream);

    let queue: any[] = [];

    const upload = () =>
      new Promise((resolve, reject) => {
        let rateMux = false;
        let result: any;

        const requestRateTimeout = setTimeout(() => {
          if (result) return resolve(result);
          rateMux = true;
        }, MAX_REQUESTS_FREQUENCY);

        const matchedData = matchImportData(queue, defaultProperties);
        queue = [];
        
        if (matchedData.length) {
          if (createImportDto.source === SOURCE_TYPE.HOSPITAL) {
            const hospitals: HospitalModel[] = [];
            matchedData.forEach((data) => {
              const entity = new Hospital(data.properties);
              hospitals.push(new this.hospitalModel(entity));
            });
            this.hospitalModel.insertMany(hospitals)
              .then(() => resolve(true))
              .catch((err) => reject(err));
          } else {
            const patients: PatientModel[] = [];
            matchedData.forEach((data) => {
              const entity = new Patient(data.properties);
              patients.push(new this.patientModel(entity));
            });
            this.patientModel.insertMany(patients)
              .then(() => resolve(true))
              .catch((err) => reject(err));
          }
          clearTimeout(requestRateTimeout);        
        } else {
          return reject();
        }
      });

    parseStream.on('data', async (chunk) => {
      queue.push(chunk);

      if (queue.length === MAX_BATCH_SIZE) {
        parseStream.pause();
        try {
          await upload();
        } catch (err) {
          this.logger.error(`Import batch data upload error: ${err}`);
        }
        parseStream.resume();
      }
    });

    parseStream.on('end', async () => {
      try {
        await upload();
      } catch (err) {
        this.logger.error(`Import batch data upload error: ${err}`);
      }

      try {
        await this.importModel.updateOne({ _id: importEntity._id }, { $set: { status: IMPORT_STATUS.DONE }});
      } catch (err) {
        this.logger.error(`Import update import status. ${err}`);
      }
    });
  }
}
