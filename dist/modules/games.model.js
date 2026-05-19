"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const mongoose_1 = require("mongoose");
const GameSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    banner: { type: String },
    genre: { type: String, trim: true },
    category: { type: String, trim: true },
    description: { type: String, trim: true },
    shortDescription: { type: String, trim: true },
    version: { type: String },
    publisher: { type: String },
    releaseDate: { type: Date },
    multiplayer: { type: Boolean, default: false },
    rating: { type: Number, min: 0, default: 0 },
    features: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    available: { type: Boolean, default: true },
    trending: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
}, {
    timestamps: true,
});
exports.Game = (0, mongoose_1.model)('Game', GameSchema);
