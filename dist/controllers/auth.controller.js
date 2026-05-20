"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.changePassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const auth_1 = require("../middleware/auth");
const appError_1 = require("../errors/appError");
const user_model_1 = require("../modules/user.model");
const formatUserResponse = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    image: user.image,
    isBlocked: user.isBlocked,
});
// ============ REGISTER ============
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next(new appError_1.AppError('Name, email, and password are required', 400));
        }
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!validEmail) {
            return next(new appError_1.AppError('Invalid email format', 400));
        }
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser) {
            return next(new appError_1.AppError('Email already registered', 400));
        }
        const user = new user_model_1.User({
            name,
            email,
            password,
            role: 'user',
        });
        yield user.save();
        const token = (0, auth_1.generateToken)(user._id.toString(), user.email, user.role);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: formatUserResponse(user),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
// ============ LOGIN ============
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new appError_1.AppError('Email and password are required', 400));
        }
        const user = yield user_model_1.User.findOne({ email }).select('+password');
        if (!user) {
            return next(new appError_1.AppError('Invalid credentials', 401));
        }
        if (user.isBlocked === 'blocked') {
            return next(new appError_1.AppError('Your account has been blocked. Contact support.', 403));
        }
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            return next(new appError_1.AppError('Invalid credentials', 401));
        }
        const token = (0, auth_1.generateToken)(user._id.toString(), user.email, user.role);
        const isDev = process.env.NODE_ENV === 'development';
        res.cookie('token', token, {
            httpOnly: true,
            secure: !isDev, // false on localhost, true on render.com
            sameSite: isDev ? 'lax' : 'strict', // different per environment
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: formatUserResponse(user),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
// ============ GET ME ============
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.user.id).select('-password');
        if (!user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        if (user.isBlocked === 'blocked') {
            return next(new appError_1.AppError('Your account has been blocked', 403));
        }
        res.status(200).json({
            success: true,
            data: formatUserResponse(user),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMe = getMe;
// ============ UPDATE PROFILE ============
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, image } = req.body;
        const user = yield user_model_1.User.findByIdAndUpdate(req.user.id, { name, phone, image }, { new: true, runValidators: true });
        if (!user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: formatUserResponse(user),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProfile = updateProfile;
// ============ CHANGE PASSWORD ============
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return next(new appError_1.AppError('Current and new password are required', 400));
        }
        if (newPassword !== confirmPassword) {
            return next(new appError_1.AppError('Passwords do not match', 400));
        }
        if (newPassword.length < 6) {
            return next(new appError_1.AppError('Password must be at least 6 characters', 400));
        }
        const user = yield user_model_1.User.findById(req.user.id).select('+password');
        if (!user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        const isValid = yield user.comparePassword(currentPassword);
        if (!isValid) {
            return next(new appError_1.AppError('Current password is incorrect', 401));
        }
        user.password = newPassword;
        yield user.save();
        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.changePassword = changePassword;
// ============ LOGOUT ============
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
        });
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
// ============ FORGOT PASSWORD ============
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new appError_1.AppError('Email is required', 400));
        }
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return next(new appError_1.AppError('If email exists, reset link will be sent', 200));
        }
        res.status(200).json({
            success: true,
            message: 'If email exists, reset link will be sent',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.forgotPassword = forgotPassword;
// ============ RESET PASSWORD ============
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPassword } = req.body;
        if (!newPassword) {
            throw new appError_1.AppError('New password is required', 400);
        }
        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
