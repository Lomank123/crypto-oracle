import * as process from 'node:process';

// Main

export const APP_PORT = parseInt(process.env.APP_PORT || '3033');
export const LAST_CHECKED_DELTA_IN_MINS = parseInt(
  process.env.LAST_CHECKED_DELTA_IN_MINS || '10',
);

// CORS

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
export const CORS_OPTIONS = {
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200,
};

// Database

const DB_USER = process.env.DB_USER || 'user';
const DB_PASS = process.env.DB_PASS || 'password';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'oracle-db';
const DB_PORT = process.env.DB_PORT || '27022';
export const MONGO_DB_URL = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// Redis

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6378');
export const REDIS_URL = `redis://${REDIS_HOST}:${REDIS_PORT}`;
export const REDIS_CACHE_EXPIRATION_IN_SECS = parseInt(
  process.env.REDIS_CACHE_EXPIRATION_IN_SECS || '60',
);

// BullMQ

export const BULLMQ_REDIS_SETTINGS = {
  connection: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
};
export const BULLMQ_QUEUE_NAME = process.env.BULLMQ_QUEUE_NAME || 'fetchQueue';
export const BULLMQ_FETCH_PRICES_JOB_NAME =
  process.env.BULLMQ_FETCH_PRICES_JOB_NAME || 'fetchPrices';
export const BULLMQ_JOB_INTERVAL_IN_SECS = parseInt(
  process.env.BULLMQ_JOB_INTERVAL_IN_SECS || '30',
);
