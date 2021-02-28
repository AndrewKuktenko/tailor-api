import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ImportModule } from 'src/modules/api/import/import.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest', {
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
