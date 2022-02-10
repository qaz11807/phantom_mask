import {
  Sequelize,
  DataTypes,
  ModelStatic,
  Model,
  Op,
  col,
  Order,
} from 'sequelize';
import MaskInstance from './interfaces/mask-interface';
import PharmacyInstance from './interfaces/pharmacy-interface';
import {Days} from './interfaces/serviceHours-interface';
import DB from './';
import {isTime} from '../utils/busy';

interface PharmacyStatic {
  associate?: (model: {[ key :string ]: ModelStatic<Model>}) => void;
  getMask?: (
    pharmacy: PharmacyInstance,
    maskName: {
      name: string,
      pack: number,
      color: string,
    }
  ) => Promise<MaskInstance>;
  findOpeningPharmacy?: (
    time: string,
    dayOfweek?: number | string,
  ) => Promise<PharmacyInstance[]>;
  findMasksByPharmacyName?: (
    pharmacyName: string,
    sort? : Order,
  ) => Promise<MaskInstance[]>;
}

export default (sequelize: Sequelize) => {
  const Pharmacy : ModelStatic<PharmacyInstance> & PharmacyStatic =
    sequelize.define<PharmacyInstance>('Pharmacy', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      cashBalance: {
        type: DataTypes.DOUBLE,
      },
    });

  Pharmacy.associate = function(models) {
    Pharmacy.hasMany(models['Order']);
    Pharmacy.hasMany(models['ServiceHour']);
    Pharmacy.hasMany(models['Mask']);
  };

  Pharmacy.getMask = async function(
    pharmacy,
    maskDetail,
  ) {
    const masks = await pharmacy.getMasks({
      where: maskDetail,
    });
    return masks[0];
  };

  Pharmacy.findOpeningPharmacy = async function(
    time, dayOfweek?,
  ) {
    const ServiceHour = DB.models.ServiceHour;
    if (!isTime(time)) {
      throw new Error('Time format error!');
    }
    let day = dayOfweek;
    if (day !== undefined) {
      if (!(day in Days)) {
        throw new Error('Day format error!');
      }
      if (typeof day === 'string') {
        if (!isNaN(parseInt(day))) {
          day = parseInt(day);
        } else {
          day = Days[day as keyof typeof Days];
        }
      }
    }

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

    try {
      const results = await ServiceHour.findAll({
        where: {
          [Op.or]: queryParam(time, day),
        },
        attributes: ['PharmacyId'],
        group: ['PharmacyId', 'Pharmacy.id'],
        include: [{
          model: Pharmacy,
          attributes: ['id', 'name', 'cashBalance'],
        }],
        nest: true,
        raw: true,
      });

      return results.map((
        d: {
          PharmacId: number
          Pharmacy: PharmacyInstance
        },
      ) => {
        return d.Pharmacy;
      });
    } catch (error) {
      throw error;
    }
  };

  Pharmacy.findMasksByPharmacyName = async function(
    pharmacyName, sort?,
  ) {
    const pharmacy = await Pharmacy.findOne({
      where: {
        name: pharmacyName,
      },
    });

    if (!pharmacy) {
      throw new Error('Pharmacy not exist!');
    }

    try {
      return await pharmacy.getMasks({
        attributes: [
          'id', 'name', 'pack', 'color', 'price',
        ],
        order: sort,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  return Pharmacy;
};
