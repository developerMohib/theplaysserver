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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = (db_url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!db_url)
            throw new Error('MongoDB URI missing');
        yield mongoose_1.default.connect(db_url);
        console.log('Connected to database successfully');
    }
    catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
});
exports.connectDatabase = connectDatabase;
exports.default = exports.connectDatabase;
