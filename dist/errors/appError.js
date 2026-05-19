"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
const errorHandler = (error, req, res, next) => {
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
        const message = Object.values(error.errors)
            .map((err) => err.message)
            .join(', ');
        return res.status(400).json({
            success: false,
            message,
            statusCode: 400,
        });
    }
    // Mongoose duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
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
exports.errorHandler = errorHandler;
