import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';
import { Schedule } from '../modules/schedules/schedule.model';


// Get schedules
export const getSchedules = async (
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

    const schedules = await Schedule.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({
      startTime: 1,
    });

    res.status(200).json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    next(error);
  }
};

// Create schedule
export const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      date,
      startTime,
      endTime,
      maxSlots,
    } = req.body;

    const schedule = await Schedule.create({
      date: new Date(date),
      startTime,
      endTime,
      maxSlots: maxSlots || 1,
      isAvailable: true,
    });

    res.status(201).json({
      success: true,
      message: 'Schedule created',
      schedule,
    });
  } catch (error) {
    next(error);
  }
};

// Delete schedule
export const deleteSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schedule =
      await Schedule.findByIdAndDelete(
        req.params.id
      );

    if (!schedule) {
      throw new AppError(
        'Schedule not found',
        404
      );
    }

    res.status(200).json({
      success: true,
      message: 'Schedule deleted',
    });
  } catch (error) {
    next(error);
  }
};