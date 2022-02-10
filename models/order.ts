import {
  Sequelize,
  DataTypes,
  ModelStatic,
  Model,
  fn,
  col,
} from 'sequelize';
import OrderInstance from './interfaces/order-interface';
import UserInstance from './interfaces/user-interface';
import DB from './';
import {safeRangeCreator} from '../utils/db-helper';

interface OrderDetailed {
  id: number
  transactionDate: Date
  transactionAmount: number
  Mask: {
    id: number
    name: string
    pack: number
    price: number
    color: string
  }
  User: {
    id: number
    name: string
    cashBalance: number
  }
  Pharmacy: {
    id: number
    name: string
    cashBalance: number
    }
}
interface OrderStatic {
  associate?: (model: {[ key :string ]: ModelStatic<Model>}) => void;
  findTopTranscationUser?: (
    limit: number,
    dateRange?: [Date, Date]
  ) => Promise<{
    priceAmount: number,
    User: UserInstance,
  }>
  calcSalesPerformanceByDate?: (
    dateRange?: [Date, Date]
  ) => Promise<{
    priceAmount: number,
    maskAmount: number,
  }>
  makeOrder?: (
    maskId: number,
    userId: number,
  ) => Promise<OrderDetailed>
}

export default (sequelize: Sequelize) => {
  const Order : ModelStatic<OrderInstance> & OrderStatic =
    sequelize.define<OrderInstance>('Order', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      transactionDate: {
        type: DataTypes.DATE,
      },
      transactionAmount: {
        type: DataTypes.DOUBLE,
      },
    });

  Order.associate = function(models) {
    Order.belongsTo(models['Mask']);
    Order.belongsTo(models['User']);
    Order.belongsTo(models['Pharmacy']);
  };

  Order.findTopTranscationUser = async function(
    limit, dateRange,
  ) {
    try {
      const User = DB.models.User;

      const transcations = await Order.findAll({
        attributes: [
          [fn('SUM', col('Order.transactionAmount')), 'priceAmount'],
        ],
        group: ['User.id'],
        where: safeRangeCreator('transactionDate', dateRange),
        include: [{
          model: User,
          attributes: ['id', 'name', 'cashBalance'],
        }],
        nest: true,
        raw: true,
      });

      return transcations
        .sort((
          a: any,
          b: any,
        ) => b.priceAmount - a.priceAmount).slice(0, limit) as any;
    } catch (error) {
      throw error;
    }
  };

  Order.calcSalesPerformanceByDate = async function(
    dateRange,
  ) {
    try {
      const results = await Order.findAll({
        attributes: [
          [fn('SUM', col('Order.transactionAmount')), 'priceAmount'],
          [fn('COUNT', col('Order.id')), 'maskAmount'],
        ],
        where: safeRangeCreator('transactionDate', dateRange),
        nest: true,
        raw: true,
      });
      return results[0] as any;
    } catch (error) {
      throw error;
    }
  };

  Order.makeOrder = async function(
    maskId, userId,
  ) {
    const Mask = DB.models.Mask;
    const User = DB.models.User;
    try {
      return await DB.createdTranscation(async (t) => {
        const mask = await Mask.findByPk(maskId);
        const user = await User.findByPk(userId);
        const pharmacy = await mask.getPharmacy();

        const order = await Order.create({
          transactionDate: new Date(),
          transactionAmount: mask.price,
        }, {transaction: t});

        await order.setMask(mask, {transaction: t});
        await order.setPharmacy(pharmacy, {transaction: t});
        await order.setUser(user, {transaction: t});

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
          Mask: {
            id: mask.id,
            name: mask.name,
            pack: mask.pack,
            price: mask.price,
            color: mask.color,
          },
          User: {
            id: user.id,
            name: user.name,
            cashBalance: user.cashBalance,
          },
          Pharmacy: {
            id: pharmacy.id,
            name: pharmacy.name,
            cashBalance: pharmacy.cashBalance,
          },
        };
      });
    } catch (error) {
      throw error;
    }
  };

  return Order;
};


