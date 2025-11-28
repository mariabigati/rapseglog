CREATE DATABASE rapseglog;
USE rapseglog;

CREATE TABLE IF NOT EXISTS clientes (
	id_cliente INT PRIMARY KEY AUTO_INCREMENT  NOT NULL,
    nome_cliente VARCHAR(100) NOT NULL,
    cpf_cliente CHAR(11) UNIQUE NOT NULL,
    email_cliente VARCHAR(100) UNIQUE NOT NULL,
    data_nasc DATE NOT NULL,
    idade INT
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

DELIMITER $$
	CREATE PROCEDURE cadastrar_endereco(IN pEstado VARCHAR(45), IN pBairro VARCHAR(45), IN pLogradouro VARCHAR(45), IN pNumero INT, IN pCep CHAR(9), IN pIdCliente INT)
	BEGIN
		INSERT INTO enderecos (estado, cidade, bairro, logradouro, numero, cep, fk_id_cliente) VALUES 
        (pEstado, pBairro, pLogradouro, pNumero, pCep, pIdCliente);
	END $$
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE cadastrar_telefone(IN pId_Cliente INT,
    pTelefone VARCHAR(12))
    BEGIN
		INSERT INTO telefones (fk_id_cliente, telefone) 
		VALUES (pId_Cliente, pTelefone);
    END
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE cadastrar_novo_cliente(IN pNomeCliente VARCHAR(100), IN pCpfCliente CHAR(11), IN pEmailCliente VARCHAR(100), IN pDataNasc DATE)
	BEGIN
		INSERT INTO clientes (nome_cliente, cpf_cliente, email_cliente, data_nasc, idade)
		VALUES (pNomeCliente, pCpfCliente, pEmailCliente, pDataNasc, TIMESTAMPDIFF(YEAR, pDataNasc, CURDATE()));
END $$
DELIMITER ;

