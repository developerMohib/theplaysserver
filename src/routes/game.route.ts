import express from 'express';
import {
  bookOneGame,
  getAllGames,
  getOneGame,
} from '../controllers/game.controller';

const router = express.Router();

router.get('/popular', getAllGames);
router.get('/my/:slug', getOneGame);
router.get('/book/:id', bookOneGame);
export const gameRoutes = router;
