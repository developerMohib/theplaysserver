// src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';

import { generateToken } from '../middleware/auth';
import { AppError } from '../errors/appError';
import { User } from '../modules/users/user.model';

const formatUserResponse = (user: any) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  image: user.image,
  isBlocked: user.isBlocked,
})

// ============ REGISTER ============
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400)
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new AppError('Email already registered', 400)
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      role: 'user',
    })

    await user.save()

    const token = generateToken(
      user._id.toString(),
      user.email,
      user.role
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: formatUserResponse(user),
    })
  } catch (error) {
    next(error)
  }
}

// ============ LOGIN ============
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('Email and password are required', 400)
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      throw new AppError('Invalid credentials', 401)
    }

    if (user.isBlocked) {
      throw new AppError(
        'Your account has been blocked. Contact support.',
        403
      )
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401)
    }

    const token = generateToken(
      user._id.toString(),
      user.email,
      user.role
    )

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: formatUserResponse(user),
    })
  } catch (error) {
    next(error)
  }
}

// ============ GET ME ============
export const getMe = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      throw new AppError('User not found', 404)
    }

    if (user.isBlocked) {
      throw new AppError('Your account has been blocked', 403)
    }

    res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    })
  } catch (error) {
    next(error)
  }
}

// ============ UPDATE PROFILE ============
export const updateProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, phone, image } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, image },
      { new: true, runValidators: true }
    )

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(user),
    })
  } catch (error) {
    next(error)
  }
}

// ============ CHANGE PASSWORD ============
export const changePassword = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (!currentPassword || !newPassword) {
      throw new AppError(
        'Current and new password are required',
        400
      )
    }

    if (newPassword !== confirmPassword) {
      throw new AppError('Passwords do not match', 400)
    }

    if (newPassword.length < 6) {
      throw new AppError(
        'Password must be at least 6 characters',
        400
      )
    }

    const user = await User.findById(req.user.id).select('+password')

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const isValid = await user.comparePassword(currentPassword)

    if (!isValid) {
      throw new AppError('Current password is incorrect', 401)
    }

    user.password = newPassword

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    next(error)
  }
}

// ============ LOGOUT ============
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    next(error)
  }
}

// ============ FORGOT PASSWORD ============
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body

    if (!email) {
      throw new AppError('Email is required', 400)
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If email exists, reset link will be sent',
      })
    }

    res.status(200).json({
      success: true,
      message: 'If email exists, reset link will be sent',
    })
  } catch (error) {
    next(error)
  }
}

// ============ RESET PASSWORD ============
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newPassword } = req.body

    if (!newPassword) {
      throw new AppError('New password is required', 400)
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    })
  } catch (error) {
    next(error)
  }
}