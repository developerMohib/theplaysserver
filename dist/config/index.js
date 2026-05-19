"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const appError_1 = require("../errors/appError");
dotenv_1.default.config();
const config = {
    port: process.env.PORT || 5000,
    db_url: process.env.DB_URI,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires: process.env.JWT_EXPIRE || '7d',
    node_env: process.env.NODE_ENV || 'development',
};
if (!config.db_url) {
    throw new appError_1.AppError('DB_URI is missing in environment variables', 500);
}
if (!config.jwt_secret) {
    throw new appError_1.AppError('JWT_SECRET is missing in environment variables', 500);
}
exports.default = config;
