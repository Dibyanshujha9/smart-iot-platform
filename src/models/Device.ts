import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDevice extends Document {
  name: string;
  type: string; // e.g., light, meter
  status: 'active' | 'inactive';
  last_active_at: Date | null;
  owner_id: Types.ObjectId;
}

const DeviceSchema = new Schema<IDevice>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive', required: true },
  last_active_at: { type: Date, default: null },
  owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Device = mongoose.model<IDevice>('Device', DeviceSchema);
