import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { CreateShopDTO } from 'src/modules/shops/dto/create-shop.dto';
import { ShopWithProductsDTO } from 'src/modules/shops/dto/shop-with-products.dto';
import { ShopDTO } from 'src/modules/shops/dto/shop.dto';
import { UpdateShopDTO } from 'src/modules/shops/dto/update-shop.dto';
import { ShopsRepository } from 'src/modules/shops/shops.repository';

@Injectable()
export class ShopsService {
  constructor(
    private readonly repository: ShopsRepository,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(shop: CreateShopDTO): Promise<ShopDTO> {
    const created = await this.repository.create(shop);

    await this.cacheManager.del('shops:all');
    await this.cacheManager.del('shops:with-products');

    return created;
  }

  async findAll(): Promise<ShopDTO[]> {
    const cacheKey = 'shops:all';

    const cached =
      await this.cacheManager.get<ShopDTO[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const shops = await this.repository.findAll();

    await this.cacheManager.set(cacheKey, shops);

    return shops;
  }

  /**
   * Fetches all shops with their products using eager loading.
   * This replaces the previous N+1 query implementation.
   */
  async findAllWithProducts(): Promise<ShopWithProductsDTO[]> {
    const cacheKey = 'shops:with-products';

    const cached =
      await this.cacheManager.get<ShopWithProductsDTO[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const shops = await this.repository.findAllWithProducts();

    await this.cacheManager.set(cacheKey, shops);

    return shops;
  }

  async findOne(id: string): Promise<ShopDTO> {
    const cacheKey = `shop:${id}`;

    const cached =
      await this.cacheManager.get<ShopDTO>(cacheKey);

    if (cached) {
      return cached;
    }

    const shop = await this.repository.findOne(id);

    if (!shop) {
      throw new NotFoundException(`Shop with id ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, shop);

    return shop;
  }

  async update(id: string, shop: UpdateShopDTO): Promise<ShopDTO> {
    const updatedShop = await this.repository.update(id, shop);

    if (!updatedShop) {
      throw new NotFoundException(`Shop with id ${id} not found`);
    }

    await this.cacheManager.del(`shop:${id}`);
    await this.cacheManager.del('shops:all');
    await this.cacheManager.del('shops:with-products');

    return updatedShop;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Shop with id ${id} not found`);
    }

    await this.cacheManager.del(`shop:${id}`);
    await this.cacheManager.del('shops:all');
    await this.cacheManager.del('shops:with-products');
  }
}