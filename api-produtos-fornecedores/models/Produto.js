export class Produto {
  constructor(descricao, preco, peso, id) {
    this.id = id;
    this.descricao = typeof descricao === 'string' ? descricao.trim() : descricao;
    this.preco = Produto.paraNumero(preco);
    this.peso = Produto.paraNumero(peso);
  }

  // Aceita número ou texto numérico; qualquer outra coisa vira NaN.
  static paraNumero(valor) {
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string' && valor.trim() !== '') return Number(valor);
    return NaN;
  }

  // Valida um ID recebido (ex.: req.params): inteiro positivo.
  static validarId(id) {
    return /^\d+$/.test(String(id)) && Number(id) > 0;
  }

  validarId() {
    return Produto.validarId(this.id);
  }

  validarDescricao() {
    return typeof this.descricao === 'string' && this.descricao.length >= 3;
  }

  validarPreco() {
    return Number.isFinite(this.preco) && this.preco > 0;
  }

  validarPeso() {
    return Number.isFinite(this.peso) && this.peso > 0;
  }

  // Retorna a lista de erros (vazia = dados válidos).
  validar() {
    const erros = [];
    if (!this.validarDescricao()) erros.push('A descrição deve possuir pelo menos 3 caracteres.');
    if (!this.validarPreco()) erros.push('O preço deve ser um número maior que zero.');
    if (!this.validarPeso()) erros.push('O peso deve ser um número maior que zero.');
    return erros;
  }
}
