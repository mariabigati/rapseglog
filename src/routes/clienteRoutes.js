const express = require("express");
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

router.get("/", clienteController.selecionaTodos);
router.post("/incluir", clienteController.incluiCliente);
router.delete("/excluir/:idCliente", clienteController.excluiCliente);
router.put("/atualizarCli/:idCliente", clienteController.atualizarCliente);
router.put("/atualizarTel/:idCliente/:idTelefone", clienteController.atualizarTelefone);
router.put("/atualizarEnd/:idCliente/:idEndereco", clienteController.atualizarEndereco);
router.post("/incluirEndExtra/:idCliente", clienteController.cadastrarEnderecoExtra);
router.delete("/excluirEnd/:idCliente/:idEndereco", clienteController.deletarEndereco);
router.post("/incluirTelExtra/:idCliente", clienteController.cadastrarTelefoneExtra);
router.delete("/excluirTel/:idCliente/:idTelefone", clienteController.deletarTelefone);

module.exports = router;
