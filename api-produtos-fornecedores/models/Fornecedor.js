export class Fornecedor {
  constructor(nome, cnpj, id) {
    this.id = id;
    this.nome = typeof nome === 'string' ? nome.trim() : nome;
    this.cnpj = typeof cnpj === 'string' ? cnpj.trim() : cnpj;
  }

  // Valida um ID recebido (ex.: req.params): inteiro positivo.
  static validarId(id) {
    return /^\d+$/.test(String(id)) && Number(id) > 0;
  }

  validarId() {
    return Fornecedor.validarId(this.id);
  }

  validarNome() {
    return typeof this.nome === 'string' && this.nome.length >= 3;
  }

  validarCnpj() {
    return typeof this.cnpj === 'string' && this.cnpj.length === 14;
  }

  // Retorna a lista de erros (vazia = dados válidos).
  validar() {
    const erros = [];
    if (!this.validarNome()) erros.push('O nome deve possuir pelo menos 3 caracteres.');
    if (!this.validarCnpj()) erros.push('O CNPJ deve possuir exatamente 14 caracteres.');
    return erros;
  }
}
