import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();

import { APP_PORT, MONGO_DB_URL, REDIS_URL } from './settings';
import { app } from './express';
import { createClient } from 'redis';
import {
  bullmqQueue,
  setupBackgroundTasks,
} from './utils/setupBackgroundTasks.util';

export const redisClient = createClient({ url: REDIS_URL });

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_DB_URL);
    console.log('Connected to MongoDB!');

    console.log('Connecting to Redis...');
    await redisClient.connect();
    console.log('Connected to Redis!');

    console.log('Registering queue and worker...');
    await setupBackgroundTasks();
    console.log('Queue and worker registered!');

    app.listen(APP_PORT, () => {
      console.log(`Listening on port ${APP_PORT}...`);
    });
  } catch (err) {
    return console.error(err);
  }
}

process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await mongoose.disconnect();
  await redisClient.disconnect();
  await bullmqQueue.obliterate();
  process.exit();
});

main();
