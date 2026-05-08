
import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  packageType: 'starter' | 'racer' | 'pro';
  bookingStatus: 'available' | 'pending' | 'booked' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  cancellationStatus?: 'pending' | 'approved' | 'rejected' | null;
  price: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:MM)'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:MM)'],
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    packageType: {
      type: String,
      enum: ['starter', 'racer', 'pro'],
      default: 'starter',
    },
    bookingStatus: {
      type: String,
      enum: ['available', 'pending', 'booked', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    cancellationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', null],
      default: null,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: String,
  },
  {
    timestamps: true,
    collection: 'bookings',
  }
);

// Index for finding bookings by user and date
bookingSchema.index({ userId: 1, bookingDate: 1 });
bookingSchema.index({ bookingDate: 1, startTime: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);