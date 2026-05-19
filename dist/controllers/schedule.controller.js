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
exports.deleteSchedule = exports.createSchedule = exports.getSchedules = void 0;
const appError_1 = require("../errors/appError");
const schedule_model_1 = require("../modules/schedule.model");
// Get schedules
const getSchedules = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.query;
        if (!date) {
            throw new appError_1.AppError('Date is required', 400);
        }
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        const schedules = yield schedule_model_1.Schedule.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        }).sort({
            startTime: 1,
        });
        res.status(200).json({
            success: true,
            count: schedules.length,
            schedules,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSchedules = getSchedules;
// Create schedule
const createSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, startTime, endTime, maxSlots, } = req.body;
        const schedule = yield schedule_model_1.Schedule.create({
            date: new Date(date),
            startTime,
            endTime,
            maxSlots: maxSlots || 1,
            isAvailable: true,
        });
        res.status(201).json({
            success: true,
            message: 'Schedule created',
            schedule,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createSchedule = createSchedule;
// Delete schedule
const deleteSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedule = yield schedule_model_1.Schedule.findByIdAndDelete(req.params.id);
        if (!schedule) {
            throw new appError_1.AppError('Schedule not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Schedule deleted',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteSchedule = deleteSchedule;
