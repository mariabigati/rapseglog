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

INSERT INTO clientes (nome_cliente, cpf_cliente, email_cliente, data_nasc, idade) VALUES 
('Fulano de Tal', 11111111111, 'fulano@email.com', '2000-01-01', 25);

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
    fk_id_tipo_entrega INT NOT NULL,
    fk_id_cliente INT NOT NULL,
    data_pedido DATE NOT NULL,
    distancia DECIMAL(5,2) NOT NULL,
    peso_carga DECIMAL(7,3) NOT NULL,
    valor_base_kg DECIMAL(10,2) NOT NULL,
    valor_base_km DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (fk_id_cliente) REFERENCES clientes (id_cliente),
	FOREIGN KEY (fk_id_tipo_entrega) REFERENCES tipo_entregas (id_tipo_entrega)
);

CREATE TABLE IF NOT EXISTS entregas (
	id_entrega INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    fk_id_pedido INT NOT NULL,
    fk_id_status_entrega INT NOT NULL,
    valor_distancia DECIMAL(10,2) NOT NULL,
    valor_peso DECIMAL (10,2) NOT NULL,
    valor_base DECIMAL (10,2) NOT NULL,
    acresimo DECIMAL(10,2),
    desconto DECIMAL(10,2), 
    taxa_extra DECIMAL(10,2),
    valor_final DECIMAL (10,2) NOT NULL,
    FOREIGN KEY (fk_id_status_entrega) REFERENCES status_entregas (id_status_entrega),
    FOREIGN KEY (fk_id_pedido) REFERENCES pedidos (id_pedido)    
);

INSERT INTO tipo_entregas (tipo_entrega) VALUES ("Normal"), ("Urgente");

INSERT INTO status_entregas (status_entrega) VALUES ("Calculado"), ("Em trânsito"), ("Entregue"), ("Cancelado");

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
	CREATE PROCEDURE cadastrar_novo_cliente(IN pNomeCliente VARCHAR(100),
    IN pCpfCliente CHAR(11),
    IN pEmailCliente VARCHAR(100))
	BEGIN 
		INSERT INTO clientes (nome_cliente, cpf_cliente, email_cliente)
		VALUES (pNomeCliente, pCpfCliente, pEmailCliente);
	END $$
DELIMITER ;

 -- PROCEDURES PARA CADASTROS
DELIMITER $$
CREATE PROCEDURE cadastrar_novo_pedido (
	IN pDataPedido DATE,
	IN pIdCliente INT,
    IN pIdTipoEntrega INT,
	IN pDistancia DECIMAL(5,2),
	IN pPesoCarga DECIMAL(7,3),
	IN pValorBaseKG DECIMAL(10,2), 
	IN pValorBaseKM DECIMAL(10,2)
 )
BEGIN
	INSERT INTO pedidos (data_pedido, fk_id_cliente, fk_id_tipo_entrega, distancia, peso_carga, valor_base_kg, valor_base_km) 
    VALUES (pDataPedido, pIdCliente, pIdTipoEntrega, pDistancia, pPesoCarga, pValorBaseKG, pValorBaseKM);
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE cadastrar_nova_entrega (
	IN pIdPedido INT,
	IN pIdStatus INT,
	IN pValorDistancia DECIMAL(10,2),
	IN pValorPeso DECIMAL(10,2),
	IN pValorBase DECIMAL(10,2), 
    IN pAcresimo DECIMAL(10,2),
    IN pDesconto DECIMAL(10,2),
    IN pTaxaExtra DECIMAL(10,2),
	IN pValorFinal DECIMAL(10,2)
 )
BEGIN
	INSERT INTO entregas (fk_id_pedido, fk_id_status_entrega, valor_distancia, valor_peso, valor_base, acresimo, desconto, taxa_extra, valor_final) 
    VALUES (pIdPedido, pIdStatus, pValorDistancia, pValorPeso, pValorBase, pAcresimo, pDesconto, pTaxaExtra, pValorFinal);
END $$
DELIMITER ;

-- FUNÇÕES PARA CÁLCULOS DE VALORES FINAIS

-- VALOR DO PESO
DELIMITER $$
	CREATE FUNCTION calculo_valor_peso(peso_carga DECIMAL(7,3), valor_base_kg DECIMAL (10,2))
	RETURNS DECIMAL(10,2)
	DETERMINISTIC 
	BEGIN
		RETURN (peso_carga * valor_base_kg);
    END $$
DELIMITER ;

-- VALOR DA DISTÂNCIA
DELIMITER $$
	CREATE FUNCTION calculo_valor_distancia(distancia DECIMAL(5,2), valor_base_km DECIMAL (10,2))
	RETURNS DECIMAL(10,2)
	DETERMINISTIC 
	BEGIN
		RETURN (distancia * valor_base_km);
    END $$
DELIMITER ;

-- VALOR BASE

DELIMITER $$
	CREATE FUNCTION calculo_valor_base(valor_distancia DECIMAL(10,2), valor_peso DECIMAL(10,2))
	RETURNS DECIMAL(10,2)
	DETERMINISTIC 
	BEGIN
		RETURN valor_distancia + valor_peso;
    END $$
DELIMITER ;

-- PROCEDURES PARA ACRÉSIMOS, DESCONTOS E TAXAS
-- FK.ID : 2 (Tipo de Entrega URGENTE, deixar o acrésimo como 20% do valor base (0,2))

DELIMITER $$ 
CREATE PROCEDURE adicionar_acresimo(IN pIdPedido INT, pValorBase DECIMAL(10,2))
	BEGIN
		UPDATE entregas as e
        JOIN pedidos as p ON p.id_pedido = e.fk_id_pedido
		SET e.acresimo = (e.valor_base * 0.2) WHERE p.fk_id_tipo_entrega = 2 AND fk_id_pedido = pIdPedido;
        
        UPDATE entregas as e
        JOIN pedidos as p ON p.id_pedido = e.fk_id_pedido
		SET e.acresimo = 0 WHERE p.fk_id_tipo_entrega = 1 AND fk_id_pedido = pIdPedido;
	END $$
DELIMITER ;

CALL adicionar_acresimo(); -- funcionando!

-- DESCONTO DE 10% (0,1)
DELIMITER $$ 
CREATE PROCEDURE aplicar_desconto(IN pIdPedido INT)
	BEGIN
		UPDATE entregas AS e
		SET e.desconto = (e.valor_final * 0.1) WHERE e.valor_final > 500 AND fk_id_pedido = pIdPedido;
        
		UPDATE entregas
        SET valor_final = valor_final - desconto WHERE fk_id_pedido = pIdPedido;
	END $$
DELIMITER ;
CALL aplicar_desconto(1); -- Funcionando!
SELECT * FROM entregas;

-- TAXA DE R$15,00
DELIMITER $$ 
CREATE PROCEDURE aplicar_taxa_peso(IN pIdPedido INT)
	BEGIN
		UPDATE entregas AS e
        JOIN pedidos AS p ON e.fk_id_pedido = p.id_pedido
		SET e.taxa_extra = 15 WHERE p.peso_carga > 50 AND fk_id_pedido = pIdPedido;
        
        UPDATE entregas AS e
        JOIN pedidos AS p ON e.fk_id_pedido = p.id_pedido
		SET e.taxa_extra = 0 WHERE p.peso_carga < 50 AND fk_id_pedido = pIdPedido;
	END $$
DELIMITER ;

CALL aplicar_taxa_peso();

-- CADASTRO DE ENTREGAS COM OS CÁLCULOS BASE
DELIMITER $$
CREATE PROCEDURE cadastrar_nova_entrega_teste(IN pIdPedido INT, IN pIdStatus INT)
BEGIN
	DECLARE pValorDistancia DECIMAL(10,2);
    DECLARE pValorPeso DECIMAL(10,2);
    DECLARE pValorBase DECIMAL(10,2);
    DECLARE pValorFinal DECIMAL(10,2);
    
    SET pValorDistancia = calculo_valor_distancia(pIdPedido);
    SET pValorPeso = calculo_valor_peso(pIdPedido);
    SET pValorBase = calculo_valor_base(pIdPedido);

	INSERT INTO entregas (fk_id_pedido, fk_id_status_entrega, valor_distancia, valor_peso, valor_base, valor_final) 
    VALUES (
		pIdPedido,
		pIdStatus,
		pValorDistancia,
		pValorPeso,
		pValorBase, 
        pValorBase);
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER aplicar_valores_extras AFTER INSERT
ON entregas
FOR EACH ROW
BEGIN 
	CALL 
END $$
DELIMITER ;
CALL cadastrar_nova_entrega_teste(2, 1);
SELECT * FROM entregas;
-- FUNÇÕES PARA CÁLCULOS DE VALORES FINAIS COM SELECT PARA CONSEGUIR OS DADOS "AUTOMÁTICAMENTE"

-- VALOR DO PESO
DELIMITER $$
	CREATE FUNCTION calculo_valor_peso(pIdPedido INT)
	RETURNS DECIMAL(10,2)
	DETERMINISTIC 
	BEGIN
		DECLARE pPesoCarga DECIMAL(7,3);
		DECLARE pValorBaseKG DECIMAL(7,3);
        SELECT peso_carga INTO pPesoCarga FROM pedidos WHERE id_pedido = pIdPedido;
        SELECT valor_base_kg INTO pValorBaseKG FROM pedidos WHERE id_pedido = pIdPedido;
		RETURN (pPesoCarga * pValorBaseKG);
    END $$
DELIMITER ;

SELECT calculo_valor_peso(1); -- funcionando!
SELECT * FROM pedidos;

-- VALOR DA DISTÂNCIA
DELIMITER $$
	CREATE FUNCTION calculo_valor_distancia(pIdPedido INT)
	RETURNS DECIMAL(10,2)
	DETERMINISTIC 
	BEGIN
		DECLARE pDistancia DECIMAL(5,2);
        DECLARE pValorBaseKM DECIMAL (10,2);
        SELECT  distancia INTO pDistancia FROM pedidos WHERE id_pedido = pIdPedido;
        SELECT  valor_base_km INTO pValorBaseKM FROM pedidos WHERE id_pedido = pIdPedido;
		RETURN (pDistancia * pValorBaseKM);
    END $$
DELIMITER ;
SELECT calculo_valor_distancia(1);
SELECT * FROM pedidos;

-- VALOR BASE
DELIMITER $$
	CREATE FUNCTION calculo_valor_base(pIdPedido INT)
	RETURNS DECIMAL(10,2)
	DETERMINISTIC 
	BEGIN
		RETURN (calculo_valor_peso(pIdPedido) + calculo_valor_distancia(pIdPedido));
    END $$
DELIMITER ;

SELECT calculo_valor_base(1);

DELIMITER $$
	CREATE FUNCTION calculo_valor_final(pIdPedido INT, pAcresimo DECIMAL(10,2), pTaxa DECIMAL(10,2))
	RETURNS DECIMAL(10,2)
	DETERMINISTIC 
	BEGIN
		RETURN calculo_valor_base(pIdPedido) + pAcresimo + pTaxa;
    END $$
DELIMITER ;