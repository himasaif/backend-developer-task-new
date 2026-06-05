import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDTO } from 'src/modules/members/dto/create-member.dto';
import { MemberDTO } from 'src/modules/members/dto/member.dto';
import { UpdateMemberDTO } from 'src/modules/members/dto/update-member.dto';
import { MembersRepository } from 'src/modules/members/members.repository';

export interface PaginatedMembersResult {
  data: MemberDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class MembersService {
  constructor(private readonly repository: MembersRepository) {}

  /**
   * Creates a new member.
   * @param {CreateMemberDTO} member - The member data to create.
   * @returns {Promise<MemberDTO>} The created member.
   */
  async create(member: CreateMemberDTO): Promise<MemberDTO> {
    return this.repository.create(member);
  }

  /**
   * Fetches all members with pagination to handle large datasets (70k+ members).
   * @param {number} page - Page number (default: 1).
   * @param {number} limit - Items per page (default: 20).
   * @returns {Promise<PaginatedMembersResult>} Paginated members result.
   */
  async findAll(page = 1, limit = 20): Promise<PaginatedMembersResult> {
    const { data, total } = await this.repository.findAll(page, limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Fetches a single member by ID.
   * @param {string} id - Member ID to look up.
   * @returns {Promise<MemberDTO>} The member.
   * @throws {NotFoundException} If the member is not found.
   */
  async findOne(id: string): Promise<MemberDTO> {
    const member = await this.repository.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with id ${id} not found`);
    }
    return member;
  }

  /**
   * Updates a member by ID.
   * @param {string} id - Member ID to update.
   * @param {UpdateMemberDTO} member - Fields to update.
   * @returns {Promise<MemberDTO>} The updated member.
   * @throws {NotFoundException} If the member is not found.
   */
  async update(id: string, member: UpdateMemberDTO): Promise<MemberDTO> {
    const updated = await this.repository.update(id, member);
    if (!updated) {
      throw new NotFoundException(`Member with id ${id} not found`);
    }
    return updated;
  }

  /**
   * Deletes a member by ID.
   * @param {string} id - Member ID to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If the member is not found.
   */
  async delete(id: string): Promise<void> {
    const member = await this.repository.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with id ${id} not found`);
    }
    return this.repository.delete(id);
  }
}