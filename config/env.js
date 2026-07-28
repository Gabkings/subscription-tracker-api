import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
    PORT = 5500,
    NODE_ENV = 'development',
    MONGO_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN = '1d',
    ARCJET_ENV,
    ARCJET_KEY,
    QSTASH_TOKEN,
    QSTASH_URL,
    SERVER_URL,
    EMAIL_PASSWORD,
} = process.env;