const express = require('express');
const router = express.Router();
const { pedidoRoutes } = require('./pedidoRoutes');
const { entregaRoutes } = require('./entregaRoutes');

router.use('/', pedidoRoutes);
router.use('/', entregaRoutes);

const clienteRoutes = require("./clienteRoutes");

router.use("/clientes", clienteRoutes);

module.exports = router; 
