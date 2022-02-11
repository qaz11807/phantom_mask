import DB from '../models';
import express from 'express';
import bodyParser from 'body-parser';
import winston from 'winston';
import expressWinston from 'express-winston';
import config from '../config';
import {routers} from './routes';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../openapi.json';

export const app = express();
const startServer = async () => {
  try {
    await DB.connect();
    console.log(`database success sync !!!`);

    const port = config.port;

    app.use(express.static('public'));

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'combined.log'}),
      ],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
      ),
      meta: true,
      msg: 'HTTP {{req.method}} {{req.url}}',
      expressFormat: true,
    }));

    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    for (const router of routers) {
      app.use(router.getPrefix(), router.getPreHandlers(), router.getRouter());
    }

    app.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'error.log', level: 'error'}),
      ],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
      ),
    }));

    app.listen(port, () => {
      console.log(`Connected successfully on port ${port}`);
    });
  } catch (error) {
    throw error;
  }
};

export default startServer;
