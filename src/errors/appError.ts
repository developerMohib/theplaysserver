import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error: bai ', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const message = Object.values((error as any).errors)
      .map((err: any) => err.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      message,
      statusCode: 400,
    });
  }

  // Mongoose duplicate key error
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      statusCode: 400,
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    statusCode: 500,
  });
};