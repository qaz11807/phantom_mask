import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  HasOne,
  ForeignKey,
} from 'sequelize-typescript';
import {Op} from 'sequelize';
import Order from './order.model';
import Pharmacy from './pharmacy.model';

@Table({
  tableName: 'Masks',
})
/**
 *
 */
export default class Mask extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.INTEGER)
  declare pack: number;

  @Column(DataType.STRING)
  declare color: string;

  @Column(DataType.FLOAT)
  declare price: number;

  @ForeignKey(() => Pharmacy)
  @Column
  declare pharmacyId: number;

  /** Asscoiations */
  @HasOne(() => Order)
  declare order: Order;

  @BelongsTo(() => Pharmacy)
  declare pharmacy: Pharmacy;

  /** Static Methods */

  /**
   * @param {string} keyWord
   * @param {string} colorKeyword
   * @param {[Date, Date]} priceRange
   */
  static async serachByKeyword(
    keyWord: string,
    colorKeyword?: string,
  ) {
    const queryParam = (keyWord: string, colorKeyword?: string) => {
      const defaults = {
        name: {
          [Op.iLike]: `%${keyWord}%`,
        },
      };
      return colorKeyword ? {
        ...defaults,
        color: {
          [Op.iLike]: `%${colorKeyword}%`,
        },
      } : defaults;
    };

    try {
      return await Mask.findAll({
        where: queryParam(keyWord, colorKeyword),
        attributes: [
          'id', 'name', 'pack', 'color', 'price',
        ],
        nest: true,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };
}
