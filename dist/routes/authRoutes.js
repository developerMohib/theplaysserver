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
// src/routes/authRoutes.ts
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const appError_1 = require("../errors/appError");
const router = (0, express_1.Router)();
// Register
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            throw new appError_1.AppError('Name, email, and password are required', 400);
        }
        const existingUser = yield User.findOne({ email });
        if (existingUser) {
            throw new appError_1.AppError('Email already registered', 400);
        }
        const user = new User({
            name,
            email,
            password,
            phone,
            role: 'user',
        });
        yield user.save();
        const token = (0, auth_1.generateToken)(user._id.toString(), user.email, user.role);
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
    }
    catch (error) {
        next(error);
    }
}));
// Login
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new appError_1.AppError('Email and password are required', 400);
        }
        const user = yield User.findOne({ email }).select('+password');
        if (!user) {
            throw new appError_1.AppError('User not found', 401);
        }
        if (user.isBlocked) {
            throw new appError_1.AppError('Account is blocked', 403);
        }
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            throw new appError_1.AppError('Invalid password', 401);
        }
        const token = (0, auth_1.generateToken)(user._id.toString(), user.email, user.role);
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
    }
    catch (error) {
        next(error);
    }
}));
// Get current user
router.get('/me', auth_1.protect, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id);
        if (!user) {
            throw new appError_1.AppError('User not found', 404);
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
    }
    catch (error) {
        next(error);
    }
}));
// Update profile
router.patch('/update', auth_1.protect, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, image } = req.body;
        const user = yield User.findByIdAndUpdate(req.user.id, { name, phone, image }, { new: true, runValidators: true });
        if (!user) {
            throw new appError_1.AppError('User not found', 404);
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
    }
    catch (error) {
        next(error);
    }
}));
// Change password
router.post('/change-password', auth_1.protect, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            throw new appError_1.AppError('Current and new password are required', 400);
        }
        const user = yield User.findById(req.user.id).select('+password');
        if (!user) {
            throw new appError_1.AppError('User not found', 404);
        }
        const isValid = yield user.comparePassword(currentPassword);
        if (!isValid) {
            throw new appError_1.AppError('Current password is incorrect', 401);
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
}));
exports.default = router;
