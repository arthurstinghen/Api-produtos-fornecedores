import { Produto } from '../models/Produto.js';
import { Fornecedor } from '../models/Fornecedor.js';
import {
  criarProduto,
  listarProdutos,
  buscarProdutoSimplesPorId,
  buscarProdutoComFornecedorPorId,
  atualizarProduto,
  excluirProduto,
  vincularFornecedorAoProduto,
  removerFornecedorDoProduto,
} from '../repositories/produtoRepository.js';
import { buscarFornecedorPorId } from '../repositories/fornecedorRepository.js';

const MSG_ID_INVALIDO = 'ID inválido. Informe um inteiro positivo.';

function erroInterno(res, erro) {
  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro interno ao acessar o banco de dados.' });
}

export async function cadastrar(req, res) {
  try {
    const { descricao, preco, peso } = req.body ?? {};
    const produto = new Produto(descricao, preco, peso);
    const erros = produto.validar();
    if (erros.length > 0) {
      return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
    }

    const id = await criarProduto(produto);
    return res.status(201).json({
      mensagem: 'Produto cadastrado com sucesso.',
      produto: {
        id_produto: id,
        descricao: produto.descricao,
        preco: produto.preco,
        peso: produto.peso,
        fk_id_fornecedor: null,
      },
    });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function listar(req, res) {
  try {
    const produtos = await listarProdutos();
    return res.status(200).json(produtos);
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    if (!Produto.validarId(id)) {
      return res.status(400).json({ mensagem: MSG_ID_INVALIDO });
    }

    const linha = await buscarProdutoComFornecedorPorId(Number(id));
    if (!linha) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    return res.status(200).json({
      id_produto: linha.id_produto,
      descricao: linha.descricao,
      preco: linha.preco,
      peso: linha.peso,
      fornecedor: linha.id_fornecedor
        ? {
            id_fornecedor: linha.id_fornecedor,
            nome: linha.nome_fornecedor,
            cnpj: linha.cnpj_fornecedor,
          }
        : null,
    });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function atualizar(req, res) {
  try {
    const { id } = req.params;
    if (!Produto.validarId(id)) {
      return res.status(400).json({ mensagem: MSG_ID_INVALIDO });
    }

    const corpo = req.body ?? {};
    if (corpo.descricao === undefined && corpo.preco === undefined && corpo.peso === undefined) {
      return res.status(400).json({ mensagem: 'Envie ao menos um campo: descricao, preco ou peso.' });
    }

    const atual = await buscarProdutoSimplesPorId(Number(id));
    if (!atual) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    // PATCH parcial: campos não enviados são preservados.
    const produto = new Produto(
      corpo.descricao !== undefined ? corpo.descricao : atual.descricao,
      corpo.preco !== undefined ? corpo.preco : atual.preco,
      corpo.peso !== undefined ? corpo.peso : atual.peso,
      Number(id)
    );
    const erros = produto.validar();
    if (erros.length > 0) {
      return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
    }

    await atualizarProduto(Number(id), produto);
    return res.status(200).json({
      mensagem: 'Produto atualizado com sucesso.',
      produto: {
        id_produto: Number(id),
        descricao: produto.descricao,
        preco: produto.preco,
        peso: produto.peso,
        fk_id_fornecedor: atual.fk_id_fornecedor,
      },
    });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function excluir(req, res) {
  try {
    const { id } = req.params;
    if (!Produto.validarId(id)) {
      return res.status(400).json({ mensagem: MSG_ID_INVALIDO });
    }

    const afetados = await excluirProduto(Number(id));
    if (afetados === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }
    return res.status(200).json({ mensagem: 'Produto excluído com sucesso.' });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function vincularFornecedor(req, res) {
  try {
    const { idProduto, idFornecedor } = req.params;
    if (!Produto.validarId(idProduto) || !Fornecedor.validarId(idFornecedor)) {
      return res.status(400).json({ mensagem: 'IDs inválidos. Informe inteiros positivos.' });
    }

    const produto = await buscarProdutoSimplesPorId(Number(idProduto));
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    const fornecedor = await buscarFornecedorPorId(Number(idFornecedor));
    if (!fornecedor) {
      return res.status(404).json({ mensagem: 'Fornecedor não encontrado.' });
    }

    await vincularFornecedorAoProduto(Number(idProduto), Number(idFornecedor));
    return res.status(200).json({
      mensagem: 'Fornecedor vinculado ao produto com sucesso.',
      id_produto: Number(idProduto),
      fk_id_fornecedor: Number(idFornecedor),
    });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function removerFornecedor(req, res) {
  try {
    const { idProduto } = req.params;
    if (!Produto.validarId(idProduto)) {
      return res.status(400).json({ mensagem: MSG_ID_INVALIDO });
    }

    const produto = await buscarProdutoSimplesPorId(Number(idProduto));
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    await removerFornecedorDoProduto(Number(idProduto));
    return res.status(200).json({
      mensagem: 'Vínculo removido com sucesso. Produto e fornecedor foram mantidos.',
      id_produto: Number(idProduto),
      fk_id_fornecedor: null,
    });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}
