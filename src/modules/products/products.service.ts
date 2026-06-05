import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { ProductsRepository } from 'src/modules/products/products.repository';
import { ProductDTO } from 'src/modules/products/dto/product.dto';
import { CreateProductDTO } from 'src/modules/products/dto/create-product.dto';
import { UpdateProductDTO } from 'src/modules/products/dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly repository: ProductsRepository,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Creates a new product.
   */
  async create(product: CreateProductDTO): Promise<ProductDTO> {
    const created = await this.repository.create(product);

    await this.cacheManager.del('products:all');

    return created;
  }

  /**
   * Fetches all products with optional name search.
   */
  async findAll(name?: string): Promise<ProductDTO[]> {
    const cacheKey = `products:${name ?? 'all'}`;

    const cached =
      await this.cacheManager.get<ProductDTO[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const products = await this.repository.findAll(name);

    await this.cacheManager.set(cacheKey, products);

    return products;
  }

  /**
   * Fetches a single product by ID.
   */
  async findOne(id: string): Promise<ProductDTO> {
    const cacheKey = `product:${id}`;

    const cached =
      await this.cacheManager.get<ProductDTO>(cacheKey);

    if (cached) {
      return cached;
    }

    const product = await this.repository.findOne(id);

    if (!product) {
      throw new NotFoundException(
        `Product with id ${id} not found`,
      );
    }

    await this.cacheManager.set(cacheKey, product);

    return product;
  }

  /**
   * Updates a product by ID.
   */
  async update(
    id: string,
    product: UpdateProductDTO,
  ): Promise<ProductDTO> {
    const updated = await this.repository.update(id, product);

    if (!updated) {
      throw new NotFoundException(
        `Product with id ${id} not found`,
      );
    }

    await this.cacheManager.del(`product:${id}`);
    await this.cacheManager.del('products:all');

    return updated;
  }

  /**
   * Deletes a product by ID.
   */
  async delete(id: string): Promise<void> {
    const product = await this.repository.findOne(id);

    if (!product) {
      throw new NotFoundException(
        `Product with id ${id} not found`,
      );
    }

    await this.repository.delete(id);

    await this.cacheManager.del(`product:${id}`);
    await this.cacheManager.del('products:all');
  }

  /**
   * Finds products using filters.
   */
  async findWithFilter(
    filter: Partial<ProductDTO>,
  ): Promise<ProductDTO[]> {
    return this.repository.findWithFilter(filter as any);
  }
}