import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  HttpModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { importSchema } from 'src/schemas/import/import.schema';
import { hospitalSchema } from 'src/schemas/hospital/hospital.schema';
import { patientSchema } from 'src/schemas/patient/patient.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Import', schema: importSchema },
      { name: 'Hospital', schema: hospitalSchema },
      { name: 'Patient', schema: patientSchema },
    ]),
    HttpModule,
  ],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
