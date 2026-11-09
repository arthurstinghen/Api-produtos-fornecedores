import { Router } from 'express';
import {
  cadastrar,
  listar,
  buscarPorId,
  atualizar,
  excluir,
  vincularFornecedor,
  removerFornecedor,
} from '../controllers/produtoController.js';

const router = Router();

router.post('/', cadastrar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.patch('/:id', atualizar);
router.delete('/:id', excluir);

// Relacionamento Produto x Fornecedor
router.patch('/:idProduto/fornecedor/:idFornecedor', vincularFornecedor);
router.patch('/:idProduto/remover-fornecedor', removerFornecedor);

export default router;
