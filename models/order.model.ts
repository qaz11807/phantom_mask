import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import {fn, col} from 'sequelize';
import {safeRangeCreator} from '../utils/db-helper';
import Mask from './mask.model';
import Pharmacy from './pharmacy.model';
import User from './user.model';
import DB from './';

@Table({
  tableName: 'Orders',
})
/**
 *
 */
export default class Order extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column(DataType.DATE)
  declare transactionDate: Date;

  @Column(DataType.FLOAT)
  declare transactionAmount: number;

  @ForeignKey(() => Mask)
  @Column
  declare maskId: number;

  @ForeignKey(() => Pharmacy)
  @Column
  declare pharmacyId: number;

  @ForeignKey(() => User)
  @Column
  declare userId: number;

  /** Asscoiations */
  @BelongsTo(() => Pharmacy)
  declare pharmacy: Pharmacy;

  @BelongsTo(() => Mask)
  declare mask: Mask;

  @BelongsTo(() => User)
  declare user: User;

  /** Static Methods */

  /**
   * @param {[Date, Date]} dateRange
   */
  static async calcSalesPerformanceByDate(
    dateRange: [Date, Date],
  ) {
    type aggerateDataType = {
      maskAmount: number
      priceAmount: number
    };
    try {
      const results = await this.findAll({
        attributes: [
          [fn('SUM', col('Order.transactionAmount')), 'priceAmount'],
          [fn('COUNT', col('Order.id')), 'maskAmount'],
        ],
        where: safeRangeCreator('transactionDate', dateRange),
        nest: true,
        raw: true,
      }) as unknown as aggerateDataType[];
      return results[0];
    } catch (error) {
      throw error;
    }
  };

  /**
   * @param {number} maskId
   * @param {number} userId
   */
  static async makeOrder(
    maskId: number,
    userId: number,
  ) {
    try {
      return await DB.createdTranscation(async (t) => {
        const mask = await Mask.findByPk(maskId);
        const user = await User.findByPk(userId);

        if (!mask) {
          throw new Error('mask not exists!');
        }

        if (!user) {
          throw new Error('user not exists!');
        }

        const pharmacy = await mask.$get('pharmacy');

        if (!pharmacy) {
          throw new Error('pharmacy not exists!');
        }

        const order = await Order.create({
          transactionDate: new Date(),
          transactionAmount: mask.price,
          pharmacyId: pharmacy.id,
          userId: pharmacy.id,
          maskId: pharmacy.id,
        }, {transaction: t});

        await user.decrement({
          'cashBalance': mask.price,
        }, {transaction: t});

        await pharmacy.increment({
          'cashBalance': mask.price,
        }, {transaction: t});

        return {
          id: order.id!,
          transactionDate: order.transactionDate,
          transactionAmount: order.transactionAmount,
          mask: {
            id: mask.id,
            name: mask.name,
            pack: mask.pack,
            price: mask.price,
            color: mask.color,
          },
          user: {
            id: user.id,
            name: user.name,
            cashBalance: user.cashBalance,
          },
          pharmacy: {
            id: pharmacy.id,
            name: pharmacy.name,
            cashBalance: pharmacy.cashBalance,
          },
        };
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

