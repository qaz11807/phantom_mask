import Dotenv from 'dotenv';

Dotenv.config();

const config = {
  env: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
  url: process.env.HOST,
  port: process.env.PORT || 3000,
  defaultAdminPrefix: '/dashboard',
  jwtSecret: process.env.SECRET,
  database: {
    username: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASS || null,
    dialect: 'postgres',
  },
};

export default config;

