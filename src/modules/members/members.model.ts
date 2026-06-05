import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

@Table({ tableName: 'members' })
export class Member extends Model<Member> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  lastName: string;

  @Column({
    type: DataType.STRING(10),  
    allowNull: false,
  })
  gender: 'male' | 'female';

  @Column({ type: DataType.DATEONLY, allowNull: false }) 
  dateOfBirth: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  subscriptionDate: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  phone?: string;

  @Column({ type: DataType.UUID, allowNull: true })
  @ForeignKey(() => Member)
  centralMemberId?: string;

  @BelongsTo(() => Member)
  centralMember?: Member;

  @HasMany(() => Member, 'centralMemberId')
  familyMembers?: Member[];
}