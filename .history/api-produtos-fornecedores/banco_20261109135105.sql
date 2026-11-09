CREATE DATABASE api_produtos_fornecedores
USE api_produtos_fornecedores;

CREATE TABLE fornecedor (
  id_fornecedor int UNSIGNEDnot null AUTO_INCREMENT,
  nome          varchar(100)not null,
  cnpj          char(14)    not null,
  primary key (id_fornecedor),
  unique key uq_fornecedor_cnpj (cnpj)
) 

CREATE TABLE produto (
  id_produto        INT UNSIGNED not null AUTO_INCREMENT,
  descricao         VARCHAR(150) not null,
  preco             DECIMAL(10,2)not null,
  peso              DECIMAL(10,3)not null,
  fk_id_fornecedor  INT UNSIGNED  NULL,
  primary key (id_produto),
  constraint fk_produto_fornecedor
    foreign key  (fk_id_fornecedor)
    references fornecedor (id_fornecedor)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) 

INSERT INTO fornecedor (nome, cnpj) 
VALUES
  ('Aço Brasil Ltda',        '11222333000181'),
  ('Parafusos Sul S/A',      '22333444000162'),
  ('Embalagens Vale Ltda',   '33444555000143');

INSERT INTO produto (descricao, preco, peso) 
VALUES
  ('Chapa de aço 2mm',        189.90, 12.500),
  ('Parafuso sextavado M8',     0.75,  0.015),
  ('Caixa de papelão grande',   6.40,  0.350),
  ('Rolamento 6204',           32.00,  0.110),
  ('Fita adesiva industrial',   9.99,  0.200);
