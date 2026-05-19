"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../errors/appError");
const config_1 = __importDefault(require("../config"));
const protect = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        return next(new appError_1.AppError("Unauthorized", 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
        return next();
    }
    catch (error) {
        console.error("JWT ERROR:", error);
        return next(new appError_1.AppError("Invalid or expired token", 401));
    }
};
exports.protect = protect;
const adminOnly = (req, res, next) => {
    if (!req.user) {
        return next(new appError_1.AppError('Authentication required', 401));
    }
    if (req.user.role !== 'admin') {
        return next(new appError_1.AppError('Admin access only', 403));
    }
    next();
};
exports.adminOnly = adminOnly;
const generateToken = (userId, email, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, email, role }, config_1.default.jwt_secret, {
        expiresIn: config_1.default.jwt_expires,
    });
};
exports.generateToken = generateToken;
