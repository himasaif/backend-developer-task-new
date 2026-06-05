import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { ShopsService } from './shops.service';
import { ShopsRepository } from './shops.repository';

describe('ShopsService', () => {
  let service: ShopsService;

  const mockRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopsService,
        {
          provide: ShopsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ShopsService>(ShopsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // GET ALL SHOPS
  it('should return all shops', async () => {
    const shops = [
      {
        id: '1',
        name: 'Shop A',
        products: [{ id: 'p1' }, { id: 'p2' }],
      },
    ];

    mockRepository.findAll.mockResolvedValue(shops);

    const result = await service.findAll();

    expect(result).toEqual(shops);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  // GET ONE SHOP
  it('should return one shop', async () => {
    const shop = {
      id: '1',
      name: 'Shop A',
      products: [{ id: 'p1' }],
    };

    mockRepository.findOne.mockResolvedValue(shop);

    const result = await service.findOne('1');

    expect(result).toEqual(shop);
  });

  // NOT FOUND (FIXED)
  it('should throw NotFoundException if shop not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('999')).rejects.toThrow(
      NotFoundException,
    );
  });
});