import { NextFunction, Request, Response } from 'express';
import { Game } from '../modules/games.model';
import { AppError } from '../errors/appError';

// Get All Games Controller
export const getAllGames = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const allgames = await Game.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: allgames.length,
      data: allgames || [] ,
    });
  }  catch (error) {
        next(error)
    }
};


export const getOneGame = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const {slug} = req.params
        const game = await Game.findOne({
            _id: slug,
            available: true,
        })
        if (!game) {
            return next(
                new AppError('Game not found', 404)
            )
        }

        res.status(200).json({
            success: true,
            message: 'Game retrieved successfully',
            data: game,
        })
    } catch (error) {
        next(error)
    }
}