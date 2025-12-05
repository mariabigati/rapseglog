const express = require("express");
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

router.get("/", clienteController.selecionaTodos);
router.post("/incluir", clienteController.incluiCliente);
router.delete("/excluir/:idCliente", clienteController.excluiCliente);
router.put("/atualizarCli/:idCliente", clienteController.atualizarCliente);
router.put("/atualizarTel/:idCliente", clienteController.atualizarTelefone);
router.put("/atualizarEnd/:idCliente", clienteController.atualizarEndereco);

module.exports = router;
