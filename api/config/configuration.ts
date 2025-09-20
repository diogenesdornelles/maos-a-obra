import * as dotenv from 'dotenv';
dotenv.config();

export default () => ({
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  devMode: Boolean(process.env.DEV_MODE),
  secretKey: process.env.SECRET_KEY,
  expiresIn: process.env.EXPIRES_IN,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    url: process.env.DATABASE_URL,
  },
});
