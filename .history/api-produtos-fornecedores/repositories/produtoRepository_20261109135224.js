import conexao from '../conexao.js';

export async function criarProduto(produto) {
  const sql = 'INSERT INTO produto (descricao, preco, peso) VALUES (?, ?, ?)';
  const [resultado] = await conexao.execute(sql, [produto.descricao, produto.preco, produto.peso]);
  return resultado.insertId;
}

export async function listarProdutos() {
  const [linhas] = await conexao.execute(
    'SELECT id_produto, descricao, preco, peso, fk_id_fornecedor FROM produto ORDER BY id_produto'
  );
  return linhas;
}

// Busca simples (sem JOIN), usada para checar existência e mesclar o PATCH.
export async function buscarProdutoSimplesPorId(id) {
  const [linhas] = await conexao.execute(
    'SELECT id_produto, descricao, preco, peso, fk_id_fornecedor FROM produto WHERE id_produto = ?',
    [id]
  );
  return linhas[0] ?? null;
}

// LEFT JOIN: retorna o produto mesmo quando não há fornecedor vinculado.
export async function buscarProdutoComFornecedorPorId(id) {
  const sql = `
    SELECT p.id_produto, p.descricao, p.preco, p.peso, p.fk_id_fornecedor,
           f.id_fornecedor, f.nome AS nome_fornecedor, f.cnpj AS cnpj_fornecedor
      FROM produto p
      LEFT JOIN fornecedor f ON f.id_fornecedor = p.fk_id_fornecedor
     WHERE p.id_produto = ?`;
  const [linhas] = await conexao.execute(sql, [id]);
  return linhas[0] ?? null;
}

export async function atualizarProduto(id, produto) {
  const sql = 'UPDATE produto SET descricao = ?, preco = ?, peso = ? WHERE id_produto = ?';
  const [resultado] = await conexao.execute(sql, [
    produto.descricao,
    produto.preco,
    produto.peso,
    id,
  ]);
  return resultado.affectedRows;
}

export async function excluirProduto(id) {
  const [resultado] = await conexao.execute('DELETE FROM produto WHERE id_produto = ?', [id]);
  return resultado.affectedRows;
}

export async function vincularFornecedorAoProduto(idProduto, idFornecedor) {
  const [resultado] = await conexao.execute(
    'UPDATE produto SET fk_id_fornecedor = ? WHERE id_produto = ?',
    [idFornecedor, idProduto]
  );
  return resultado.affectedRows;
}

export async function removerFornecedorDoProduto(idProduto) {
  const [resultado] = await conexao.execute(
    'UPDATE produto SET fk_id_fornecedor = NULL WHERE id_produto = ?',
    [idProduto]
  );
  return resultado.affectedRows;
}
