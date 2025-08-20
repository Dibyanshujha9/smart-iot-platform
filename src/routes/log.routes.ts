import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { logCreateSchema } from '../validators/log.js';
import { Device } from '../models/Device.js';
import { Log } from '../models/Log.js';
import { totalUnitsLastHours } from '../services/usage.service.js';

const router = Router();
router.use(authMiddleware);

// POST /devices/:id/logs
router.post('/devices/:id/logs', async (req: any, res) => {
  const parsed = logCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.flatten() });
  const device = await Device.findOne({ _id: req.params.id, owner_id: req.user.id });
  if (!device) return res.status(404).json({ success: false, message: 'Device not found' });
  const log = await Log.create({ device_id: device._id, ...parsed.data });
  res.json({ success: true, log });
});

// GET /devices/:id/logs?limit=10
router.get('/devices/:id/logs', async (req: any, res) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
  const device = await Device.findOne({ _id: req.params.id, owner_id: req.user.id });
  if (!device) return res.status(404).json({ success: false, message: 'Device not found' });
  const logs = await Log.find({ device_id: device._id }).sort({ timestamp: -1 }).limit(limit);
  res.json({ success: true, logs });
});

// GET /devices/:id/usage?range=24h
router.get('/devices/:id/usage', async (req: any, res) => {
  const device = await Device.findOne({ _id: req.params.id, owner_id: req.user.id });
  if (!device) return res.status(404).json({ success: false, message: 'Device not found' });
  const range = String(req.query.range || '24h');
  const match = /^([0-9]+)h$/.exec(range);
  const hours = match ? parseInt(match[1]) : 24;
  const total = await totalUnitsLastHours(device.id, hours);
  res.json({ success: true, device_id: device.id, total_units_last_24h: total });
});

export default router;
