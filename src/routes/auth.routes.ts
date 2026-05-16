
import { Router } from 'express';
import { protect } from '../middleware/auth';
import { changePassword, forgotPassword, getMe, login, logout, register, resetPassword, updateProfile } from '../controllers/auth.controller';



const router = Router();

router.post('/register', register)

router.post('/login', login)

router.get('/me', protect, getMe)

router.patch('/update', protect, updateProfile)

router.post('/change-password', protect, changePassword)

router.post('/logout', protect, logout)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token', resetPassword)

export const authRoutes = router;