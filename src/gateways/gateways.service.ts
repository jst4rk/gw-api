import { HttpException, HttpStatus, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { isEmptyOrNil, isValidIPv4 } from '../common/utils/functions';
import { CreateGatewayDto, GatewayFiltersDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { Gateway, GatewayDocument } from './entities/gateway.entity';

// I'll handle the database logic here for simplicity, but I like having a .repository.ts file to handle all the database logic separately
@Injectable()
export class GatewaysService implements OnModuleInit {
  constructor(@InjectModel(Gateway.name) private gatewayModel: Model<GatewayDocument>) { }

  // For this demo, this is a nice way to create indexes
  // note that the index creation process could have an impact on application performance
  // this would create indexes base on the GatewaySchema
  async onModuleInit() {
    await this.gatewayModel.createIndexes();
  }

  async create(createGatewayDto: CreateGatewayDto): Promise<Gateway> {
    try {
      // This can be implemented in a custom validator used in the dto
      // I will do it here for simplicity
      if (!isValidIPv4(createGatewayDto.ipv4Address)) {
        throw new Error(`Invalid IP Address format: ${createGatewayDto.ipv4Address}`);
      }

      if (createGatewayDto?.peripheralDevices.length > 10) {
        throw new Error(`The Maximun number of associated devices are 10. But you sent: ${createGatewayDto?.peripheralDevices.length}`);
      }

      const createdGateway = await this.gatewayModel.create(createGatewayDto);

      return createdGateway.populate('peripheralDevices');
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(filters: GatewayFiltersDto): Promise<{ data: Gateway[], meta: { total: number } }> {
    try {
      const page = +filters.page;
      const limit = +filters.limit;
      let sort = '-createdAt';

      if (!isEmptyOrNil(filters.sort)) {
        sort = filters.sort;
      }

      const count = await this.gatewayModel.countDocuments().exec();
      const data = await this.gatewayModel.find()
        .skip(page * limit)
        .limit(limit)
        .populate('peripheralDevices')
        .sort(sort)
        .exec();

      return {
        data,
        meta: {
          total: count
        }
      }
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<Gateway> {
    try {
      const gateway = await this.gatewayModel.findById(id).exec();

      if (!gateway) {
        throw new NotFoundException(`Gateway with id: ${id} not found!`);
      }

      return await gateway.populate('peripheralDevices');
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateGatewayDto: UpdateGatewayDto): Promise<Gateway> {
    try {
      // The update method could be more complex as the UI could send only the fields that have been updated
      // then we need to merge the old document with the new data, this could easily be done with ramda or another
      // library, but for this demo I'll send all the gateway data for simplicity.
      const gateway = await this.gatewayModel.findById(id).exec();

      //* I always like to search first and manually assert if the resource that we are looking for does not exist.
      if (!gateway) {
        throw new NotFoundException(`Gateway with id: ${id} not found!`);
      }

      // This can be implemented in a custom validator used in the dto
      // I will do it here for simplicity
      if (!isValidIPv4(updateGatewayDto.ipv4Address)) {
        throw new Error(`Invalid IP Address format: ${updateGatewayDto.ipv4Address}`);
      }

      if (updateGatewayDto?.peripheralDevices.length > 10) {
        throw new Error(`The Maximun number of associated devices are 10. But you sent: ${updateGatewayDto?.peripheralDevices.length}`);
      }

      return await this.gatewayModel.findByIdAndUpdate(id, updateGatewayDto, { new: true })
        .populate('peripheralDevices')
        .exec();
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<Gateway> {
    try {
      const gateway = await this.gatewayModel.findById(id).exec();

      //* I always like to search first and manually assert if the resource that we are looking for does not exist.
      if (!gateway) {
        throw new NotFoundException(`Gateway with id: ${id} not found!`);
      }

      return await this.gatewayModel.findByIdAndRemove(id).exec();
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
