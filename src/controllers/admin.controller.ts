import { Request, Response, NextFunction } from 'express';
import { Booking } from '../modules/bookings/booking.model';
import { Payment } from '../modules/payments/payment.model';
import { User } from '../modules/users/user.model';
import { AppError } from '../errors/appError';
import { Review } from '../modules/reviews/review.model';


// Dashboard Analytics
export const getAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const totalUsers = await User.countDocuments({
      role: 'user',
    });

    const totalRevenue = await Payment.aggregate([
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

    const todayBookings = await Booking.find({
      bookingDate: {
        $gte: new Date(
          new Date().setHours(0, 0, 0, 0)
        ),
        $lte: new Date(
          new Date().setHours(23, 59, 59, 999)
        ),
      },
    });

    const pendingCancellations =
      await Booking.countDocuments({
        cancellationStatus: 'pending',
      });

    res.status(200).json({
      success: true,
      analytics: {
        totalBookings,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayBookings: todayBookings.length,
        pendingCancellations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings
export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const filter: any = {};

    if (status) {
      filter.bookingStatus = status;
    }

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total =
      await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Approve cancellation
export const approveCancellation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (
      booking.cancellationStatus !== 'pending'
    ) {
      throw new AppError(
        'No pending cancellation found',
        400
      );
    }

    booking.cancellationStatus = 'approved';
    booking.bookingStatus = 'cancelled';

    await booking.save();

    if (booking.paymentStatus === 'paid') {
      await Payment.findOneAndUpdate(
        {
          bookingId: booking._id,
        },
        {
          paymentStatus: 'refunded',
        }
      );
    }

    res.status(200).json({
      success: true,
      message:
        'Cancellation approved successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Reject cancellation
export const rejectCancellation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    booking.cancellationStatus = 'rejected';

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Cancellation rejected',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
    } = req.query;

    const users = await User.find({
      role: 'user',
    })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total =
      await User.countDocuments({
        role: 'user',
      });

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle block user
export const toggleBlockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isBlocked =
      user.isBlocked === 'active'
        ? 'blocked'
        : 'active';

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${
        user.isBlocked === 'blocked'
          ? 'blocked'
          : 'unblocked'
      } successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get reviews
export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      approved,
      page = 1,
      limit = 10,
    } = req.query;

    const filter: any = {};

    if (approved !== undefined) {
      filter.isApproved =
        approved === 'true';
    }

    const reviews = await Review.find(filter)
      .populate('userId', 'name image')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total =
      await Review.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Approve review
export const approveReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review =
      await Review.findByIdAndUpdate(
        req.params.id,
        {
          isApproved: true,
        },
        {
          new: true,
        }
      );

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Review approved',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// Delete review
export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review =
      await Review.findByIdAndDelete(
        req.params.id
      );

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted',
    });
  } catch (error) {
    next(error);
  }
};