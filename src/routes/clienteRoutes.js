const express = require("express");
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

router.get("/", clienteController.selecionaTodos);
router.post("/incluir", clienteController.incluiCliente);
router.delete("/excluir/:idCliente", clienteController.excluiCliente);
router.put("/excluir/:idCliente", clienteController.excluiCliente);

module.exports = router;
