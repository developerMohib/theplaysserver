"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply middleware
router.use(auth_1.protect, auth_1.adminOnly);
// Analytics
router.get('/analytics', admin_controller_1.getAnalytics);
// Bookings
router.get('/bookings', admin_controller_1.getAllBookings);
// Cancellation
router.patch('/cancellations/:id/approve', admin_controller_1.approveCancellation);
router.patch('/cancellations/:id/reject', admin_controller_1.rejectCancellation);
// Users
router.get('/users', admin_controller_1.getAllUsers);
router.patch('/users/:id/toggle-block', admin_controller_1.toggleBlockUser);
router.delete('/users/:id', admin_controller_1.deleteUser);
// Reviews
router.get('/reviews', admin_controller_1.getReviews);
router.patch('/reviews/:id/approve', admin_controller_1.approveReview);
router.delete('/reviews/:id', admin_controller_1.deleteReview);
exports.default = router;
