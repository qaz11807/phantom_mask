import {Sequelize, DataTypes, ModelStatic, Model} from 'sequelize';
import UserInstance from './interfaces/user-interface';

interface UserStatic {
    associate?: (model: {[ key :string ]: ModelStatic<Model>}) => void;
}

export default (sequelize: Sequelize) => {
  const User : ModelStatic<UserInstance> & UserStatic =
    sequelize.define<UserInstance>('User', {
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

  User.associate = function(models) {
    User.hasMany(models['Order']);
  };

  return User;
};
