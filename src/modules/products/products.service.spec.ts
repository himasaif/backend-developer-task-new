import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findWithFilter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // CREATE
  it('should create product', async () => {
    const dto = { name: 'Apple Juice' };

    mockRepository.create.mockResolvedValue(dto);

    const result = await service.create(dto as any);

    expect(result).toEqual(dto);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
  });

  // FIND ALL
  it('should return all products', async () => {
    const products = [{ id: '1' }];

    mockRepository.findAll.mockResolvedValue(products);

    const result = await service.findAll();

    expect(result).toEqual(products);
  });

  // FIND ONE SUCCESS
  it('should return one product', async () => {
    const product = { id: '1' };

    mockRepository.findOne.mockResolvedValue(product);

    const result = await service.findOne('1');

    expect(result).toEqual(product);
  });

  // FIND ONE FAIL
  it('should throw NotFoundException if product not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('999')).rejects.toThrow(
      NotFoundException,
    );
  });

  // UPDATE SUCCESS
  it('should update product', async () => {
    const updated = { id: '1', name: 'Updated' };

    mockRepository.update.mockResolvedValue(updated);

    const result = await service.update('1', { name: 'Updated' } as any);

    expect(result).toEqual(updated);
  });

  // UPDATE FAIL
  it('should throw NotFoundException on update if not found', async () => {
    mockRepository.update.mockResolvedValue(null);

    await expect(
      service.update('999', { name: 'X' } as any),
    ).rejects.toThrow(NotFoundException);
  });

  // DELETE SUCCESS
  it('should delete product', async () => {
    mockRepository.findOne.mockResolvedValue({ id: '1' });

    mockRepository.delete.mockResolvedValue(undefined);

    await service.delete('1');

    expect(mockRepository.delete).toHaveBeenCalledWith('1');
  });

  // DELETE FAIL
  it('should throw NotFoundException on delete if not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.delete('999')).rejects.toThrow(
      NotFoundException,
    );
  });

  // FILTER
  it('should filter products', async () => {
    const data = [{ id: '1', name: 'Apple' }];

    mockRepository.findWithFilter.mockResolvedValue(data);

    const result = await service.findWithFilter({ name: 'Apple' } as any);

    expect(result).toEqual(data);
  });
});