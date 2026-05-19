import { model, Schema } from 'mongoose';

export interface IGame {
  name: string;
  slug: string;
  image: string;
  banner: string;
  genre: string;
  category: string;
  description: string;
  shortDescription: string;
  version: string;
  publisher: string;
  releaseDate: Date;
  multiplayer: boolean;
  rating: number;
  features: string[];
  tags: string[];
  available: boolean;
  trending: boolean;
  featured: boolean;
  price: number;
  discount: number;
  currency: string;
}

const GameSchema = new Schema<IGame>(
  {
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
  },
  {
    timestamps: true,
  },
);

export const Game = model<IGame>('Game', GameSchema);
