import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import {
  fn,
  col,
} from 'sequelize';
import {
  safeRangeCreator,
} from '../utils/db-helper';

import Order from './order.model';
@Table({
  tableName: 'Users',
})
/**
 *
 */
export default class User extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.FLOAT)
  declare cashBalance: number;

  @HasMany(() => Order)
  declare orders: Order[];

  /** Static Methods */

  /**
   * @param {number} limit
   * @param {[Date, Date]} dateRange
   */
  static async findTopTranscation(
    limit: number,
    dateRange: [Date, Date],
  ) {
    type aggerateDataType = {
      user: {
        id: number
        name: string
        cashBalacne: number
      }
      priceAmount: number
    };
    try {
      const transcations = await Order.findAll({
        attributes: [
          [fn('SUM', col('Order.transactionAmount')), 'priceAmount'],
        ],
        group: ['user.id'],
        where: safeRangeCreator('transactionDate', dateRange),
        include: [{
          model: User,
          attributes: ['id', 'name', 'cashBalance'],
        }],
        nest: true,
        raw: true,
      }) as unknown as aggerateDataType[];

      return transcations
        .sort((a, b) => b.priceAmount - a.priceAmount).slice(0, limit);
    } catch (error) {
      throw error;
    }
  };
}
