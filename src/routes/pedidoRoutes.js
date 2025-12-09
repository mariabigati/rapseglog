const express = require('express');
const pedidoRoutes = express.Router();
const { pedidoController } = require('../controllers/pedidoController');

pedidoRoutes.get('/pedidos', pedidoController.selecionarPedidos);
pedidoRoutes.post('/pedidos', pedidoController.cadastrarPedido);
pedidoRoutes.put('/pedidos/:idPedido', pedidoController.alteraPedido);
pedidoRoutes.delete('/pedidos/:idPedido', pedidoController.deletarPedido);

module.exports = { pedidoRoutes };