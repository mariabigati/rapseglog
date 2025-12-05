const express = require('express');
const pedidoRoutes = express.Router();
const { pedidoController } = require('../controllers/pedidoController');

pedidoRoutes.get('/pedidos', pedidoController.selecionarPedidos);
pedidoRoutes.post('/pedidos', pedidoController.cadastrarPedido);

module.exports = { pedidoRoutes };