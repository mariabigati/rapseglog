const express = require("express");
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

router.get("/", clienteController.selecionaTodos);
router.post("/incluir", clienteController.incluiRegistro);
router.post("/", clienteController.excluiRegistro);

module.exports = router;
