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
    telefone CHAR(11) NOT NULL,
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

-- FUNÇÕES PARA CÁLCULOS DE VALORES FINAIS

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
    CREATE FUNCTION calculo_valor_final(pValorFinal DECIMAL(10,2), pAcrescimo DECIMAL(10,2), pTaxaExtra DECIMAL(10,2), pDesconto DECIMAL(10,2))
    RETURNS DECIMAL(10,2)
    DETERMINISTIC
    BEGIN
        RETURN pValorFinal + pAcrescimo + pTaxaExtra - pDesconto;
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
SELECT calcular_desconto(90186.00);


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

 -- PROCEDURES PARA CADASTROS
 DELIMITER $$
    CREATE PROCEDURE cadastrar_endereco(IN pEstado VARCHAR(45), IN pBairro VARCHAR(45), IN pLogradouro VARCHAR(45), IN pNumero INT, IN pCep CHAR(9), IN pIdCliente INT)
    BEGIN
        INSERT INTO enderecos (estado, cidade, bairro, logradouro, numero, cep, fk_id_cliente) VALUES
        (pEstado, pBairro, pLogradouro, pNumero, pCep, pIdCliente);
    END $$
DELIMITER ;

DELIMITER ;

    CREATE PROCEDURE cadastrar_telefone(IN pId_Cliente INT,
    pTelefone CHAR(11))
    BEGIN
        INSERT INTO telefones (fk_id_cliente, telefone) 
        VALUES (pId_Cliente, pTelefone);
    END $$
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE cadastrar_novo_cliente(IN pNomeCliente VARCHAR(100), IN pCpfCliente CHAR(11), IN pEmailCliente VARCHAR(100), IN pDataNasc DATE)
	BEGIN
		INSERT INTO clientes (nome_cliente, cpf_cliente, email_cliente, data_nasc, idade)
		VALUES (pNomeCliente, pCpfCliente, pEmailCliente, pDataNasc, calculo_idade(pDataNasc));
END $$
DELIMITER ;

DELIMITER $$
    CREATE FUNCTION calculo_idade(data_nasc DATE)
    RETURNS INT
    DETERMINISTIC 
    BEGIN
        RETURN TIMESTAMPDIFF(YEAR, data_nasc, CURDATE());
    END $$
DELIMITER ;

CREATE EVENT atualizar_idade
    ON SCHEDULE EVERY 1 DAY
    DO
    UPDATE clientes SET idade = calculo_idade(data_nasc);
    
DELIMITER $$
	CREATE TRIGGER trg_atualiza_idade_after_update
    AFTER UPDATE
    ON clientes
    FOR EACH ROW
		BEGIN
			UPDATE clientes SET idade = calculo_idade(data_nasc); 
		END $$
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE excluir_cliente (IN pId_cliente INT)
	BEGIN
		DELETE FROM telefones WHERE fk_id_cliente = pId_Cliente;
		DELETE FROM enderecos WHERE fk_id_cliente = pId_cliente;
		DELETE FROM clientes WHERE id_cliente = pId_cliente;
	END $$
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE excluir_telefone(IN pId_Cliente INT)
	BEGIN
		DELETE FROM telefones WHERE fk_id_cliente = pId_Cliente;
END $$
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE excluir_endereco(IN pId_Cliente INT)
	BEGIN
		DELETE FROM enderecos WHERE fk_id_cliente = pId_Cliente;
END $$
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE atualizar_cliente(IN pId_Cliente INT, IN pNomeCliente VARCHAR(100), IN pCpfCliente CHAR(11), IN pEmailCliente VARCHAR(100), IN pDataNasc DATE)
	BEGIN
		UPDATE clientes
		SET nome_cliente = pNomeCliente, cpf_cliente = pCpfCliente,
        email_cliente = pEmailCliente, data_nascimento = pDataNasc
		WHERE id_cliente = pId_Cliente;
	END$$
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE atualizar_endereco(IN pId_Cliente INT, IN pCep CHAR(8), IN pNumero INT, IN pEstado VARCHAR(45), IN pCidade VARCHAR(45), IN pBairro VARCHAR(45), IN pLogradouro VARCHAR(45))
	BEGIN
		UPDATE enderecos
		SET cep = pCep, numero = pNumero,
        estado = pEstado, cidade = pCidade, 
        bairro = pBairro, logradouro = pLogradouro
		WHERE fk_id_cliente = pId_Cliente;
	END$$
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE atualizar_telefone(IN pId_Cliente INT, IN pTelefone char(11))
	BEGIN
		UPDATE telefones
		SET telefone = pTelefone
		WHERE fk_id_cliente = pId_Cliente;
	END$$
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

-- Cadastros de Pedidos
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
    DECLARE pValorAntesDesconto DECIMAL(10,2);
    DECLARE pAcrescimo DECIMAL(10,2);
    DECLARE pDesconto DECIMAL(10,2);
    DECLARE pTaxaExtra DECIMAL(10,2);
    DECLARE pValorFinal DECIMAL(10,2);
   
    SET pValorDistancia = calculo_valor_distancia(pIdPedido);
    SET pValorPeso = calculo_valor_peso(pIdPedido);
    SET pValorBase = calculo_valor_base(pIdPedido);
    SET pAcrescimo = calcular_acrescimo(pIdPedido, pValorBase);
    SET pTaxaExtra = calcular_taxa_peso(pIdPedido);
    SET pValorAntesDesconto = pValorBase + pAcrescimo + pTaxaExtra;
    SET pDesconto = calcular_desconto(pValorAntesDesconto);
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

-- UPDATE DE ESTADO DAS ENTREGAS
DELIMITER $$
CREATE PROCEDURE update_estado_entrega(IN pIdEntrega INT, IN pIdStatus INT)
BEGIN
    DECLARE oldIdStatus INT;
    SELECT fk_id_status_entrega INTO oldIdStatus FROM entregas WHERE id_entrega = pIdEntrega;
    IF oldIdStatus = pIdStatus THEN
        SELECT 0 AS linhas_afetadas;
    ELSE
        UPDATE entregas SET fk_id_status_entrega = pIdStatus WHERE id_entrega = pIdEntrega;
        SELECT 1 AS linhas_afetadas;
    END IF;
END $$
DELIMITER ;

-- UPDATE DE PEDIDOS
DELIMITER $$
CREATE PROCEDURE update_pedidos(
    IN pIdPedido INT,
    IN pDistancia DECIMAL(5,2),
    IN pPesoCarga DECIMAL(10,2),
    IN pValorBaseKG DECIMAL(10,2),
    IN pValorBaseKM DECIMAL(10,2)
 )
BEGIN
    DECLARE oldDistancia DECIMAL(5,2);
    DECLARE oldPeso DECIMAL(10,2);
    DECLARE oldValorKG DECIMAL(10,2);
    DECLARE oldValorKM DECIMAL(10,2);
   
    SELECT distancia, peso_carga, valor_base_kg, valor_base_km
    INTO oldDistancia, oldPeso, oldValorKG, oldValorKM
    FROM pedidos
    WHERE id_pedido = pIdPedido;
   
    IF oldDistancia = pDistancia
       AND oldPeso = pPesoCarga
       AND oldValorKG = pValorBaseKG
       AND oldValorKM = pValorBaseKM THEN
       
       -- Seleciona 0 como o valor das linhas afetadas. Logo, não houve mudanças.
        SELECT 0 AS linhas_afetadas;
       
    ELSE
         UPDATE pedidos SET
            distancia = pDistancia,
            peso_carga = pPesoCarga,
            valor_base_kg = pValorBaseKG,
            valor_base_km = pValorBaseKM
        WHERE id_pedido = pIdPedido;
    -- Seleciona 1 como o valor das linhas afetadas. Logo, houve mudanças.
    SELECT 1 AS linhas_afetadas;
    END IF;
END $$
DELIMITER ;

-- VIEWS
CREATE VIEW vw_entregas AS
SELECT
    e.id_entrega,
    p.id_pedido,
    c.nome_cliente,
    se.status_entrega,
    te.tipo_entrega,
    e.valor_distancia,
    e.valor_peso,
    e.valor_base,
    e.acrescimo,
    e.desconto,
    e.taxa_extra,
    e.valor_final FROM entregas as e
    JOIN pedidos as p on e.fk_id_pedido = p.id_pedido
    JOIN clientes as c on c.id_cliente = p.fk_id_cliente
    JOIN status_entregas as se on se.id_status_entrega = e.fk_id_status_entrega
    JOIN tipo_entregas as te on te.id_tipo_entrega = p.fk_id_tipo_entrega;


SELECT * FROM vw_entregas;


SELECT nome_cliente as "Nome Cliente", SUM(valor_final) as "Valor Total Gasto" FROM vw_entregas GROUP BY nome_cliente;
SELECT * FROM entregas;
SELECT * FROM pedidos;

-- TRIGGERS
DELIMITER $$
CREATE TRIGGER trg_atualiza_entregas_after_update
    AFTER UPDATE ON pedidos
    FOR EACH ROW
    BEGIN
        DECLARE pValorDistancia DECIMAL(10,2);
        DECLARE pValorPeso DECIMAL(10,2);
        DECLARE pValorBase DECIMAL(10,2);
        DECLARE pValorAntesDesconto DECIMAL(10,2);
        DECLARE pAcrescimo DECIMAL(10,2);
        DECLARE pDesconto DECIMAL(10,2);
        DECLARE pTaxaExtra DECIMAL(10,2);
        DECLARE pValorFinal DECIMAL(10,2);
       
        IF NEW.distancia <> OLD.distancia
        OR NEW.peso_carga <> OLD.peso_carga
        OR NEW.valor_base_kg <> OLD.valor_base_kg
        OR NEW.valor_base_km <> OLD.valor_base_km THEN
       
        SET pValorDistancia = calculo_valor_distancia(NEW.id_pedido);
        SET pValorPeso = calculo_valor_peso(NEW.id_pedido);
        SET pValorBase = calculo_valor_base(NEW.id_pedido);
        SET pAcrescimo = calcular_acrescimo(NEW.id_pedido, pValorBase);
        SET pTaxaExtra = calcular_taxa_peso(NEW.id_pedido);
       
        SET pValorAntesDesconto = pValorBase + pAcrescimo + pTaxaExtra;
        SET pDesconto = calcular_desconto(pValorAntesDesconto);
        SET pValorFinal = calculo_valor_final(pValorBase, pAcrescimo, pTaxaExtra, pDesconto);
   
            UPDATE entregas SET
            valor_distancia = pValorDistancia,
            valor_peso = pValorPeso,
            valor_base = pValorBase,
            acrescimo = pAcrescimo,
            desconto = pDesconto,
            taxa_extra = pTaxaExtra,
            valor_final = pValorFinal WHERE fk_id_pedido = NEW.id_pedido;
            END IF;
           
    END $$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_cria_entregas_after_insert_pedidos
    AFTER INSERT ON pedidos
    FOR EACH ROW
    BEGIN
        DECLARE pValorDistancia DECIMAL(10,2);
        DECLARE pValorPeso DECIMAL(10,2);
        DECLARE pValorBase DECIMAL(10,2);
        DECLARE pValorAntesDesconto DECIMAL(10,2);
        DECLARE pAcrescimo DECIMAL(10,2);
        DECLARE pDesconto DECIMAL(10,2);
        DECLARE pTaxaExtra DECIMAL(10,2);
        DECLARE pValorFinal DECIMAL(10,2);
       
        SET pValorDistancia = calculo_valor_distancia(NEW.id_pedido);
        SET pValorPeso = calculo_valor_peso(NEW.id_pedido);
        SET pValorBase = calculo_valor_base(NEW.id_pedido);
        SET pAcrescimo = calcular_acrescimo(NEW.id_pedido, pValorBase);
        SET pTaxaExtra = calcular_taxa_peso(NEW.id_pedido);
       
        SET pValorAntesDesconto = pValorBase + pAcrescimo + pTaxaExtra;
        SET pDesconto = calcular_desconto(pValorAntesDesconto);
        SET pValorFinal = calculo_valor_final(pValorBase, pAcrescimo, pTaxaExtra, pDesconto);
   
            INSERT INTO entregas (fk_id_pedido, fk_id_status_entrega, valor_distancia, valor_peso, valor_base, acrescimo, desconto, taxa_extra, valor_final)
    VALUES (
        NEW.id_pedido,
        1,
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
CREATE TRIGGER trg_deleta_entregas_before_delete_pedidos
    BEFORE DELETE ON pedidos
    FOR EACH ROW
    BEGIN
        DELETE FROM entregas WHERE fk_id_pedido = OLD.id_pedido;
    END $$
DELIMITER ;
