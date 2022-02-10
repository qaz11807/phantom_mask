import {Sequelize, Options, ModelStatic, Transaction} from 'sequelize';
import fs from 'fs';
import path from 'path';
import config from '../config';

const basename = path.basename(__filename);

interface Models {
  [key: string]: ModelStatic<any> & {[fnName: string]: any};
}
/**
 *
 */
class Database {
  protected sequelize: Sequelize;
  public models: Models = {};

  /**
   * @param {Options} options
   */
  constructor(options: Options) {
    this.sequelize = new Sequelize(options);
  }

  /**
   * @return {Promise<Sequelize>}
   */
  async init() {
    try {
      await this.loadModel();
      await this.associate();
    } catch (error) {
      throw (error);
    }
  }

  /**
   *
   */
  private async loadModel() {
    const fileNames = await fs.readdirSync(__dirname);
    const modelFiles = fileNames.filter((fileName)=> {
      return (fileName.indexOf('.') !== 0) &&
        (fileName !== basename) &&
        (fileName.slice(-3) === ('.ts') || fileName.slice(-3) === ('.js'));
    });
    const promises = modelFiles.map(async (file: string) => {
      const modelFactory = (await import(path.join(__dirname, file))).default;
      const model = modelFactory(this.sequelize);
      this.models[model.name] = model;
    });
    await Promise.all(promises);
  }

  /**
   *
   */
  private async associate() {
    Object.values(this.models).forEach((model: any) => {
      if (model.associate) {
        model.associate(this.models);
      }
    });
  }

  /**
   * @return {Promise<Sequelize>}
   */
  async connect(): Promise<Sequelize> {
    return this.sequelize.sync();
  }

  /**
   * @return {Promise<Sequelize>}
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
export default new Database(dbConfig as Options);

