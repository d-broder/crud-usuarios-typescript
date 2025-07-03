import { Router } from 'express';
import { authUser, authAdmin } from '../middleware/authMiddleware';
import {
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  recoverPassword
} from '../controllers/userController';

const router = Router();

// Rotas de CRUD de usuários (apenas admin)
router.get('/', authAdmin, (req, res, next) => listUsers(req, res).catch(next));
router.get('/:username', authAdmin, (req, res, next) => getUser(req, res).catch(next));
router.put('/:username', authAdmin, (req, res, next) => updateUser(req, res).catch(next));
router.delete('/:username', authAdmin, (req, res, next) => deleteUser(req, res).catch(next));

// Rotas de senha
router.post('/change-password', authUser, (req, res, next) => changePassword(req, res).catch(next));
router.post('/recover-password', (req, res, next) => recoverPassword(req, res).catch(next));

export default router;
