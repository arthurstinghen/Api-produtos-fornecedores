import { Router } from 'express';
import {
  cadastrar,
  listar,
  buscarPorId,
  atualizar,
  excluir,
} from '../controllers/fornecedorController.js';

const router = Router();

router.post('/', cadastrar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.patch('/:id', atualizar);
router.delete('/:id', excluir);

export default router;
