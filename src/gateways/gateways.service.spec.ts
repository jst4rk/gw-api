import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { Gateway } from './entities/gateway.entity';
import { GatewaysService } from './gateways.service';
import { GatewayFiltersDto } from './dto/create-gateway.dto';

describe('DevicesService', () => {
  let service: GatewaysService;

  const mockGateway = {
    _id: '641d23d23f956a7740d741ff',
    serialId: 'qwer2134',
    name: 'Test gateway',
    ipv4Address: '192.168.1.1',
    peripheralDevices: ['641d23d23f956a7740d741df'],
  };

  const mockFind = () => ({
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockGateway])
  });

  const mockGatewayModel = {
    create: jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockGateway)
    })),
    countDocuments: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(10)
    })),
    find: jest.fn().mockImplementation(mockFind),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndRemove: jest.fn().mockReturnThis(),
    populate: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockGateway)
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatewaysService,
        {
          provide: getModelToken(Gateway.name),
          useValue: mockGatewayModel,
        },
      ],
    }).compile();

    service = module.get<GatewaysService>(GatewaysService);
  });

  describe('create', () => {
    it('should create a gateway', async () => {
      const result = await service.create(mockGateway);
      expect(result).toEqual(mockGateway);
      expect(mockGatewayModel.create).toHaveBeenCalledWith(mockGateway);
    });

    it('should throw an error for invalid IPv4 address format', async () => {
      const createGatewayDto = {
        serialId: 'qwer2134',
        name: 'Test Gateway',
        ipv4Address: '192.168.1',
        peripheralDevices: ['641d23d23f956a7740d741df'],
      };

      await expect(service.create(createGatewayDto)).rejects.toThrowError(`Invalid IP Address format: ${createGatewayDto.ipv4Address}`);
    });

    it('should throw an error if the number of peripheral devices exceeds the maximum allowed', async () => {
      const createGatewayDto = {
        serialId: 'qwer2134',
        name: 'Test Gateway',
        ipv4Address: '192.168.1.1',
        peripheralDevices: Array.from({ length: 11 }, (_, i) => (`device_id_${i}`)),
      };

      await expect(service.create(createGatewayDto))
        .rejects
        .toThrowError(`The Maximun number of associated devices are 10. But you sent: ${createGatewayDto.peripheralDevices.length}`);
    });

    it('should throw HttpException if there is an error', async () => {
      mockGatewayModel.create.mockImplementationOnce(() => { throw new Error('Internal server error') });
      await expect(service.create(mockGateway)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return all gateways', async () => {
      const filters: GatewayFiltersDto = {};
      mockGatewayModel.populate.mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValueOnce([mockGateway])
      }));
      const result = await service.findAll(filters);
      expect(result).toEqual({ data: [mockGateway], meta: { total: 10 } });
      expect(mockGatewayModel.find).toHaveBeenCalledWith();
    });

    it('should throw HttpException if there is an error', async () => {
      mockGatewayModel.find.mockImplementationOnce(() => { throw new Error('Internal server error') })
      const filters: GatewayFiltersDto = {};
      await expect(service.findAll(filters)).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return a gateway by id', async () => {
      const gatewayId = 'some-gateway-id';
      mockGatewayModel.findById.mockImplementationOnce(() => ({
        exec: jest.fn().mockImplementationOnce(() => ({
          populate: jest.fn().mockResolvedValueOnce(mockGateway)
        })),
      }));
      const result = await service.findOne(gatewayId);
      expect(result).toEqual(mockGateway);
      expect(mockGatewayModel.findById).toHaveBeenCalledWith(gatewayId);
    });

    it('should throw NotFoundException if the gateway is not found', async () => {
      mockGatewayModel.findById.mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValueOnce(null)
      }));
      const gatewayId = 'some-gateway-id';
      await expect(service.findOne(gatewayId)).rejects.toThrow(`Gateway with id: ${gatewayId} not found!`);
    });

    it('should throw HttpException if there is an error', async () => {
      mockGatewayModel.findById.mockImplementationOnce(() => { throw new Error('Internal server error') })
      const gatewayId = 'some-gateway-id';
      await expect(service.findOne(gatewayId)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a gateway', async () => {
      const updateGatewayDto = {
        _id: '641d23d23f956a7740d741ff',
        serialId: 'qwer2134',
        name: 'Test gateway',
        ipv4Address: '192.168.1.1',
        peripheralDevices: ['641d23d23f956a7740d741df'],
      };

      mockGatewayModel.findById.mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValueOnce(mockGateway)
      }));
      mockGatewayModel.findByIdAndUpdate.mockImplementationOnce(() => ({
        populate: jest.fn().mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValueOnce(updateGatewayDto)
        })),
      }));
      const result = await service.update(mockGateway._id, updateGatewayDto);

      expect(mockGatewayModel.findById).toHaveBeenCalledWith(mockGateway._id);
      expect(mockGatewayModel.findByIdAndUpdate).toHaveBeenCalledWith(mockGateway._id, updateGatewayDto, { new: true });
      expect(result).toEqual(updateGatewayDto);
    });

    it('should throw an error for invalid IPv4 address format', async () => {
      const createGatewayDto = {
        serialId: 'qwer2134',
        name: 'Test Gateway',
        ipv4Address: '192.168.1',
        peripheralDevices: ['641d23d23f956a7740d741df'],
      };

      await expect(service.create(createGatewayDto)).rejects.toThrowError(`Invalid IP Address format: ${createGatewayDto.ipv4Address}`);
    });

    it('should throw an error if the number of peripheral devices exceeds the maximum allowed', async () => {
      const createGatewayDto = {
        serialId: 'qwer2134',
        name: 'Test Gateway',
        ipv4Address: '192.168.1.1',
        peripheralDevices: Array.from({ length: 11 }, (_, i) => (`device_id_${i}`)),
      };

      await expect(service.create(createGatewayDto))
        .rejects
        .toThrowError(`The Maximun number of associated devices are 10. But you sent: ${createGatewayDto.peripheralDevices.length}`);
    });

    it('should throw a NotFoundException when the gateway is not found', async () => {
      const updateDeviceDto = {
        _id: '641d23d23f956a7740d741ff',
        serialId: 'qwer2134',
        name: 'Test gateway',
        ipv4Address: '192.168.1.1',
        peripheralDevices: ['641d23d23f956a7740d741df'],
      };

      mockGatewayModel.findById.mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValueOnce(null)
      }));

      await expect(service.update(mockGateway._id, updateDeviceDto)).rejects.toThrow(`Gateway with id: ${mockGateway._id} not found!`);
    });
  });

  describe('remove', () => {
    it('should remove a gateway', async () => {
      mockGatewayModel.findById.mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValueOnce(mockGateway)
      }));
      mockGatewayModel.findByIdAndRemove.mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValueOnce(mockGateway)
      }));

      const result = await service.remove(mockGateway._id);

      expect(mockGatewayModel.findById).toHaveBeenCalledWith(mockGateway._id);
      expect(mockGatewayModel.findByIdAndRemove).toHaveBeenCalledWith(mockGateway._id);
      expect(result).toEqual(mockGateway);
    });

    it('should throw a NotFoundException when the gateway is not found', async () => {
      mockGatewayModel.findById.mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValueOnce(null)
      }));

      await expect(service.remove(mockGateway._id)).rejects.toThrow(`Gateway with id: ${mockGateway._id} not found!`);
    });
  });
});
