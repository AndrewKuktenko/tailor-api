import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ImportModule } from 'src/modules/api/import/import.module';
import * as config from 'config';
const primaryMongoConfig = config.get('primaryDb');

@Module({
  imports: [
    MongooseModule.forRoot(primaryMongoConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      poolSize: 500,
      ssl: false,
    }),
    EventEmitterModule.forRoot(),
    ImportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
