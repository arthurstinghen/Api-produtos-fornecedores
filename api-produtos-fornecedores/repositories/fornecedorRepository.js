import conexao from '../conexao.js';

export async function criarFornecedor(fornecedor) {
  const sql = 'INSERT INTO fornecedor (nome, cnpj) VALUES (?, ?)';
  const [resultado] = await conexao.execute(sql, [fornecedor.nome, fornecedor.cnpj]);
  return resultado.insertId;
}

export async function listarFornecedores() {
  const [linhas] = await conexao.execute(
    'SELECT id_fornecedor, nome, cnpj FROM fornecedor ORDER BY id_fornecedor'
  );
  return linhas;
}

export async function buscarFornecedorPorId(id) {
  const [linhas] = await conexao.execute(
    'SELECT id_fornecedor, nome, cnpj FROM fornecedor WHERE id_fornecedor = ?',
    [id]
  );
  return linhas[0] ?? null;
}

export async function atualizarFornecedor(id, fornecedor) {
  const sql = 'UPDATE fornecedor SET nome = ?, cnpj = ? WHERE id_fornecedor = ?';
  const [resultado] = await conexao.execute(sql, [fornecedor.nome, fornecedor.cnpj, id]);
  return resultado.affectedRows;
}

export async function excluirFornecedor(id) {
  const [resultado] = await conexao.execute(
    'DELETE FROM fornecedor WHERE id_fornecedor = ?',
    [id]
  );
  return resultado.affectedRows;
}
