import { Test, TestingModule } from '@nestjs/testing';
import { GatewaysController } from './gateways.controller';
import { GatewaysService } from './gateways.service';

describe('GatewaysController', () => {
  let controller: GatewaysController;

  const mockGatewaysService = {
    create: jest.fn(() => new Promise((resolve) => resolve({}))),
    findAll: jest.fn(() => new Promise((resolve) => resolve({}))),
    deleteDeposits: jest.fn(() => new Promise((resolve) => resolve({}))),
    update: jest.fn(() => new Promise((resolve) => resolve({}))),
    findDepositGrouped: jest.fn(() => new Promise((resolve) => resolve({}))),
    findFundAmt: jest.fn(() => new Promise((resolve) => resolve({}))),
    findDepositDetail: jest.fn(() => new Promise((resolve) => resolve({}))),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewaysController],
      providers: [
        {
          provide: GatewaysService,
          useValue: mockGatewaysService,
        },
      ],
    }).compile();

    controller = module.get<GatewaysController>(GatewaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
