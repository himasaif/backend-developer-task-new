import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Member } from 'src/modules/members/members.model';

@Injectable()
export class MembersRepository {
  constructor(
    @InjectModel(Member) private readonly memberModel: typeof Member,
  ) {}

  /**
   * Creates a member row in the database.
   * @param {Partial<Member>} member - Member fields to save.
   * @returns {Promise<Member>} The created member row.
   */
  async create(member: Partial<Member>): Promise<Member> {
    return this.memberModel.create(member);
  }

  /**
   * Fetches paginated members from the database.
   * @param {number} page - Page number.
   * @param {number} limit - Items per page.
   * @returns {Promise<{ data: Member[]; total: number }>} Paginated members.
   */
  async findAll(page: number, limit: number): Promise<{ data: Member[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await this.memberModel.findAndCountAll({
      limit,
      offset,
    });
    return { data: rows, total: count };
  }

  /**
   * Fetches a single member by ID.
   * @param {string} id - Member ID to look up.
   * @returns {Promise<Member | null>} The member row or null.
   */
  async findOne(id: string): Promise<Member | null> {
    return this.memberModel.findByPk(id);
  }

  /**
   * Updates a member by ID and returns the updated row.
   * @param {string} id - Member ID to update.
   * @param {Partial<Member>} member - Fields to update.
   * @returns {Promise<Member | null>} The updated member or null.
   */
  async update(id: string, member: Partial<Member>): Promise<Member | null> {
    const result = await this.memberModel.update(member, {
      where: { id },
      returning: true,
    });
    return result[1][0] ?? null;
  }

  /**
   * Deletes a member by ID.
   * @param {string} id - Member ID to delete.
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await this.memberModel.destroy({ where: { id } });
  }
}