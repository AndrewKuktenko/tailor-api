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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Import', schema: importSchema }]),
    HttpModule,
  ],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
