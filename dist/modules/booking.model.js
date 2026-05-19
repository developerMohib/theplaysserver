"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    collection: 'bookings',
});
// Index for finding bookings by user and date
bookingSchema.index({ userId: 1, bookingDate: 1 });
bookingSchema.index({ bookingDate: 1, startTime: 1 });
exports.Booking = mongoose_1.default.model('Booking', bookingSchema);
