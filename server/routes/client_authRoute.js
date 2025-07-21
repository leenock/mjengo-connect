import express from 'express';
import { loginController } from "../controllers/clientUserController.js";
import { logoutController } from '../controllers/clientUserController.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginController);
router.post('/logout', logoutController);

export default router;
