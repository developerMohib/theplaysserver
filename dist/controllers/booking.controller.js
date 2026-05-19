"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBookingRequest = exports.getSingleBooking = exports.getUserBookings = exports.createBooking = exports.getAvailableSlots = void 0;
const appError_1 = require("../errors/appError");
const booking_model_1 = require("../modules/booking.model");
// Get available slots
const getAvailableSlots = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.query;
        if (!date) {
            throw new appError_1.AppError('Date is required', 400);
        }
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        const bookings = yield booking_model_1.Booking.find({
            bookingDate: {
                $gte: startDate,
                $lte: endDate,
            },
            bookingStatus: 'booked',
        });
        const bookedTimes = bookings.map((b) => ({
            startTime: b.startTime,
            endTime: b.endTime,
        }));
        res.status(200).json({
            success: true,
            date,
            bookedTimes,
            availability: generateTimeSlots(bookedTimes),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAvailableSlots = getAvailableSlots;
// Create booking
const createBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookingDate, startTime, endTime, packageType, duration, price, } = req.body;
        if (!bookingDate || !startTime || !endTime || !packageType) {
            throw new appError_1.AppError('Missing required fields', 400);
        }
        const bookingDateObj = new Date(bookingDate);
        if (bookingDateObj < new Date()) {
            throw new appError_1.AppError('Cannot book past dates', 400);
        }
        const existingBooking = yield booking_model_1.Booking.findOne({
            bookingDate: bookingDateObj,
            startTime,
            endTime,
            bookingStatus: 'booked',
        });
        if (existingBooking) {
            throw new appError_1.AppError('This time slot is already booked', 400);
        }
        const booking = yield booking_model_1.Booking.create({
            userId: req.user.id,
            bookingDate: bookingDateObj,
            startTime,
            endTime,
            duration,
            packageType,
            price,
            bookingStatus: 'pending',
            paymentStatus: 'pending',
        });
        res.status(201).json({
            success: true,
            message: 'Booking created. Proceed to payment.',
            booking,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createBooking = createBooking;
// Get user bookings
const getUserBookings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield booking_model_1.Booking.find({
            userId: req.user.id,
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserBookings = getUserBookings;
// Get single booking
const getSingleBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield booking_model_1.Booking.findById(req.params.id);
        if (!booking) {
            throw new appError_1.AppError('Booking not found', 404);
        }
        if (booking.userId.toString() !== req.user.id) {
            throw new appError_1.AppError('Unauthorized access', 403);
        }
        res.status(200).json({
            success: true,
            booking,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSingleBooking = getSingleBooking;
// Cancel request
const cancelBookingRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield booking_model_1.Booking.findById(req.params.id);
        if (!booking) {
            throw new appError_1.AppError('Booking not found', 404);
        }
        if (booking.userId.toString() !== req.user.id) {
            throw new appError_1.AppError('Unauthorized access', 403);
        }
        if (booking.bookingStatus !== 'booked') {
            throw new appError_1.AppError('Only booked bookings can be cancelled', 400);
        }
        booking.cancellationStatus = 'pending';
        yield booking.save();
        res.status(200).json({
            success: true,
            message: 'Cancellation request sent.',
            booking,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.cancelBookingRequest = cancelBookingRequest;
// Helper function
const generateTimeSlots = (bookedTimes) => {
    const slots = [];
    const timeStart = 9;
    const timeEnd = 21;
    for (let i = timeStart; i < timeEnd; i++) {
        const time = `${String(i).padStart(2, '0')}:00`;
        const isBooked = bookedTimes.some((bt) => bt.startTime.substring(0, 2) ===
            String(i).padStart(2, '0'));
        if (!isBooked) {
            slots.push(time);
        }
    }
    return slots;
};
