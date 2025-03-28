import express from 'express'
import { getProfile, login, signup, updateProfile } from '../controllers/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router= express.Router();

router.post('/signup',signup)
router.get('/login',login)
router.get('/user-profile',protectRoute,getProfile)
router.put('/update-profile',protectRoute,updateProfile)

export default router