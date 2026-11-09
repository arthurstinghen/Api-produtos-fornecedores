import { Fornecedor } from '../models/Fornecedor.js';
import {
  criarFornecedor,
  listarFornecedores,
  buscarFornecedorPorId,
  atualizarFornecedor,
  excluirFornecedor,
} from '../repositories/fornecedorRepository.js';

const MSG_ID_INVALIDO = 'ID inválido. Informe um inteiro positivo.';

function erroInterno(res, erro) {
  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro interno ao acessar o banco de dados.' });
}

export async function cadastrar(req, res) {
  try {
    const { nome, cnpj } = req.body ?? {};
    const fornecedor = new Fornecedor(nome, cnpj);
    const erros = fornecedor.validar();
    if (erros.length > 0) {
      return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
    }

    const id = await criarFornecedor(fornecedor);
    return res.status(201).json({
      mensagem: 'Fornecedor cadastrado com sucesso.',
      fornecedor: { id_fornecedor: id, nome: fornecedor.nome, cnpj: fornecedor.cnpj },
    });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ mensagem: 'Já existe um fornecedor com este CNPJ.' });
    }
    return erroInterno(res, erro);
  }
}

export async function listar(req, res) {
  try {
    const fornecedores = await listarFornecedores();
    return res.status(200).json(fornecedores);
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    if (!Fornecedor.validarId(id)) {
      return res.status(400).json({ mensagem: MSG_ID_INVALIDO });
    }

    const fornecedor = await buscarFornecedorPorId(Number(id));
    if (!fornecedor) {
      return res.status(404).json({ mensagem: 'Fornecedor não encontrado.' });
    }
    return res.status(200).json(fornecedor);
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function atualizar(req, res) {
  try {
    const { id } = req.params;
    if (!Fornecedor.validarId(id)) {
      return res.status(400).json({ mensagem: MSG_ID_INVALIDO });
    }

    const corpo = req.body ?? {};
    if (corpo.nome === undefined && corpo.cnpj === undefined) {
      return res.status(400).json({ mensagem: 'Envie ao menos um campo: nome ou cnpj.' });
    }

    const atual = await buscarFornecedorPorId(Number(id));
    if (!atual) {
      return res.status(404).json({ mensagem: 'Fornecedor não encontrado.' });
    }

    // PATCH parcial: campos não enviados são preservados.
    const fornecedor = new Fornecedor(
      corpo.nome !== undefined ? corpo.nome : atual.nome,
      corpo.cnpj !== undefined ? corpo.cnpj : atual.cnpj,
      Number(id)
    );
    const erros = fornecedor.validar();
    if (erros.length > 0) {
      return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
    }

    await atualizarFornecedor(Number(id), fornecedor);
    return res.status(200).json({
      mensagem: 'Fornecedor atualizado com sucesso.',
      fornecedor: { id_fornecedor: Number(id), nome: fornecedor.nome, cnpj: fornecedor.cnpj },
    });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ mensagem: 'Já existe um fornecedor com este CNPJ.' });
    }
    return erroInterno(res, erro);
  }
}

export async function excluir(req, res) {
  try {
    const { id } = req.params;
    if (!Fornecedor.validarId(id)) {
      return res.status(400).json({ mensagem: MSG_ID_INVALIDO });
    }

    const afetados = await excluirFornecedor(Number(id));
    if (afetados === 0) {
      return res.status(404).json({ mensagem: 'Fornecedor não encontrado.' });
    }
    return res.status(200).json({
      mensagem: 'Fornecedor excluído com sucesso. Os produtos relacionados foram mantidos sem fornecedor.',
    });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}
