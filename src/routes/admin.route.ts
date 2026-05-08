import { Router } from 'express';

import {
  getAnalytics,
  getAllBookings,
  approveCancellation,
  rejectCancellation,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getReviews,
  approveReview,
  deleteReview,
} from '../controllers/admin.controller';
import { adminOnly, protect } from '../middleware/auth';

const router = Router();

// Apply middleware
router.use(protect, adminOnly);

// Analytics
router.get('/analytics', getAnalytics);

// Bookings
router.get('/bookings', getAllBookings);

// Cancellation
router.patch(
  '/cancellations/:id/approve',
  approveCancellation
);

router.patch(
  '/cancellations/:id/reject',
  rejectCancellation
);

// Users
router.get('/users', getAllUsers);

router.patch(
  '/users/:id/toggle-block',
  toggleBlockUser
);

router.delete(
  '/users/:id',
  deleteUser
);

// Reviews
router.get('/reviews', getReviews);

router.patch(
  '/reviews/:id/approve',
  approveReview
);

router.delete(
  '/reviews/:id',
  deleteReview
);

export default router;