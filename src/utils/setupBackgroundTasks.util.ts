import {
  BULLMQ_FETCH_PRICES_JOB_NAME,
  BULLMQ_JOB_INTERVAL_IN_SECS,
  BULLMQ_QUEUE_NAME,
  BULLMQ_REDIS_SETTINGS,
} from '../settings';
import { Queue, Worker } from 'bullmq';
import { FetchPriceService } from '../services/fetchPrice.service';

export const bullmqQueue = new Queue(BULLMQ_QUEUE_NAME, BULLMQ_REDIS_SETTINGS);

export async function setupBackgroundTasks() {
  new Worker(
    BULLMQ_QUEUE_NAME,
    async (job) => {
      if (job.name === BULLMQ_FETCH_PRICES_JOB_NAME) {
        const service = new FetchPriceService();
        await service.fetchPrices();
        console.log(`Job ${BULLMQ_FETCH_PRICES_JOB_NAME} finished!`);
      }
    },
    BULLMQ_REDIS_SETTINGS,
  );

  await bullmqQueue.add(
    BULLMQ_FETCH_PRICES_JOB_NAME,
    {},
    { repeat: { every: BULLMQ_JOB_INTERVAL_IN_SECS * 1000 } },
  );
}
