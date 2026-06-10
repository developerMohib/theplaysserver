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
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const db_1 = __importDefault(require("./config/db"));
let server;
// Must be top-level
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)(config_1.default.db_url);
            console.log('Database connected 💪');
            const port = Number(config_1.default.port) || 5000;
            server = app_1.default.listen(port, () => {
                console.log(`🚀 Server running on port ${port}`);
            });
            process.on('unhandledRejection', (error) => {
                console.error('Unhandled Rejection:', error);
                server.close(() => {
                    process.exit(1);
                });
            });
            process.on('SIGTERM', () => {
                console.log('SIGTERM received, shutting down gracefully...');
                server.close(() => {
                    console.log('Server shut down');
                    process.exit(0);
                });
            });
        }
        catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    });
}
main();
