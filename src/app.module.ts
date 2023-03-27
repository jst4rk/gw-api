import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewaysModule } from './gateways/gateways.module';
import { DevicesModule } from './devices/devices.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // I'm goind to hardcode here the mongodb url for testing
    MongooseModule.forRoot('mongodb+srv://dayronalfa:<password>@cluster0.vl6unu2.mongodb.net/musalasoft?retryWrites=true&w=majority'),
    MongooseModule.forRoot('mongodb://localhost/musalasoft'),
    GatewaysModule,
    DevicesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
