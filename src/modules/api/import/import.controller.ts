import {
  Controller,
  Query,
  Get,
  UseInterceptors,
  Post,
  Body,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ImportService } from './import.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { S3ImportDto } from './dto/s3.import.dto';
import { CreateImportDto } from './dto/create.import.dto';
import { EVENT_TYPES } from 'src/interfaces/event.types';

@Controller('/api/v1/import')
export class ImportController {
  constructor(
    private readonly importService: ImportService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createImport(@Body() createImportDto: CreateImportDto) {
    this.eventEmitter.emit(EVENT_TYPES.CREATE_IMPORT_EVENT, createImportDto);
  }

  @Get('pre-signed')
  @UseInterceptors(FilesInterceptor('file'))
  async preSigned(@Query('sourceType') sourceType: string) {
    return await this.importService.generatePreSignedRequest(sourceType);
  }

  @Post('preprocess')
  async preprocess(@Body() s3Data: S3ImportDto) {
    return await this.importService.preprocess(s3Data);
  }
}
