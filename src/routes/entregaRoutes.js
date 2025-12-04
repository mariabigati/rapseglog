const express = require('express');
const entregaRoutes = express.Router();
const { entregaController } = require('../controllers/entregaController');

entregaRoutes.get('/entregas', entregaController.selecionarTodasEntregas);
entregaRoutes.post('/entregas', entregaController.cadastraEntregas);
entregaRoutes.put('/entregas', entregaController.atualizaEstadoEntrega);
module.exports = { entregaRoutes };