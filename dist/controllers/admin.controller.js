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
exports.deleteReview = exports.approveReview = exports.getReviews = exports.deleteUser = exports.toggleBlockUser = exports.getAllUsers = exports.rejectCancellation = exports.approveCancellation = exports.getAllBookings = exports.getAnalytics = void 0;
const booking_model_1 = require("../modules/booking.model");
const payment_model_1 = require("../modules/payment.model");
const user_model_1 = require("../modules/user.model");
const appError_1 = require("../errors/appError");
const review_model_1 = require("../modules/review.model");
// Dashboard Analytics
const getAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const totalBookings = yield booking_model_1.Booking.countDocuments();
        const totalUsers = yield user_model_1.User.countDocuments({
            role: 'user',
        });
        const totalRevenue = yield payment_model_1.Payment.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: '$amount',
                    },
                },
            },
        ]);
        const todayBookings = yield booking_model_1.Booking.find({
            bookingDate: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        });
        const pendingCancellations = yield booking_model_1.Booking.countDocuments({
            cancellationStatus: 'pending',
        });
        res.status(200).json({
            success: true,
            analytics: {
                totalBookings,
                totalUsers,
                totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                todayBookings: todayBookings.length,
                pendingCancellations,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAnalytics = getAnalytics;
// Get all bookings
const getAllBookings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, page = 1, limit = 10, } = req.query;
        const filter = {};
        if (status) {
            filter.bookingStatus = status;
        }
        const bookings = yield booking_model_1.Booking.find(filter)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = yield booking_model_1.Booking.countDocuments(filter);
        res.status(200).json({
            success: true,
            count: bookings.length,
            total,
            pages: Math.ceil(total / Number(limit)),
            bookings,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllBookings = getAllBookings;
// Approve cancellation
const approveCancellation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield booking_model_1.Booking.findById(req.params.id);
        if (!booking) {
            throw new appError_1.AppError('Booking not found', 404);
        }
        if (booking.cancellationStatus !== 'pending') {
            throw new appError_1.AppError('No pending cancellation found', 400);
        }
        booking.cancellationStatus = 'approved';
        booking.bookingStatus = 'cancelled';
        yield booking.save();
        if (booking.paymentStatus === 'paid') {
            yield payment_model_1.Payment.findOneAndUpdate({
                bookingId: booking._id,
            }, {
                paymentStatus: 'refunded',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Cancellation approved successfully',
            booking,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.approveCancellation = approveCancellation;
// Reject cancellation
const rejectCancellation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield booking_model_1.Booking.findById(req.params.id);
        if (!booking) {
            throw new appError_1.AppError('Booking not found', 404);
        }
        booking.cancellationStatus = 'rejected';
        yield booking.save();
        res.status(200).json({
            success: true,
            message: 'Cancellation rejected',
            booking,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.rejectCancellation = rejectCancellation;
// Get all users
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, } = req.query;
        const users = yield user_model_1.User.find({
            role: 'user',
        })
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = yield user_model_1.User.countDocuments({
            role: 'user',
        });
        res.status(200).json({
            success: true,
            count: users.length,
            total,
            pages: Math.ceil(total / Number(limit)),
            users,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
// Toggle block user
const toggleBlockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.params.id);
        if (!user) {
            throw new appError_1.AppError('User not found', 404);
        }
        user.isBlocked =
            user.isBlocked === 'active'
                ? 'blocked'
                : 'active';
        yield user.save();
        res.status(200).json({
            success: true,
            message: `User ${user.isBlocked === 'blocked'
                ? 'blocked'
                : 'unblocked'} successfully`,
            user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.toggleBlockUser = toggleBlockUser;
// Delete user
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            throw new appError_1.AppError('User not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
// Get reviews
const getReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { approved, page = 1, limit = 10, } = req.query;
        const filter = {};
        if (approved !== undefined) {
            filter.isApproved =
                approved === 'true';
        }
        const reviews = yield review_model_1.Review.find(filter)
            .populate('userId', 'name image')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = yield review_model_1.Review.countDocuments(filter);
        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            pages: Math.ceil(total / Number(limit)),
            reviews,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getReviews = getReviews;
// Approve review
const approveReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield review_model_1.Review.findByIdAndUpdate(req.params.id, {
            isApproved: true,
        }, {
            new: true,
        });
        if (!review) {
            throw new appError_1.AppError('Review not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Review approved',
            review,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.approveReview = approveReview;
// Delete review
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield review_model_1.Review.findByIdAndDelete(req.params.id);
        if (!review) {
            throw new appError_1.AppError('Review not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Review deleted',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteReview = deleteReview;
