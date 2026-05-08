
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  bookedBy?: mongoose.Types.ObjectId;
  isHoliday?: boolean;
  maxSlots: number;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([0-1]\d|2[0-3]):[0-5]\d$/, 'Invalid time format'],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([0-1]\d|2[0-3]):[0-5]\d$/, 'Invalid time format'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isHoliday: {
      type: Boolean,
      default: false,
    },
    maxSlots: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    collection: 'schedules',
  }
);

scheduleSchema.index({ date: 1, startTime: 1 });

export const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);