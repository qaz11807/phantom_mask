import {Sequelize, DataTypes, ModelStatic, Model, col, fn, Op} from 'sequelize';
import {CompareConditions, getFilterFunction} from '../utils/filter-helper';
import MaskInstance from './interfaces/mask-interface';
import DB from './';
import PharmacyInstance from './interfaces/pharmacy-interface';
import {safeRangeCreator} from '../utils/db-helper';

interface MaskStatic {
  associate?: (model: {[ key :string ]: ModelStatic<Model>}) => void;
  findPharmaciesByPrice?: (
    condition: keyof typeof CompareConditions,
    amount: number,
    priceRange?: [number, number],
  ) => Promise<{
    maskCount: number,
    Pharmacy: PharmacyInstance
  }[]>
  serachByKeyword?: (
    keyWord: string,
    colorKeyword?: string,
  ) => Promise<MaskInstance[]>
}

export default (sequelize: Sequelize) => {
  const Mask : ModelStatic<MaskInstance> & MaskStatic =
    sequelize.define<MaskInstance>('Mask', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      pack: {
        type: DataTypes.INTEGER,
      },
      color: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.DOUBLE,
      },
    });

  Mask.associate = function(models) {
    Mask.belongsTo(models['Pharmacy']);
    Mask.hasMany(models['Order']);
  };

  Mask.findPharmaciesByPrice = async function(
    condition, amount, priceRange,
  ) {
    const Pharmacy = DB.models.Pharmacy;
    if (!(condition in CompareConditions)) {
      throw new Error('Conditon format error!');
    }

    try {
      const pharmacies = await Mask.findAll({
        attributes: [
          [fn('COUNT', col('Pharmacy.id')), 'maskCount'],
        ],
        group: ['Pharmacy.id'],
        where: safeRangeCreator('price', priceRange),
        include: [{
          model: Pharmacy,
          attributes: ['name', 'cashBalance'],
        }],
        nest: true,
        raw: true,
      });
      return pharmacies
        .filter(getFilterFunction(condition, amount))
        .sort((
          a: any,
          b: any,
        ) => a.maskCount - b.maskCount) as any;
    } catch (error) {
      throw error;
    }
  };

  Mask.serachByKeyword = async function(
    keyWord, colorKeyword?,
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

  return Mask;
};
