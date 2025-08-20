import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILog extends Document {
  device_id: Types.ObjectId;
  event: string; // e.g., units_consumed
  value: number;
  timestamp: Date;
}

const LogSchema = new Schema<ILog>({
  device_id: { type: Schema.Types.ObjectId, ref: 'Device', required: true, index: true },
  event: { type: String, required: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

export const Log = mongoose.model<ILog>('Log', LogSchema);
