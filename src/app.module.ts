import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewaysModule } from './gateways/gateways.module';
import { DevicesModule } from './devices/devices.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/musalasoft'),
    GatewaysModule,
    DevicesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
