import express from 'express';
import { getAllGames, getOneGame } from '../controllers/game.controller';

const router = express.Router();

router.get('/popular', getAllGames);
router.get('/my/:slug', getOneGame)
export const gameRoutes= router;