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
    acrescimo DECIMAL(10,2),
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

-- CADASTRO DE ENTREGAS COM OS CÁLCULOS BASE
DELIMITER $$
CREATE PROCEDURE cadastrar_nova_entrega(IN pIdPedido INT, IN pIdStatus INT)
BEGIN
	DECLARE pValorDistancia DECIMAL(10,2);
    DECLARE pValorPeso DECIMAL(10,2);
    DECLARE pValorBase DECIMAL(10,2);
    DECLARE pValorFinalTemp DECIMAL(10,2);
    DECLARE pAcrescimo DECIMAL(10,2);
    DECLARE pDesconto DECIMAL(10,2);
    DECLARE pTaxaExtra DECIMAL(10,2);
    DECLARE pValorFinal DECIMAL(10,2);
    
    SET pValorDistancia = calculo_valor_distancia(pIdPedido);
    SET pValorPeso = calculo_valor_peso(pIdPedido);
    SET pValorBase = calculo_valor_base(pIdPedido);
	SET pAcrescimo = calcular_acrescimo(pIdPedido, pValorBase);
    SET pTaxaExtra = calcular_taxa_peso(pIdPedido);
    SET pValorFinalTemp = pValorBase + pAcrescimo + pTaxaExtra;
    SET pDesconto = calcular_desconto(pValorFinalTemp);
    SET pValorFinal = calculo_valor_final(pValorBase, pAcrescimo, pTaxaExtra, pDesconto);
    
	INSERT INTO entregas (fk_id_pedido, fk_id_status_entrega, valor_distancia, valor_peso, valor_base, acrescimo, desconto, taxa_extra, valor_final) 
    VALUES (
		pIdPedido,
		pIdStatus,
		pValorDistancia,
		pValorPeso,
		pValorBase, 
        pAcrescimo,
        pDesconto,
        pTaxaExtra,
        pValorFinal);
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE update_estado_entrega(IN pIdEntrega INT, IN pIdStatus INT)
BEGIN 
	UPDATE entregas SET fk_id_status_entrega = pIdStatus WHERE id_entrega = pIdEntrega;
END $$
DELIMITER ;
CALL update_estado_entrega(31, 4);
SELECT * FROM entregas;
DELETE FROM entregas;

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


DELIMITER $$
	CREATE FUNCTION calculo_valor_final(pValorFinal DECIMAL(10,2), calculo_valor_distanciapAcrescimo DECIMAL(10,2), pTaxa DECIMAL(10,2), pDesconto DECIMAL(10,2))
	RETURNS DECIMAL(10,2)
	DETERMINISTIC 
	BEGIN
		RETURN pValorFinal + pAcrescimo + pTaxa - pDesconto;
    END $$
DELIMITER ;

DELIMITER $$ 
CREATE FUNCTION calcular_acrescimo(pIdPedido INT, pValorBase DECIMAL(10,2))
	RETURNS DECIMAL(10,2)
    DETERMINISTIC
	BEGIN
		DECLARE pIdTipo INT;
        DECLARE acrescimo DECIMAL(10,2);
        SELECT fk_id_tipo_entrega INTO pIdTipo FROM pedidos WHERE id_pedido = pIdPedido;
        IF pIdTipo = 2 THEN
			SET acrescimo = pValorBase * 0.2;	
        ELSE 
			SET acrescimo = 0;
        END IF;
		RETURN acrescimo;
	END $$
DELIMITER ;

-- DESCONTO DE 10% (0,1)
DELIMITER $$ 
CREATE FUNCTION calcular_desconto(pValorFinal DECIMAL(10,2))
	RETURNS DECIMAL(10,2)
	DETERMINISTIC
	BEGIN
		DECLARE pDesconto DECIMAL(10,2);
		IF pValorFinal > 500 THEN
			SET pDesconto = pValorFinal * 0.1;
		ELSE
			SET pDesconto = 0;
		END IF;
		RETURN pDesconto;
	END $$
DELIMITER ;

-- TAXA DE R$15,00
DELIMITER $$ 
CREATE FUNCTION calcular_taxa_peso(pIdPedido INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
	BEGIN
		DECLARE pPesoCarga DECIMAL(7,3);
        DECLARE pTaxaPeso DECIMAL(10,2);
        SELECT peso_carga INTO pPesoCarga FROM pedidos WHERE id_pedido = pIdPedido;
		IF pPesoCarga > 50 THEN
			SET pTaxaPeso = 15;
		ELSE 
			SET pTaxaPeso = 0;
		END IF;
		RETURN pTaxaPeso;
	END $$
DELIMITER ;

