import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { AppError } from '../errors/appError';
import config from '../config';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const protect = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token

  if (!token) {
   return next(new AppError("Unauthorized", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      config.jwt_secret
    ) as any
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }

    return next()
  } catch (error) {
    console.error("JWT ERROR:", error)

    return next(
      new AppError("Invalid or expired token", 401)
    )
  }
}

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Admin access only', 403));
  }

  next();
};

export const generateToken = (
  userId: string,
  email: string,
  role: string
): string => {
  return jwt.sign(
    { id: userId, email, role },
    config.jwt_secret as Secret,
    {
      expiresIn: config.jwt_expires as any,
    }
  )
}