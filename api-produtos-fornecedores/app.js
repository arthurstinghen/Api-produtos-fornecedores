import dotenv from 'dotenv';
import express from 'express';
import fornecedorRoutes from './routes/fornecedorRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/fornecedor', fornecedorRoutes);
app.use('/produto', produtoRoutes);

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

app.use((erro, req, res, next) => {
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ mensagem: 'JSON inválido no corpo da requisição.' });
  }
  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
