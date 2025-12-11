-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: rapseglog
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nome_cliente` varchar(100) NOT NULL,
  `cpf_cliente` char(11) NOT NULL,
  `email_cliente` varchar(100) NOT NULL,
  `data_nasc` date NOT NULL,
  `idade` int DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `cpf_cliente` (`cpf_cliente`),
  UNIQUE KEY `email_cliente` (`email_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Fulano de Tal','11111111111','fulano@email.com','2000-01-01',25);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enderecos`
--

DROP TABLE IF EXISTS `enderecos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enderecos` (
  `id_endereco` int NOT NULL AUTO_INCREMENT,
  `fk_id_cliente` int NOT NULL,
  `estado` varchar(45) NOT NULL,
  `cidade` varchar(45) NOT NULL,
  `bairro` varchar(45) NOT NULL,
  `logradouro` varchar(45) NOT NULL,
  `numero` int NOT NULL,
  `cep` char(9) NOT NULL,
  PRIMARY KEY (`id_endereco`),
  KEY `fk_id_cliente` (`fk_id_cliente`),
  CONSTRAINT `enderecos_ibfk_1` FOREIGN KEY (`fk_id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enderecos`
--

LOCK TABLES `enderecos` WRITE;
/*!40000 ALTER TABLE `enderecos` DISABLE KEYS */;
/*!40000 ALTER TABLE `enderecos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entregas`
--

DROP TABLE IF EXISTS `entregas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entregas` (
  `id_entrega` int NOT NULL AUTO_INCREMENT,
  `fk_id_pedido` int NOT NULL,
  `fk_id_status_entrega` int NOT NULL,
  `valor_distancia` decimal(10,2) NOT NULL,
  `valor_peso` decimal(10,2) NOT NULL,
  `valor_base` decimal(10,2) NOT NULL,
  `acrescimo` decimal(10,2) DEFAULT NULL,
  `desconto` decimal(10,2) DEFAULT NULL,
  `taxa_extra` decimal(10,2) DEFAULT NULL,
  `valor_final` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_entrega`),
  KEY `fk_id_status_entrega` (`fk_id_status_entrega`),
  KEY `fk_id_pedido` (`fk_id_pedido`),
  CONSTRAINT `entregas_ibfk_1` FOREIGN KEY (`fk_id_status_entrega`) REFERENCES `status_entregas` (`id_status_entrega`),
  CONSTRAINT `entregas_ibfk_2` FOREIGN KEY (`fk_id_pedido`) REFERENCES `pedidos` (`id_pedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entregas`
--

LOCK TABLES `entregas` WRITE;
/*!40000 ALTER TABLE `entregas` DISABLE KEYS */;
/*!40000 ALTER TABLE `entregas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `fk_id_tipo_entrega` int NOT NULL,
  `fk_id_cliente` int NOT NULL,
  `data_pedido` date NOT NULL,
  `distancia` decimal(5,2) NOT NULL,
  `peso_carga` decimal(7,3) NOT NULL,
  `valor_base_kg` decimal(10,2) NOT NULL,
  `valor_base_km` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `fk_id_cliente` (`fk_id_cliente`),
  KEY `fk_id_tipo_entrega` (`fk_id_tipo_entrega`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`fk_id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`fk_id_tipo_entrega`) REFERENCES `tipo_entregas` (`id_tipo_entrega`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_cria_entregas_after_insert_pedidos` AFTER INSERT ON `pedidos` FOR EACH ROW BEGIN
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
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_atualiza_entregas_after_update` AFTER UPDATE ON `pedidos` FOR EACH ROW BEGIN
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
           
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_deleta_entregas_before_delete_pedidos` BEFORE DELETE ON `pedidos` FOR EACH ROW BEGIN
        DELETE FROM entregas WHERE fk_id_pedido = OLD.id_pedido;
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `status_entregas`
--

DROP TABLE IF EXISTS `status_entregas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_entregas` (
  `id_status_entrega` int NOT NULL AUTO_INCREMENT,
  `status_entrega` varchar(25) NOT NULL,
  PRIMARY KEY (`id_status_entrega`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_entregas`
--

LOCK TABLES `status_entregas` WRITE;
/*!40000 ALTER TABLE `status_entregas` DISABLE KEYS */;
INSERT INTO `status_entregas` VALUES (1,'Calculado'),(2,'Em trânsito'),(3,'Entregue'),(4,'Cancelado');
/*!40000 ALTER TABLE `status_entregas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `telefones`
--

DROP TABLE IF EXISTS `telefones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `telefones` (
  `id_telefone` int NOT NULL AUTO_INCREMENT,
  `fk_id_cliente` int NOT NULL,
  `telefone` char(11) NOT NULL,
  PRIMARY KEY (`id_telefone`),
  KEY `fk_id_cliente` (`fk_id_cliente`),
  CONSTRAINT `telefones_ibfk_1` FOREIGN KEY (`fk_id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `telefones`
--

LOCK TABLES `telefones` WRITE;
/*!40000 ALTER TABLE `telefones` DISABLE KEYS */;
/*!40000 ALTER TABLE `telefones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_entregas`
--

DROP TABLE IF EXISTS `tipo_entregas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_entregas` (
  `id_tipo_entrega` int NOT NULL AUTO_INCREMENT,
  `tipo_entrega` varchar(45) NOT NULL,
  PRIMARY KEY (`id_tipo_entrega`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_entregas`
--

LOCK TABLES `tipo_entregas` WRITE;
/*!40000 ALTER TABLE `tipo_entregas` DISABLE KEYS */;
INSERT INTO `tipo_entregas` VALUES (1,'Normal'),(2,'Urgente');
/*!40000 ALTER TABLE `tipo_entregas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_entregas`
--

DROP TABLE IF EXISTS `vw_entregas`;
/*!50001 DROP VIEW IF EXISTS `vw_entregas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_entregas` AS SELECT 
 1 AS `id_entrega`,
 1 AS `id_pedido`,
 1 AS `nome_cliente`,
 1 AS `status_entrega`,
 1 AS `tipo_entrega`,
 1 AS `valor_distancia`,
 1 AS `valor_peso`,
 1 AS `valor_base`,
 1 AS `acrescimo`,
 1 AS `desconto`,
 1 AS `taxa_extra`,
 1 AS `valor_final`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_entregas`
--

/*!50001 DROP VIEW IF EXISTS `vw_entregas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_entregas` AS select `e`.`id_entrega` AS `id_entrega`,`p`.`id_pedido` AS `id_pedido`,`c`.`nome_cliente` AS `nome_cliente`,`se`.`status_entrega` AS `status_entrega`,`te`.`tipo_entrega` AS `tipo_entrega`,`e`.`valor_distancia` AS `valor_distancia`,`e`.`valor_peso` AS `valor_peso`,`e`.`valor_base` AS `valor_base`,`e`.`acrescimo` AS `acrescimo`,`e`.`desconto` AS `desconto`,`e`.`taxa_extra` AS `taxa_extra`,`e`.`valor_final` AS `valor_final` from ((((`entregas` `e` join `pedidos` `p` on((`e`.`fk_id_pedido` = `p`.`id_pedido`))) join `clientes` `c` on((`c`.`id_cliente` = `p`.`fk_id_cliente`))) join `status_entregas` `se` on((`se`.`id_status_entrega` = `e`.`fk_id_status_entrega`))) join `tipo_entregas` `te` on((`te`.`id_tipo_entrega` = `p`.`fk_id_tipo_entrega`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-11  8:29:07
