const { clienteModel } = require("../models/clienteModel");

const clienteController = {
  /**
   * Retorna os clientes cadastrados (todos ou filtrados).
   * Rota GET /clientes
   * Aceita query params: ?idCliente, ?cpf, ?email
   * @async
   * @function selecionaTodos
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Object>} JSON com o resultado da consulta
   */
  //selecionaTodos funciona para selecionar todos os clientes por parametro ou cliente unico por ID com query 
  selecionaTodos: async (req, res) => {
    try {
      const { idCliente } = req.query; // faz com que seja possível procurar cliente por ID na query
      const { cpf } = req.query;
      const { email } = req.query;

      let contador = 0;
      if (idCliente) {
        contador++;
      }
      if (cpf) {
        contador++;
      }
      if (email) {
        contador++;
      }

      // validação para caso o usuário deseje usar mais de uma query como parametro
      if (contador > 1) {
        return res.status(400).json({
          message: "Use apenas UM parâmetro por vez (idCliente, cpf ou email), por favor."
        });
      }

      if (idCliente) { // caso tenha o ID na query, usa função de selecionar por ID
        const cliente = await clienteModel.selectById(idCliente);
        if (!cliente || cliente.length === 0) {
          return res.status(404).json({ message: "Cliente não encontrado pelo ID informado." });
        } 
        return res.status(200).json({ data: cliente });
      }

      if ( cpf ) { // caso tenha o CPF na query, usa função de selecionar por CPF
        const cliente = await clienteModel.selectByCPF(cpf);
        if (!cliente || cliente.length === 0) {
          return res.status(404).json({ message: "Cliente não encontrado pelo CPF informado." });
        }
        return res.status(200).json({ data: cliente });
      }

      if ( email ) { // caso tenha o EMAIL na query, usa função de selecionar por EMAIL
        const cliente = await clienteModel.selectByEmail(email);
        if (!cliente || cliente.length === 0) {
          return res.status(404).json({ message: "Cliente não encontrado pelo Email informado." });
        }
        return res.status(200).json({ data: cliente });
      }

      // caso não tenha nada pela query, usa função de selecionar todos
      const resultado = await clienteModel.selectAll();
      if (resultado.length === 0) {
        return res.status(200).json({ message: "A consulta não retornou resultados" });
      }
      return res.status(200).json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor" });
    }
  },

  /**
   * Função auxiliar que verifica se a data de nascimento indica maioridade (>= 18 anos).
   * @async
   * @function calculaMaioridade
   * @param {string|Date} dataNasc A data de nascimento do cliente
   * @returns {Promise<boolean>} Retorna true se for maior de 18, false caso contrário ou erro
   */
  calculaMaioridade: async (dataNasc) => {
    const hoje = new Date();
    const nascimento = new Date(dataNasc);

    if (isNaN(nascimento)) {
      return false;
    }

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade >= 18;
  },

  /**
   * Cadastra um novo cliente, incluindo validações de CPF, e-mail e inserção de endereço/telefone.
   * Rota POST /clientes/incluir
   * @async
   * @function incluiCliente
   * @param {Request} req Objeto da requisição HTTP (Body: nome, cpf, email, dataNasc, telefone, numero, cep)
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Object>} JSON com confirmação do cadastro e dados criados
   */
  incluiCliente: async (req, res) => {
    try {
      let {nome, cpf, email, dataNasc,telefone, numero, cep} = req.body;

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
      if (isNaN(cpf) || cpf.length !== 11) {
        return res.status(400).json({ message: "CPF inválido. Digite apenas os números, sem símbolos ou espaços!" });
      }
      if (!email.includes("@")) {
        return res.status(400).json({ message: "Email inválido." });
      }
      if (isNaN(cep) || cep.length !== 8) {
        return res.status(400).json({ message: "CEP inválido. Digite apenas os números, sem símbolos ou espaços!" });
      }
      if (isNaN(telefone || telefone.length !==11)) {
        return res.status(400).json({ message: "Número de telefone inválido. Digite apenas os números sem símbolos ou espaços!" });
      }
      if (isNaN(numero)) {
        return res.status(400).json({ message: "Número da residência inválido. Digite apenas números!" });
      }
      if (isNaN(Date.parse(dataNasc))) {
        return res.status(400).json({ message: "Data de nascimento inválida." });
      }
      // valida se é maior de idade
      if (!(await clienteController.calculaMaioridade(dataNasc))) {
        return res.status(400).json({ message: "Cliente deve ter 18 anos ou mais." });
      }

      // nas seguintes validações, caso procure o cpf ou email já exista vai retornar a row dele, ou seja > 1 é pq já existe!
      // validacao para CPF único
      const existeCPF = await clienteModel.verificaCpf(cpf);
      if (existeCPF.length > 0) {
        return res.status(409).json({ message: "Este CPF já está cadastrado." });
      }
      // Telefone não duplicado
      const existe = await clienteModel.verificaTelefone(telefone);
      if (existe.length > 0) {
        return res.status(409).json({ message: "Este telefone já está cadastrado." });
      }
      // validacao para EMAIL único
      const existeEMAIL = await clienteModel.verificaEmail(email);
      if (existeEMAIL.length > 0) {
        return res.status(409).json({ message: "Este E-mail já está cadastrado." });
      }

      if (cep) {
        try {
          const dadosCep = await (
            await fetch(`https://viacep.com.br/ws/${cep}/json/`)).json();

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
          return res.status(502).json({message: "Erro ao consultar o ViaCEP.", detalhe: err.message});
        }
      }

      // conexão com a procedure de inserir clientes
      const resultadoInsert = await clienteModel.insertCliente(nome, cpf, email, dataNasc);

      // cria uma constante para puxar e salvar o id do cliente que está sendo inserido
      // assim conseguimos salvar como fk em endereços e telefones
      const ultimo = await clienteModel.selectUltimoId();
      const idCliente = ultimo[0].idCliente;

      // seleciona o cliente com o ID salvo
      const cliente = await clienteModel.selectById(idCliente);

      // validações que necessitam do id do cliente
      if (!cliente || cliente.length === 0) {
        return res.status(500).json({ message: "Erro ao recuperar dados do cliente." });
      }
      if (cliente[0].idade < 18) {
        return res.status(400).json({ message: "Cliente deve ter 18 anos ou mais." });
      }

      // insere o telefone do cliente com a procedure
      if (telefone) {
        const resultadoTelefone = await clienteModel.insertTelefone(idCliente, telefone);
        console.log(resultadoTelefone);
      }

      // insere o endereco do cliente com procedure caso o numero e cep sejam válidos
      if (cep && numero) {
        const resultadoEndereco = await clienteModel.insertEndereco(estado, cidade, bairro, logradouro, numero, cep, idCliente);
        console.log(resultadoEndereco);
      }

      console.log(resultadoInsert);
      // quando cadastrado com sucesso, o cliente vai retornar no insomnia o id do cliente e o endereço para visualização
      return res.status(201).json({
        message: "Cliente cadastrado com sucesso!",
        idCliente,
        telefone,
        endereco: {estado, cidade, bairro, logradouro, numero, cep}
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Erro no servidor", errorMessage: error.message,});
    }
  },

  /**
   * Remove um cliente do banco de dados pelo ID, verificando antes se possui pedidos.
   * Rota DELETE /clientes/excluir/:idCliente
   * @async
   * @function excluiCliente
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Object>} JSON com mensagem de sucesso ou erro
   */
  excluiCliente: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);

      // validação de id válido
      if (!idCliente || !Number.isInteger(idCliente)) {
        return res.status(400).json({ message: "Forneça um id válido" });
      }

      // validação de cliente existente via id
      const clienteSelecionado = await clienteModel.selectById(idCliente);
      if (clienteSelecionado.length === 0) {
        return res.status(200).json({ message: "Cliente não localizado na base de dados" });
      }

      // validação para não permitir exclusão caso o cliente esteja atrelado a um pedido
      const existePedido = await clienteModel.verificaPedido(idCliente);
      if (existePedido.length > 0) {
        return res.status(409).json({message: "Não é possível deletar um cliente que possui um pedido!"});
      }

      // confirmação de exclusão
      const resultadoDelete = await clienteModel.deleteCliente(idCliente);
      res.status(200).json({ message: "Cliente excluido com sucesso" });
       if (resultadoDelete.affectedRows === 0) {
          return res.status(200).json({ message: "Ocorreu um erro ao excluir o cliente" });
        }
    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Ocorreu um erro no servidor", errorMessage: error.message});
    }
  },

  /**
   * Atualiza os dados pessoais (nome, CPF, email, dataNasc) de um cliente existente.
   * Rota PUT /clientes/atualizarCli/:idCliente
   * @async
   * @function atualizarCliente
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Object>} JSON com as alterações realizadas
   */
  atualizarCliente: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      const { nome, cpf, email, dataNasc } = req.body;

      // validação do id
      if (!idCliente || isNaN(idCliente)) {
        return res.status(400).json({ message: "ID inválido." });
      }

      // busca cliente atual
      const clienteAtual = await clienteModel.selectById(idCliente);
      if (clienteAtual.length === 0) {
        return res.status(404).json({ message: "Cliente não encontrado." });
      }

      const atual = clienteAtual[0];

      // nome inválido
      if (nome && !isNaN(nome)) {
        return res.status(400).json({ message: "Nome inválido." });
      }

      // email inválido
      if (email && !email.includes("@")) {
        return res.status(400).json({ message: "Email inválido." });
      }

      // cpf inválido
      if (cpf && isNaN(cpf)) {
        return res.status(400).json({ message: "CPF inválido." });
      }

      // data nasc inválida
      if (dataNasc && isNaN(Date.parse(dataNasc))) {
        return res.status(400).json({ message: "Data de nascimento inválida." });
      }

      // valida se é maior de idade
      if (!(await clienteController.calculaMaioridade(dataNasc))) {
        return res.status(400).json({ message: "Cliente deve ter 18 anos ou mais." });
      }
      
      let novoNome = atual.nome_cliente;
      let novoCpf = atual.cpf_cliente;
      let novoEmail = atual.email_cliente;
      let novaDataNasc = atual.data_nasc;

      let alteracoes = [];

      // nome mudou
      if (nome && nome !== atual.nome_cliente) {
        novoNome = nome;
        alteracoes.push("nome");
      }

      // cpf mudou
      if (cpf && cpf !== atual.cpf_cliente) {
        const existeCPF = await clienteModel.verificaCpf(cpf);

        // impedir colisão com outro cliente
        if (existeCPF.length > 0 && existeCPF[0].id_cliente !== idCliente) {
          return res.status(409).json({ message: "Este CPF já está cadastrado em outro cliente." });
        }

        novoCpf = cpf;
        alteracoes.push("cpf");
      }

      // email mudou
      if (email && email !== atual.email_cliente) {
        const existeEmail = await clienteModel.verificaEmail(email);

        if (existeEmail.length > 0 && existeEmail[0].id_cliente !== idCliente) {
          return res.status(409).json({ message: "Este Email já está cadastrado em outro cliente." });
        }

        novoEmail = email;
        alteracoes.push("email");
      }

      // data nasc mudou
      if (dataNasc && dataNasc !== atual.data_nasc) {
        novaDataNasc = dataNasc;
        alteracoes.push("data_nasc");
      }

      // se não mudou nada
      if (alteracoes.length === 0) {
        return res.status(200).json({
          message: "Nenhum dado diferente para atualização."
        });
      }

      await clienteModel.atualizarCliente(idCliente, novoNome, novoCpf, novoEmail, novaDataNasc);

      return res.status(200).json({
        message: "Dados atualizados com sucesso!",
        alterado: alteracoes
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro no servidor", errorMessage: error.message });
    }
  },

  /**
   * Atualiza os dados de endereço de um cliente (CEP, Número), consultando o ViaCEP se necessário.
   * Rota PUT /clientes/atualizarEnd/:idCliente/:idEndereco
   * @async
   * @function atualizarEndereco
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Object>} JSON confirmando a atualização do endereço
   */
  atualizarEndereco: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      const { cep, numero } = req.body;

      // validar id
      if (!idCliente || isNaN(idCliente)) {
        return res.status(400).json({ message: "ID inválido." });
      }

      // buscar endereço atual
      const enderecoAtual = await clienteModel.selectEnderecoByCliente(idCliente);
      if (enderecoAtual.length === 0) {
        return res.status(404).json({ message: "Endereço não encontrado para este cliente." });
      }

      const atual = enderecoAtual[0]; // atalho

      // validação cep
      if (cep && isNaN(cep)) {
        return res.status(400).json({ message: "CEP inválido." });
      }

      // validação numero da residencia
      if (numero && isNaN(numero)) {
        return res.status(400).json({ message: "Número inválido." });
      }

      // variáveis finais
      let novoCep = atual.cep;
      let novoNumero = atual.numero;
      let novoEstado = atual.estado;
      let novaCidade = atual.cidade;
      let novoBairro = atual.bairro;
      let novoLogradouro = atual.logradouro;

      // se mandar cep novo consulta ViaCEP 
      if (cep) {
        try {
          const dadosCep = await (await fetch(`https://viacep.com.br/ws/${cep}/json/`)).json();
          if (dadosCep.erro) {
            return res.status(400).json({ message: "CEP inválido!" });
          }

          // preenchendo novo endereço
          novoCep = cep;
          novoEstado = dadosCep.uf;
          novaCidade = dadosCep.localidade;
          novoBairro = dadosCep.bairro;
          novoLogradouro = dadosCep.logradouro;

        } catch (err) {
          return res.status(502).json({ message: "Erro ao consultar o ViaCEP." });
        }
      }

      // se mudou número
      if (numero) {
        novoNumero = numero;
      }

      // detectar oq mudou
      let alteracoes = [];

      if (novoCep !== atual.cep) alteracoes.push("cep");
      if (novoNumero !== atual.numero) alteracoes.push("numero");
      if (novoEstado !== atual.estado) alteracoes.push("estado");
      if (novaCidade !== atual.cidade) alteracoes.push("cidade");
      if (novoBairro !== atual.bairro) alteracoes.push("bairro");
      if (novoLogradouro !== atual.logradouro) alteracoes.push("logradouro");

      // se nada mudou 
      if (alteracoes.length === 0) {
        return res.status(200).json({ message: "Nenhum dado diferente para atualização." });
      }

      // updtate
      await clienteModel.atualizarEndereco(enderecoAtual[0].id_endereco, novoCep, novoNumero, novoEstado, novaCidade, novoBairro, novoLogradouro);

      return res.status(200).json({
        message: "Endereço atualizado com sucesso!",
        alterado: alteracoes
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor", errorMessage: error.message });
    }
  },

  /**
   * Atualiza o número de telefone principal de um cliente.
   * Rota PUT /clientes/atualizarTel/:idCliente/:idTelefone
   * @async
   * @function atualizarTelefone
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Object>} JSON confirmando a atualização do telefone
   */
  atualizarTelefone: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      const { telefone } = req.body;

      // validar id
      if (!idCliente || isNaN(idCliente)) {
        return res.status(400).json({ message: "ID inválido." });
      }

      // buscar telefone atual
      const telAtual = await clienteModel.selectTelefoneByCliente(idCliente);
      if (telAtual.length === 0) {
        return res.status(404).json({ message: "Telefone não encontrado para este cliente." });
      }

      const atual = telAtual[0]; // atalho

      // validação do telefone
      if (!telefone || isNaN(telefone) || telefone.length !== 11) {
        return res.status(400).json({
          message: "Telefone inválido. Digite 11 números sem espaços ou símbolos."
        });
      }

      // verificação se telefone é o mesmo que já era do cliente 
      if (telefone === atual.telefone) {
        return res.status(200).json({
          message: "Nenhum dado diferente para atualização."
        });
      }

      // verificação se telefone já existe para OUTRO cliente
      const telefoneExistente = await clienteModel.verificaTelefone(telefone);

      if (
        telefoneExistente.length > 0 &&
        telefoneExistente[0].fk_id_cliente !== idCliente
      ) {
        return res.status(409).json({
          message: "Este número de telefone já está cadastrado por outro cliente."
        });
      }

      // update
      await clienteModel.atualizarTelefone(telAtual[0].id_telefone, telefone);

      return res.status(200).json({ message: "Telefone atualizado com sucesso!", alterado: ["telefone"] });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor", errorMessage: error.message });
    }
  },

  /**
   * Adiciona um novo endereço para um cliente já existente.
   * Rota POST /clientes/incluirEndExtra/:idCliente
   * @async
   * @function cadastrarEnderecoExtra
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Object>} JSON com confirmação do cadastro do novo endereço
   */
  cadastrarEnderecoExtra: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      const { cep, numero } = req.body;

      if (!idCliente || isNaN(idCliente))
        return res.status(400).json({ message: "ID inválido." });

      if (!cep || isNaN(cep) || cep.length !== 8)
        return res.status(400).json({ message: "CEP inválido." });

      if (!numero || isNaN(numero))
        return res.status(400).json({ message: "Número inválido." });

      // busca cliente
      const cliente = await clienteModel.selectById(idCliente);
      if (cliente.length === 0)
        return res.status(404).json({ message: "Cliente não encontrado." });

      // verifica duplicado
      const enderecoExistente = await clienteModel.verificaEndereco(idCliente, cep, numero);

      if (enderecoExistente.length > 0) {
        return res.status(400).json({
          message: "Este endereço já está cadastrado para este cliente."
        });
      }

      // consulta CEP
      let estado, cidade, bairro, logradouro;
      try {
        const dados = await (await fetch(`https://viacep.com.br/ws/${cep}/json/`)).json();
        if (dados.erro) return res.status(400).json({ message: "CEP não encontrado." });

        estado = dados.uf;
        cidade = dados.localidade;
        bairro = dados.bairro;
        logradouro = dados.logradouro;
      } catch (err) {
        return res.status(502).json({ message: "Erro ao consultar ViaCEP." });
      }

      // insert
      await clienteModel.insertEnderecoExtra(estado, cidade, bairro, logradouro, numero, cep, idCliente);

      return res.status(201).json({
        message: "Endereço adicional cadastrado com sucesso!"
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro no servidor", errorMessage: error.message });
    }
  },

  /**
   * Remove um endereço específico de um cliente, impedindo a exclusão se for o único endereço.
   * Rota DELETE /clientes/excluirEnd/:idCliente/:idEndereco
   * @async
   * @function deletarEndereco
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Object>} JSON com mensagem de sucesso
   */
  deletarEndereco: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      const idEndereco = Number(req.params.idEndereco);

      if (!idCliente || isNaN(idCliente))
        return res.status(400).json({ message: "ID do cliente inválido." });

      if (!idEndereco || isNaN(idEndereco))
        return res.status(400).json({ message: "ID do endereço inválido." });

      const enderecos = await clienteModel.selectEnderecosByCliente(idCliente);

      if (enderecos.length === 0)
        return res.status(404).json({ message: "Nenhum endereço encontrado." });

      // valida se o cliente não vai ficar com zero endereços, caso deletado
      if (enderecos.length === 1)
        return res.status(400).json({ message: "O cliente deve ter pelo menos 1 endereço. Não é possível deletar." });

      // verifica se o endereço pertence ao cliente
      const existe = enderecos.find(e => e.id_endereco === idEndereco);
      if (!existe)
        return res.status(403).json({ message: "Este endereço não pertence ao cliente." });

      await clienteModel.deleteEndereco(idEndereco);

      return res.status(200).json({ message: "Endereço removido com sucesso!" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro no servidor", errorMessage: error.message });
    }
  },

  /**
   * Adiciona um número de telefone extra para um cliente.
   * Rota POST /clientes/incluirTelExtra/:idCliente
   * @async
   * @function cadastrarTelefoneExtra
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Object>} JSON com confirmação do cadastro
   */
  cadastrarTelefoneExtra: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      const { telefone } = req.body;

      if (!idCliente || isNaN(idCliente))
        return res.status(400).json({ message: "ID inválido." });

      if (!telefone || isNaN(telefone) || telefone.length !== 11)
        return res.status(400).json({ message: "Telefone inválido, use 11 dígitos." });

      const cliente = await clienteModel.selectById(idCliente);
      if (cliente.length === 0)
        return res.status(404).json({ message: "Cliente não encontrado." });

      const existe = await clienteModel.verificaTelefone(telefone);
      if (existe.length > 0)
        return res.status(409).json({ message: "Este telefone já está cadastrado." });

      await clienteModel.insertTelefoneExtra(idCliente, telefone);

      return res.status(201).json({
        message: "Telefone adicional cadastrado com sucesso!"
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro no servidor", errorMessage: error.message });
    }
  },

  /**
   * Remove um telefone específico de um cliente, impedindo a exclusão se for o único telefone.
   * Rota DELETE /clientes/excluirTel/:idCliente/:idTelefone
   * @async
   * @function deletarTelefone
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Object>} JSON com mensagem de sucesso
   */
  deletarTelefone: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      const idTelefone = Number(req.params.idTelefone);

      if (!idCliente || isNaN(idCliente))
        return res.status(400).json({ message: "ID do cliente inválido." });

      if (!idTelefone || isNaN(idTelefone))
        return res.status(400).json({ message: "ID do telefone inválido." });

      const telefones = await clienteModel.selectTelefoneByCliente(idCliente);

      if (telefones.length === 0)
        return res.status(404).json({ message: "Nenhum telefone encontrado." });

      if (telefones.length === 1)
        return res.status(400).json({ message: "O cliente deve ter pelo menos 1 telefone. Não é possível deletar." });

      const existe = telefones.find(t => t.id_telefone === idTelefone);
      if (!existe)
        return res.status(403).json({ message: "Este telefone não pertence ao cliente." });

      await clienteModel.deleteTelefone(idTelefone);

      return res.status(200).json({ message: "Telefone removido com sucesso!" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro no servidor", errorMessage: error.message });
    }
  },
};

module.exports = { clienteController };
