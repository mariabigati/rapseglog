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
      let {
        nome,
        cpf,
        email,
        dataNasc,
        telefone,
        estado,
        cidade,
        bairro,
        logradouro,
        numero,
        cep,
      } = req.body;

      // validação de campos obrigatórios
      if (!nome || !cpf || !email || !dataNasc) {
        return res.status(400).json({
          message: "Nome, CPF, Email e Data de Nascimento são obrigatórios.",
        });
      }

      // validação das tipagens
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
        return res
          .status(400)
          .json({ message: "Data de nascimento inválida." });
      }

      // nas seguintes validações, caso procure o cpf ou email já exista vai retornar a row dele, ou seja >1 é pq já existe!
      // validacao para CPF único
      const existeCPF = await clienteModel.verificaCpf(cpf);
      if (existeCPF.length > 0) {
        return res
          .status(409)
          .json({ message: "Este CPF já está cadastrado." });
      }
      // validacao para EMAIL único
      const existeEMAIL = await clienteModel.verificaEmail(email);
      if (existeEMAIL.length > 0) {
        return res
          .status(409)
          .json({ message: "Este E-mail já está cadastrado." });
      }

      if (cep) {
        try {
          const dadosCep = await (
            await fetch(`https://viacep.com.br/ws/${cep}/json/`)
          ).json();

          if (dadosCep.erro) {
            return res.status(400).json({ message: "CEP inválido!" });
          }

          // preencher endereço automaticamente!
          estado = dadosCep.uf;
          cidade = dadosCep.localidade;
          bairro = dadosCep.bairro;
          logradouro = dadosCep.logradouro;
        } catch (err) {
          console.error("Erro ViaCEP:", err);
          return res.status(502).json({
            message: "Erro ao consultar o ViaCEP.",
            detalhe: err.message,
          });
        }
      }

      // conexão com a procedure de inserir clientes
      await clienteModel.insertCliente(nome, cpf, email, dataNasc);

      // cria uma constante para puxar e salvar o id do cliente que está sendo inserido
      // assim consigomos salvar como fk em endereços e telefones
      const ultimo = await clienteModel.selectUltimoId();
      const idCliente = ultimo[0].idCliente;

      // seleciona o cliente com o ID salvo
      const cliente = await clienteModel.selectById(idCliente);

      // validações que necessitam do id do cliente
      if (!cliente || cliente.length === 0) {
        return res
          .status(500)
          .json({ message: "Erro ao recuperar dados do cliente." });
      }
      if (cliente[0].idade < 18) {
        return res
          .status(400)
          .json({ message: "Cliente deve ter 18 anos ou mais." });
      }

      // insere o telefone do cliente com a procedure
      if (telefone) {
        await clienteModel.insertTelefone(idCliente, telefone);
      }

      // insere o endereco do cliente com procedure caso o numero e cep sejam válidos
      if (cep && numero) {
        await clienteModel.insertEndereco(
          estado,
          cidade,
          bairro,
          logradouro,
          numero,
          cep,
          idCliente
        );
      }

      // quando cadastrado com sucesso, o cliente vai retornar no insomnia o id do cliente e o endereço para visualização
      return res.status(201).json({
        message: "Cliente cadastrado com sucesso!",
        idCliente,
        endereco: {
          estado,
          cidade,
          bairro,
          logradouro,
          numero,
          cep,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erro no servidor",
        errorMessage: error.message,
      });
    }
  },

  excluiRegistro: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      if (!idCliente || !Number.isInteger(idCliente)) {
        return res.status(400).json({ message: "Forneça um id válido" });
      }

      const clienteSelecionado = await clienteModel.selectById(idCliente);
      if (clienteSelecionado.length === 0) {
        return res
          .status(200)
          .json({ message: "Cliente não localizado na base de dados" });
      }

      const existePedido = await clienteModel.verificaPedido(idCliente);
      if (existePedido.length > 0) {
        return res
          .status(409)
          .json({
            message: "Não é possível deletar um cliente que possui um pedido!",
          });
      }

      const deletarTelefone = await clienteModel.deleteCliente(idCliente);
      if (deletarTelefone.affectedRows === 0) {
        return res
          .status(200)
          .json({
            message: "Ocorreu um erro ao excluir o telefone do cliente",
          });
      }

      const deletarEndereco = await clienteModel.deleteEndereco(idCliente);
      if (deletarEndereco.affectedRows === 0) {
        return res
          .status(200)
          .json({
            message: "Ocorreu um erro ao excluir o endereço do cliente",
          });
      }

      if (deletarEndereco.affectedRows >= 1 || deletarTelefone.affectedRows >= 1) {
        const resultadoDelete = await clienteModel.deleteCliente(idCliente);
        if (resultadoDelete.affectedRows === 0) {
          return res
            .status(200)
            .json({ message: "Ocorreu um erro ao excluir o cliente" });
        }
      }
      res.status(200).json({ message: "Cliente excluido com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
};

module.exports = { clienteController };
