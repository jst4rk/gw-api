import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DevicesService } from './devices.service';
import { Device } from './entities/device.entity';
import { HttpException } from '@nestjs/common';
import { DeviceFiltersDto } from './dto/create-device.dto';

describe('DevicesService', () => {
  let service: DevicesService;

  const mockDevice = {
    _id: '641d283c4432db8aa242a710',
    uid: 1634626,
    vendor: 'Xiaomi',
    createdAt: new Date(),
    status: 'offline',
  };

  const mockDeviceModel = {
    create: jest.fn().mockResolvedValue(mockDevice),
    find: jest.fn().mockReturnThis(),
    countDocuments: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(10)
    })),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndRemove: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockDevice),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: getModelToken(Device.name),
          useValue: mockDeviceModel,
        },
      ],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
  });

  describe('create', () => {
    it('should create a device', async () => {
      const result = await service.create(mockDevice);
      expect(result).toEqual(mockDevice);
      expect(mockDeviceModel.create).toHaveBeenCalledWith(mockDevice);
    });

    it('should throw HttpException if there is an error', async () => {
      jest.spyOn(mockDeviceModel, 'create').mockRejectedValue(new Error('Internal server error'));
      await expect(service.create(mockDevice)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return all devices', async () => {
      const filters: DeviceFiltersDto = {};
      mockDeviceModel.exec.mockResolvedValueOnce([mockDevice])
      const result = await service.findAll(filters);
      expect(result).toEqual({ data: [mockDevice], meta: { total: 10 } });
      expect(mockDeviceModel.find).toHaveBeenCalledWith();
    });

    it('should throw HttpException if there is an error', async () => {
      mockDeviceModel.find.mockImplementationOnce(() => { throw new Error('Internal server error') })
      const filters: DeviceFiltersDto = {};
      await expect(service.findAll(filters)).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return a device by id', async () => {
      const deviceId = 'some-device-id';
      const result = await service.findOne(deviceId);
      expect(result).toEqual(mockDevice);
      expect(mockDeviceModel.findById).toHaveBeenCalledWith(deviceId);
    });

    it('should throw NotFoundException if the device is not found', async () => {
      mockDeviceModel.exec.mockResolvedValueOnce(null);
      const deviceId = 'some-device-id';
      await expect(service.findOne(deviceId)).rejects.toThrow(`Device with id: ${deviceId} not found!`);
    });

    it('should throw HttpException if there is an error', async () => {
      mockDeviceModel.findById.mockImplementationOnce(() => { throw new Error('Internal server error') });
      const deviceId = 'some-device-id';
      await expect(service.findOne(deviceId)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a device', async () => {
      const updateDeviceDto = {
        _id: '641d283c4432db8aa242a710',
        uid: 1111111,
        vendor: 'Samsung Updated',
        createdAt: new Date(),
        status: 'online',
      };

      mockDeviceModel.findByIdAndUpdate.mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValueOnce(updateDeviceDto)
      }));
      const result = await service.update(mockDevice._id, updateDeviceDto);

      expect(mockDeviceModel.findById).toHaveBeenCalledWith(mockDevice._id);
      expect(mockDeviceModel.findByIdAndUpdate).toHaveBeenCalledWith(mockDevice._id, updateDeviceDto, { new: true });
      expect(result).toEqual(updateDeviceDto);
    });

    it('should throw a NotFoundException when the device is not found', async () => {
      const updateDeviceDto = {
        _id: '641d283c4432db8aa242a710',
        uid: 1111111,
        vendor: 'Samsung Updated',
        createdAt: new Date(),
        status: 'online',
      };

      mockDeviceModel.exec.mockResolvedValueOnce(null);

      await expect(service.update(mockDevice._id, updateDeviceDto)).rejects.toThrow(`Device with id: ${mockDevice._id} not found!`);
    });
  });

  describe('remove', () => {
    it('should remove a device', async () => {
      const result = await service.remove(mockDevice._id);

      expect(mockDeviceModel.findById).toHaveBeenCalledWith(mockDevice._id);
      expect(mockDeviceModel.findByIdAndRemove).toHaveBeenCalledWith(mockDevice._id);
      expect(result).toEqual(mockDevice);
    });

    it('should throw a NotFoundException when the device is not found', async () => {
      mockDeviceModel.exec.mockResolvedValueOnce(null);

      await expect(service.remove(mockDevice._id)).rejects.toThrow(`Device with id: ${mockDevice._id} not found!`);
    });
  });
});
