const express = require('express');
const entregaRoutes = express.Router();
const { entregaController } = require('../controllers/entregaController');

entregaRoutes.get('/entregas', entregaController.selecionarEntregas);
entregaRoutes.post('/entregas', entregaController.cadastraEntregas);
entregaRoutes.put('/entregas/:idEntrega', entregaController.atualizaEstadoEntrega);
module.exports = { entregaRoutes };