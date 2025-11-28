const { clienteModel } = require("../models/clienteModel");

const clienteController = {

  selecionaTodos: async (req, res) => {
    try {
      const { idCliente } = req.query;

      if (idCliente) {
        const cliente = await clienteModel.selectById(idCliente);
        return res.status(200).json({ data: cliente });
      }

      const resultado = await clienteModel.selectAll();
      return res.status(200).json({ data: resultado });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor" });
    }
  },

  incluiRegistro: async (req, res) => {
    try {
      const { 
        nome, cpf, email, dataNasc,
        telefone, estado, bairro, logradouro, numero, cep 
      } = req.body;

      if (!nome || !cpf || !email || !dataNasc) {
        return res.status(400).json({ 
          message: "Nome, CPF, Email e Data de Nascimento são obrigatórios."
        });
      }

      if (!isNaN(nome)) {
        return res.status(400).json({ message: "Nome inválido." });
      }

      if (isNaN(cpf)) {
        return res.status(400).json({ message: "CPF inválido." });
      }

      if (!email.includes("@")) {
        return res.status(400).json({ message: "Email inválido." });
      }

      if (isNaN(Date.parse(dataNasc))) {
        return res.status(400).json({ message: "Data de nascimento inválida." });
      }

      const existe = await clienteModel.verificaCpf(cpf);
      if (existe.length > 0) {
        return res.status(409).json({ message: "Este CPF já está cadastrado." });
      }

      await clienteModel.insertCliente(nome, cpf, email, dataNasc);

      const ultimo = await clienteModel.selectUltimoId();
      const idCliente = ultimo[0].idCliente;

      const cliente = await clienteModel.selectById(idCliente);

      if (!cliente || cliente.length === 0) {
        return res.status(500).json({ message: "Erro ao recuperar dados do cliente." });
      }

      if (cliente[0].idade < 18) {
        return res.status(400).json({ message: "Cliente deve ter 18 anos ou mais." });
      }

      if (telefone) {
        await clienteModel.insertTelefone(idCliente, telefone);
      }

      if (estado && bairro && logradouro && numero && cep) {
        await clienteModel.insertEndereco(estado, bairro, logradouro, numero, cep, idCliente);
      }

      return res.status(201).json({
        message: "Cliente cadastrado com sucesso!",
        idCliente,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "Erro no servidor",
        errorMessage: error.message 
      });
    }
  },
};

module.exports = { clienteController };
