// src/routes/authRoutes.ts

import { Router } from 'express';
import { protect } from '../middleware/auth';
import { changePassword, getCurrentUser, loginUser, registerUser, updateProfile } from '../controllers/auth.controller';



const router = Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getCurrentUser);

router.patch('/update', protect, updateProfile);

router.post('/change-password', protect, changePassword);

export default router;