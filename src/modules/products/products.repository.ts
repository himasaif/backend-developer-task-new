import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Product } from 'src/modules/products/products.model';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  /**
   * Creates a product row in the database.
   * @param {Partial<Product>} product - Product fields to save.
   * @returns {Promise<Product>} The created product row.
   */
  async create(product: Partial<Product>): Promise<Product> {
    return this.productModel.create(product);
  }

  /**
   * Fetches all products, with optional case-insensitive name search.
   * @param {string} [name] - Optional name to search for.
   * @returns {Promise<Product[]>} All matched products.
   */
  async findAll(name?: string): Promise<Product[]> {
    return this.productModel.findAll({
      where: name
        ? { name: { [Op.iLike]: `%${name}%` } }
        : {},
    });
  }

  /**
   * Fetches a single product by ID.
   * @param {string} id - Product ID to look up.
   * @returns {Promise<Product | null>} The product row or null.
   */
  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findByPk(id);
  }

  /**
   * Updates a product by ID and returns the updated row.
   * @param {string} id - Product ID to update.
   * @param {Partial<Product>} product - Fields to update.
   * @returns {Promise<Product | null>} The updated product or null.
   */
  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const result = await this.productModel.update(product, {
      where: { id },
      returning: true,
    });
    return result[1][0] ?? null;
  }

  /**
   * Deletes a product by ID.
   * @param {string} id - Product ID to delete.
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await this.productModel.destroy({ where: { id } });
  }

  async findWithFilter(filters: Partial<Product>): Promise<Product[]> {
    return this.productModel.findAll({ where: filters });
  }
}