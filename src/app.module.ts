import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewaysModule } from './gateways/gateways.module';
import { DevicesModule } from './devices/devices.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // * I'm goind to hardcode here the mongodb url for testing
    // but this must be in a env var
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost/musalasoft'),
    // * Uncomment this for test in a local environment
    // * MongooseModule.forRoot('mongodb://localhost/musalasoft'),
    GatewaysModule,
    DevicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
