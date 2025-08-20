import { Log } from '../models/Log.js';
import mongoose from 'mongoose';

export async function totalUnitsLastHours(deviceId: string, hours: number) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const [res] = await Log.aggregate([
    { $match: { device_id: new mongoose.Types.ObjectId(deviceId), event: 'units_consumed', timestamp: { $gte: since } } },
    { $group: { _id: null, total: { $sum: '$value' } } }
  ]);
  return res?.total || 0;
}
