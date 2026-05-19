"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const appError_1 = require("./errors/appError");
const auth_routes_1 = require("./routes/auth.routes");
const game_route_1 = require("./routes/game.route");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    origin: [
        "https://theplaysserver.vercel.app",
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_routes_1.authRoutes);
app.use("/api/game", game_route_1.gameRoutes);
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
    });
});
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Game Booking API is running successfully 🚀",
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
    });
});
app.use(appError_1.errorHandler);
exports.default = app;
