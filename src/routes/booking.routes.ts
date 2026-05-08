import { Router } from 'express';
import { cancelBookingRequest, createBooking, getAvailableSlots, getSingleBooking, getUserBookings } from '../controllers/booking.controller';
import { protect } from '../middleware/auth';



const router = Router();

router.get('/available', getAvailableSlots);

router.post('/', protect, createBooking);

router.get('/', protect, getUserBookings);

router.get('/:id', protect, getSingleBooking);

router.post('/:id/cancel-request', protect, cancelBookingRequest);

export default router;