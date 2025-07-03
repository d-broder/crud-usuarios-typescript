import { Router } from 'express';
import { login, register, changePassword, recoverPassword } from '../controllers/authController';
import { authAdmin, authUser } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', (req, res, next) => { login(req, res).catch(next); });
router.post('/register', authAdmin, (req, res, next) => { register(req, res).catch(next); });
router.post('/change-password', authUser, (req, res, next) => { changePassword(req, res).catch(next); });
router.post('/recover-password', (req, res, next) => { recoverPassword(req, res).catch(next); });

export default router;
