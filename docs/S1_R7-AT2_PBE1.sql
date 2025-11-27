CREATE DATABASE rapseglog;
USE rapseglog;

CREATE TABLE IF NOT EXISTS clientes (
	id_cliente INT PRIMARY KEY AUTO_INCREMENT  NOT NULL,
    nome_cliente VARCHAR(100) NOT NULL,
    cpf_cliente CHAR(11) UNIQUE NOT NULL,
    email_cliente VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS produtos (
	id_produto INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nome_produto VARCHAR(100) NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    peso_unitario DECIMAL(7,3) NOT NULL
);

CREATE TABLE IF NOT EXISTS tipo_entregas(
	id_tipo_entrega INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    tipo_entrega VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS status_entregas(
	id_status_entrega INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    status_entrega VARCHAR(25) NOT NULL
);

CREATE TABLE IF NOT EXISTS telefones (
	id_telefone INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    fk_id_cliente INT NOT NULL,
    telefone VARCHAR(12) NOT NULL,
    FOREIGN KEY (fk_id_cliente) REFERENCES clientes (id_cliente)
);

CREATE TABLE IF NOT EXISTS enderecos (
	id_endereco INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    fk_id_cliente INT NOT NULL,
    estado VARCHAR(45) NOT NULL,
    cidade VARCHAR(45) NOT NULL,
    bairro VARCHAR(45) NOT NULL,
    logradouro VARCHAR(45) NOT NULL,
    numero INT NOT NULL,
    cep CHAR(9) NOT NULL,
    FOREIGN KEY (fk_id_cliente) REFERENCES clientes (id_cliente)
);

CREATE TABLE IF NOT EXISTS pedidos (
	id_pedido INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    fk_id_cliente INT NOT NULL,
    data_pedido DATE NOT NULL,
    FOREIGN KEY (fk_id_cliente) REFERENCES clientes (id_cliente)
);

CREATE TABLE IF NOT EXISTS itens_pedido (
	id_item INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    fk_id_produto  INT PRIMARY KEY NOT NULL,
    fk_id_pedido INT PRIMARY KEY NOT NULL,
    peso_produto DECIMAL(7,3) NOT NULL,
    valor_total_item DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS entregas (
	id_entrega INT PRIMARY KEY NOT NULL,
    fk_id_status_entrega INT NOT NULL,
    fk_id_pedido INT NOT NULL,
    fk_id_tipo_entrega INT NOT NULL,
    distancia DECIMAL(5,2) NOT NULL,
    peso_carga DECIMAL(7,3) NOT NULL,
    valor_base_kg DECIMAL(10,2) NOT NULL,
    valor_base_km DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (fk_id_status_entrega) REFERENCES status_entregas (id_status_entrega),
    FOREIGN KEY (fk_id_tipo_entrega) REFERENCES tipo_entregas (id_tipo_entrega),
    FOREIGN KEY (fk_id_pedido) REFERENCES pedidos (id_pedido)    
);

CREATE TABLE IF NOT EXISTS valores_finais_entrega (
	id_valores_entrega INT PRIMARY KEY NOT NULL,
    fk_id_entrega INT NOT NULL,
    valor_distancia DECIMAL(10,2) NOT NULL,
    valor_peso DECIMAL (10,2) NOT NULL,
    acresimo DECIMAL(10,2),
    desconto DECIMAL(10,2), 
    taxa_extra DECIMAL(10,2),
    valor_final DECIMAL (10,2) NOT NULL,
    FOREIGN KEY (fk_id_entrega) REFERENCES entregas (id_entrega) 
);