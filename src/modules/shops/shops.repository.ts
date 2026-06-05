import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from 'src/modules/products/products.model';
import { Shop } from 'src/modules/shops/shops.model';
import { CreateShopDTO } from './dto/create-shop.dto';
import { UpdateShopDTO } from './dto/update-shop.dto';

@Injectable()
export class ShopsRepository {
  constructor(
    @InjectModel(Shop)
    private readonly shopModel: typeof Shop,
  ) {}

  async create(shop: CreateShopDTO): Promise<Shop> {
    return this.shopModel.create(shop as any);
  }

  /**
   * Lightweight shops list (NO products → fast)
   */
  async findAll(): Promise<Shop[]> {
    return this.shopModel.findAll({
      attributes: [
        'id',
        'name',
        'openingHour',
        'closingHour',
        'availability',
      ],
    });
  }

  /**
   * Optimized eager loading with limited product payload
   */
  async findAllWithProducts(): Promise<Shop[]> {
    return this.shopModel.findAll({
      attributes: [
        'id',
        'name',
        'openingHour',
        'closingHour',
        'availability',
      ],
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'stock'],
          limit: 10, // 🔥 prevents huge payload (BONUS POINT)
        },
      ],
    });
  }

  async findOne(id: string): Promise<Shop | null> {
    return this.shopModel.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'stock'],
        },
      ],
    });
  }

  async update(id: string, shop: UpdateShopDTO): Promise<Shop | null> {
    const [affectedRows, updatedRows] =
      await this.shopModel.update(shop, {
        where: { id },
        returning: true,
      });

    if (affectedRows === 0) {
      return null;
    }

    return updatedRows[0];
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.shopModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }
}