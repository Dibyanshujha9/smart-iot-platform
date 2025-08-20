import { Router } from 'express';
import { Device } from '../models/Device.js';
import { authMiddleware } from '../middlewares/auth.js';
import { createDeviceSchema, updateDeviceSchema, heartbeatSchema } from '../validators/device.js';

const router = Router();

router.use(authMiddleware);

// POST /devices
router.post('/', async (req: any, res) => {
  const parsed = createDeviceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.flatten() });
  const device = await Device.create({ ...parsed.data, owner_id: req.user.id });
  res.json({ success: true, device });
});

// GET /devices?type=&status=
router.get('/', async (req: any, res) => {
  const { type, status } = req.query;
  const filter: any = { owner_id: req.user.id };
  if (type) filter.type = type;
  if (status) filter.status = status;
  const devices = await Device.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, devices });
});

// PATCH /devices/:id
router.patch('/:id', async (req: any, res) => {
  const parsed = updateDeviceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.flatten() });
  const updated = await Device.findOneAndUpdate({ _id: req.params.id, owner_id: req.user.id }, { $set: parsed.data }, { new: true });
  if (!updated) return res.status(404).json({ success: false, message: 'Device not found' });
  res.json({ success: true, device: updated });
});

// DELETE /devices/:id
router.delete('/:id', async (req: any, res) => {
  const deleted = await Device.findOneAndDelete({ _id: req.params.id, owner_id: req.user.id });
  if (!deleted) return res.status(404).json({ success: false, message: 'Device not found' });
  res.json({ success: true, message: 'Device removed' });
});

// POST /devices/:id/heartbeat
router.post('/:id/heartbeat', async (req: any, res) => {
  const parsed = heartbeatSchema.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.flatten() });
  const now = new Date();
  const updated = await Device.findOneAndUpdate(
    { _id: req.params.id, owner_id: req.user.id },
    { $set: { last_active_at: now, ...(parsed.data.status ? { status: parsed.data.status } : {}) } },
    { new: true }
  );
  if (!updated) return res.status(404).json({ success: false, message: 'Device not found' });
  res.json({ success: true, message: 'Device heartbeat recorded', last_active_at: now.toISOString() });
});

export default router;




