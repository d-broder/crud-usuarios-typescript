import { Router } from 'express';
import { createTarefa, listTarefas, updateTarefa, deleteTarefa } from '../controllers/tarefaController';
import { authUser } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authUser, (req, res, next) => { createTarefa(req, res).catch(next); });
router.get('/', authUser, (req, res, next) => { listTarefas(req, res).catch(next); });
router.put('/:id', authUser, (req, res, next) => { updateTarefa(req, res).catch(next); });
router.delete('/:id', authUser, (req, res, next) => { deleteTarefa(req, res).catch(next); });

export default router;
