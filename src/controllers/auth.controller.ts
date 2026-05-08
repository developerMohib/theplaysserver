// src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';

import { generateToken } from '../middleware/auth';
import { AppError } from '../errors/appError';
import { User } from '../modules/users/user.model';

// Register
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'user',
    });

    const token = generateToken(
      user._id.toString(),
      user.email,
      user.role
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (user.isBlocked) {
      throw new AppError('Account is blocked', 403);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError('Invalid password', 401);
    }

    const token = generateToken(
      user._id.toString(),
      user.email,
      user.role
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
export const updateProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, phone, image } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, image },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError(
        'Current and new password are required',
        400
      );
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isValid = await user.comparePassword(currentPassword);

    if (!isValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};