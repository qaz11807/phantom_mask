import {Sequelize, DataTypes, ModelStatic, Model} from 'sequelize';
import ServiceHourInstance from './interfaces/serviceHours-interface';

interface ServiceHourStatic {
    associate?: (model: {[ key :string ]: ModelStatic<Model>}) => void;
}

export default (sequelize: Sequelize) => {
  const ServiceHour : ModelStatic<ServiceHourInstance> & ServiceHourStatic =
    sequelize.define<ServiceHourInstance>('ServiceHour', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      dayOfOpen: {
        type: DataTypes.INTEGER,
      },
      openTime: {
        type: DataTypes.TIME,
      },
      dayOfClose: {
        type: DataTypes.INTEGER,
      },
      closeTime: {
        type: DataTypes.TIME,
      },
    });

  ServiceHour.associate = function(models) {
    ServiceHour.belongsTo(models['Pharmacy']);
  };

  return ServiceHour;
};
