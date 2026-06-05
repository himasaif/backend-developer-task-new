import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  Model,
  HasMany,
} from 'sequelize-typescript';
import { Product } from 'src/modules/products/products.model';

@Table({ tableName: 'shops' })
export class Shop extends Model<Shop> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(8), allowNull: false })
  openingHour: string;

  @Column({ type: DataType.STRING(8), allowNull: false })
  closingHour: string;

  @Column({ type: DataType.STRING(10), allowNull: false })
  availability: 'busy' | 'open' | 'closed';

  @HasMany(() => Product)
  products: Product[];
}