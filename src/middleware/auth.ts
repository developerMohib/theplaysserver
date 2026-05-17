import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
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
  console.log(17, "Token:", token)

  if (!token) {
    return next(new AppError("No token provided", 401))
  }

  try {
    const decoded = jwt.verify(
      token,
      config.jwt_secret
    ) as any

    console.log(22, "Decoded token:", decoded)

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

const JWT_SECRET: Secret = config.jwt_secret;

const JWT_EXPIRE: SignOptions['expiresIn'] = config.jwt_expires as SignOptions['expiresIn'];

const secret: Secret = config.jwt_secret


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