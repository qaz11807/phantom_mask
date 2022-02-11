// import {Sequelize, Options, ModelStatic, Transaction} from 'sequelize';
import {
  Sequelize,
  SequelizeOptions,
} from 'sequelize-typescript';
import {Transaction} from 'sequelize/types';
import config from '../config';

/**
 *
 */
class Database {
  protected sequelize: Sequelize;
  /**
   * @param {Options} options
   */
  constructor(options: SequelizeOptions) {
    this.sequelize = new Sequelize(options);
    this.sequelize.addModels([__dirname + '/**/*.model.*']);
  }

  /**
   * @return {Promise<Sequelize>}
   */
  async connect(): Promise<Sequelize> {
    return this.sequelize.sync();
  }

  /**
   * @return {Promise<unknown>}
   */
  async dropAllTables() {
    return this.sequelize.drop();
  }

  /**
   * @param {fuction} autoCallback
   * @return {Promise<unknown>}
   */
  async createdTranscation<T>(
    autoCallback: (t: Transaction) => PromiseLike<T>,
  ) {
    return this.sequelize.transaction<T>(autoCallback);
  }
}

const dbConfig =
  config.env === 'production' ?
    {
      ...config.database,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    } : config.database;
export default new Database(dbConfig as SequelizeOptions);

