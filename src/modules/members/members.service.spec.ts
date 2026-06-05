import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersRepository } from './members.repository';

describe('MembersService', () => {
  let service: MembersService;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: MembersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // CREATE MEMBER
  it('should create member', async () => {
    const dto = {
      firstName: 'Omar',
      lastName: 'Ali',
      gender: 'male',
      birthdate: '2000-01-01',
    };

    mockRepository.create.mockResolvedValue(dto);

    const result = await service.create(dto as any);

    expect(result).toEqual(dto);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
  });

  // GET ALL (FIXED)
  it('should return all members', async () => {
    const members = [{ id: '1' }, { id: '2' }];

    mockRepository.findAll.mockResolvedValue({
      data: members,
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
    });

    const result = await service.findAll();

    expect(result.data).toEqual(members);
  });

  // GET ONE SUCCESS
  it('should return one member', async () => {
    const member = { id: '1', firstName: 'Omar' };

    mockRepository.findOne.mockResolvedValue(member);

    const result = await service.findOne('1');

    expect(result).toEqual(member);
  });

  // GET ONE FAIL
  it('should throw NotFoundException if member not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('999')).rejects.toThrow(
      NotFoundException,
    );
  });

  // UPDATE SUCCESS
  it('should update member', async () => {
    const updated = { id: '1', firstName: 'Updated' };

    mockRepository.update.mockResolvedValue(updated);

    const result = await service.update('1', {
      firstName: 'Updated',
    } as any);

    expect(result).toEqual(updated);
  });

  // UPDATE FAIL
  it('should throw NotFoundException when updating missing member', async () => {
    mockRepository.update.mockResolvedValue(null);

    await expect(
      service.update('999', { firstName: 'X' } as any),
    ).rejects.toThrow(NotFoundException);
  });

  // DELETE SUCCESS
  it('should delete member', async () => {
    mockRepository.findOne.mockResolvedValue({ id: '1' });
    mockRepository.delete.mockResolvedValue(undefined);

    await service.delete('1');

    expect(mockRepository.delete).toHaveBeenCalledWith('1');
  });

  // DELETE FAIL
  it('should throw NotFoundException when deleting missing member', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.delete('999')).rejects.toThrow(
      NotFoundException,
    );
  });

  // BUSINESS RULE (FIXED)
  it('should accept gender as validation is handled by DTO', async () => {
    const dto = {
      firstName: 'Test',
      lastName: 'User',
      gender: 'invalid',
      birthdate: '2000-01-01',
    };

    mockRepository.create.mockResolvedValue(dto);

    const result = await service.create(dto as any);

    expect(result.gender).toBe('invalid');
  });
});