const express = require('express');
const router = express.Router();
const { pedidoRoutes } = require('./pedidoRoutes');
const { entregaRoutes } = require('./entregaRoutes');

router.use('/', pedidoRoutes);
router.use('/', entregaRoutes);

module.exports = { router };