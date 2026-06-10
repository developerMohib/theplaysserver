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
exports.bookOneGame = exports.getOneGame = exports.getAllGames = void 0;
const games_model_1 = require("../modules/games.model");
const appError_1 = require("../errors/appError");
// Get All Games Controller
const getAllGames = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allgames = yield games_model_1.Game.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: allgames.length,
            data: allgames || [],
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllGames = getAllGames;
const getOneGame = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const game = yield games_model_1.Game.findOne({
            slug,
        });
        if (!game) {
            return next(new appError_1.AppError('Game not found', 404));
        }
        res.status(200).json({
            success: true,
            message: 'Game retrieved successfully',
            data: game,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getOneGame = getOneGame;
const bookOneGame = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const game = yield games_model_1.Game.findOne({
            _id: id,
            available: true,
        });
        if (!game) {
            return next(new appError_1.AppError('Game not found', 404));
        }
        res.status(200).json({
            success: true,
            message: 'Game retrieved successfully',
            data: game,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.bookOneGame = bookOneGame;
