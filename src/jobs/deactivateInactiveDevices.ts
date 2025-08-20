import cron from 'node-cron';
import { Device } from '../models/Device.js';

export function startDeactivateJob() {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Device.updateMany(
      { $or: [{ last_active_at: { $lt: threshold } }, { last_active_at: null }] , status: 'active' },
      { $set: { status: 'inactive' } }
    );
  });
}
