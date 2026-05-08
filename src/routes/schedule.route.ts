import { Router } from 'express';
import { createSchedule, deleteSchedule, getSchedules } from '../controllers/schedule.controller';
import { adminOnly, protect } from '../middleware/auth';

const router = Router();

router.get('/', getSchedules);

router.post(
  '/',
  protect,
  adminOnly,
  createSchedule
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteSchedule
);

export default router;