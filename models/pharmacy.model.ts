import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import {Op, col, fn} from 'sequelize';
import {isTime, safeDayCreate} from '../utils/busy';
import {safeRangeCreator} from '../utils/db-helper';
import {CompareConditions, getFilterFunction} from '../utils/filter-helper';
import Mask from './mask.model';
import Order from './order.model';
import ServiceHour from './serviceHour.model';

@Table({
  tableName: 'Pharmacies',
})
/**
 *
 */
export default class Pharmacy extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.FLOAT)
  declare cashBalance: number;

  /** Asscoiations */
  @HasMany(() => ServiceHour)
  declare serviceHours: ServiceHour[];

  @HasMany(() => Mask)
  declare masks: Mask[];

  @HasMany(() => Order)
  declare orders: Order[];

  /** static methods */

  /**
   * @param {string} time
   * @param {number} dayOfweek
   */
  static async findOpening(
    time: string,
    dayOfweek?: number,
  ) {
    if (!isTime(time)) {
      throw new Error('Time format error!');
    }
    const day = safeDayCreate(dayOfweek);

    const queryParam = (time: string, day: number | null = null ) => {
      const gteOpenTIme = {
        openTime: {
          [Op.lte]: time,
        },
      };
      const equalOpenDay = {
        dayOfOpen: day,
      };
      const combineQueryOpen = day ?
        {...gteOpenTIme, ...equalOpenDay} : gteOpenTIme;

      const lteCloseTIme = {
        closeTime: {
          [Op.gte]: time,
        },
      };
      const equalCloseDay = {
        dayOfClose: day,
      };
      const combineQueryClose = day ?
        {...lteCloseTIme, ...equalCloseDay} : lteCloseTIme;

      const sameDayQuery = {
        [Op.and]: [
          {
            openTime: {
              [Op.lte]: col('closeTime'),
            },
          },
          {
            ...combineQueryOpen,
            ...combineQueryClose,
          },
        ],
      };
      const crossDayQuery = {
        [Op.and]: [
          {
            openTime: {
              [Op.gt]: col('closeTime'),
            },
          },
          {
            [Op.or]: [
              combineQueryOpen,
              combineQueryClose,
            ],
          },
        ],
      };
      return [sameDayQuery, crossDayQuery];
    };

    type aggerateDataType = {
      pharmacyId: number
      pharmacy: {
        id: number
        name: string
        cashBalacne: number
      }
    };

    try {
      const results = await ServiceHour.findAll({
        where: {
          [Op.or]: queryParam(time, day),
        },
        attributes: ['pharmacyId'],
        group: ['pharmacyId', 'pharmacy.id'],
        include: [{
          model: Pharmacy,
          attributes: ['id', 'name', 'cashBalance'],
        }],
        nest: true,
        raw: true,
      }) as unknown as aggerateDataType[];

      console.log(results);

      return results.map((d) => d.pharmacy);
    } catch (error) {
      throw error;
    }
  }

  /**
 * @param {CompareConditions} condition
 * @param {number} amount
 * @param {[number, number]} priceRange
 */
  static async findByPrice(
    condition: CompareConditions,
    amount: number,
    priceRange: [number, number],
  ) {
    if (!(condition in CompareConditions)) {
      throw new Error('Conditon format error!');
    }

    type aggerateDataType = {
      pharmacy: {
        id: number
        name: string
        cashBalacne: number
      }
      maskCount: number
    };

    try {
      const pharmacies = await Mask.findAll({
        attributes: [
          [fn('COUNT', col('pharmacy.id')), 'maskCount'],
        ],
        group: ['pharmacy.id'],
        where: safeRangeCreator('price', priceRange),
        include: [{
          model: Pharmacy,
          attributes: ['id', 'name', 'cashBalance'],
        }],
        nest: true,
        raw: true,
      }) as unknown as aggerateDataType[];
      return pharmacies
        .filter(getFilterFunction(condition, amount))
        .sort((a: any, b: any) => a.maskCount - b.maskCount);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {Order} pharmacyName
   * @param {SequelizeOrder} sort
   */
  static async getMasksByName(
    pharmacyName: string,
    sort?: [string, 'DESC' | 'ASC'][],
  ) {
    const pharmacy = await this.findOne({
      where: {
        name: pharmacyName,
      },
    });

    if (!pharmacy) {
      throw new Error('Pharmacy not exist!');
    }

    try {
      return await pharmacy.$get(
        'masks', {
          attributes: [
            'id', 'name', 'pack', 'color', 'price',
          ],
          order: sort,
          raw: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }
}

