import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { authAdmin } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', (req, res, next) => { login(req, res).catch(next); });
router.post('/register', authAdmin, (req, res, next) => { register(req, res).catch(next); });

export default router;
