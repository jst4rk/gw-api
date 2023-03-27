import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isEmptyOrNil } from '../common/utils/functions';

import { CreateDeviceDto, DeviceFiltersDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device, DeviceDocument } from './entities/device.entity';

// I'll handle the database logic here for simplicity, but I like having a .repository.ts file to handle all the database logic separately
@Injectable()
export class DevicesService implements OnModuleInit {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {}

  // For this demo, this is a nice way to create indexes
  // note that the index creation process could have an impact on application performance
  // this would create indexes base on the DeviceSchema
  async onModuleInit() {
    await this.deviceModel.createIndexes();
  }

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    try {
      const createdDevice = await this.deviceModel.create(createDeviceDto);

      return createdDevice;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    filters: DeviceFiltersDto,
  ): Promise<{ data: Device[]; meta: { total: number } }> {
    try {
      // const count = await this.deviceModel.countDocuments().exec();
      // const data = await this.deviceModel.find().exec();

      // return {
      //   data,
      //   meta: {
      //     total: count
      //   }
      // }

      const page = +filters.page;
      const limit = +filters.limit;
      let sort = '-createdAt';

      if (!isEmptyOrNil(filters.sort)) {
        sort = filters.sort;
      }

      const count = await this.deviceModel.countDocuments().exec();
      const data = await this.deviceModel
        .find()
        .skip(page * limit)
        .limit(limit)
        .sort(sort)
        .exec();

      return {
        data,
        meta: {
          total: count,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Device> {
    try {
      const device = await this.deviceModel.findById(id).exec();

      if (!device) {
        throw new NotFoundException(`Device with id: ${id} not found!`);
      }

      return device;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    try {
      const device = await this.deviceModel.findById(id).exec();

      if (!device) {
        throw new NotFoundException(`Device with id: ${id} not found!`);
      }

      return await this.deviceModel
        .findByIdAndUpdate(id, updateDeviceDto, { new: true })
        .exec();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<Device> {
    try {
      const device = await this.deviceModel.findById(id).exec();

      if (!device) {
        throw new NotFoundException(`Device with id: ${id} not found!`);
      }

      return await this.deviceModel.findByIdAndRemove(id).exec();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
