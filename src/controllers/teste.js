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
        nome,
        cpf,
        email,
        telefone,
        estado,
        bairro,
        logradouro,
        numero,
        cep
      } = req.body;

      if (!nome || !cpf || !email) {
        return res.status(400).json({ message: "Nome, CPF e Email são obrigatórios." });
      }

      const existe = await clienteModel.verificaCpf(cpf);
      if (existe.length > 0) {
        return res.status(409).json({ message: "Este CPF já está cadastrado." });
      }

      const resultCliente = await clienteModel.insertCliente(nome, cpf, email);

      const idCliente = resultCliente[0].insertId;

      if (telefone) {
        await clienteModel.insertTelefone(idCliente, telefone);
      }

      if (estado && bairro && logradouro && numero && cep) {
        await clienteModel.insertEndereco(
          estado,
          bairro,
          logradouro,
          numero,
          cep,
          idCliente
        );
      }

      return res.status(201).json({
        message: "Cliente cadastrado com sucesso!",
        idCliente
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erro no servidor",
        errorMessage: error.message
      });
    }
  }
};

module.exports = { clienteController };
