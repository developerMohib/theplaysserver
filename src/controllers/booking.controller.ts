import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';
import { Booking } from '../modules/bookings/booking.model';

// Get available slots
export const getAvailableSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.query;

    if (!date) {
      throw new AppError('Date is required', 400);
    }

    const startDate = new Date(date as string);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date as string);
    endDate.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
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
  } catch (error) {
    next(error);
  }
};

// Create booking
export const createBooking = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      bookingDate,
      startTime,
      endTime,
      packageType,
      duration,
      price,
    } = req.body;

    if (!bookingDate || !startTime || !endTime || !packageType) {
      throw new AppError('Missing required fields', 400);
    }

    const bookingDateObj = new Date(bookingDate);

    if (bookingDateObj < new Date()) {
      throw new AppError('Cannot book past dates', 400);
    }

    const existingBooking = await Booking.findOne({
      bookingDate: bookingDateObj,
      startTime,
      endTime,
      bookingStatus: 'booked',
    });

    if (existingBooking) {
      throw new AppError('This time slot is already booked', 400);
    }

    const booking = await Booking.create({
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
  } catch (error) {
    next(error);
  }
};

// Get user bookings
export const getUserBookings = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Get single booking
export const getSingleBooking = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.userId.toString() !== req.user.id) {
      throw new AppError('Unauthorized access', 403);
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel request
export const cancelBookingRequest = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.userId.toString() !== req.user.id) {
      throw new AppError('Unauthorized access', 403);
    }

    if (booking.bookingStatus !== 'booked') {
      throw new AppError('Only booked bookings can be cancelled', 400);
    }

    booking.cancellationStatus = 'pending';

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Cancellation request sent.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function
const generateTimeSlots = (bookedTimes: any[]): string[] => {
  const slots: string[] = [];

  const timeStart = 9;
  const timeEnd = 21;

  for (let i = timeStart; i < timeEnd; i++) {
    const time = `${String(i).padStart(2, '0')}:00`;

    const isBooked = bookedTimes.some(
      (bt) =>
        bt.startTime.substring(0, 2) ===
        String(i).padStart(2, '0')
    );

    if (!isBooked) {
      slots.push(time);
    }
  }

  return slots;
};