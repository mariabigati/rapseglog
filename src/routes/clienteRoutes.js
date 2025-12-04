const express = require("express");
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

router.get("/", clienteController.selecionaTodos);
router.post("/incluir", clienteController.incluiCliente);
router.delete("/excluir/:idCliente", clienteController.excluiCliente);
router.put("/atualizar/:idCliente", clienteController.atualizarCliente);

module.exports = router;
