const { pool } = require("../config/db");

const clienteModel = {
  /**
   * Retorna todos os clientes cadastrados na tabela clientes.
   * @async
   * @function selectAll
   * @returns {Promise<Array<Object>>} Array com todos os clientes encontrados.
   * @example
   * const clientes = await clienteModel.selectAll();
   * console.log(clientes);
   * // Saida esperada
   * {
   *      {coluna1:"valorColuna1", coluna2:"valorColuna2", ...},
   *      {coluna1:"valorColuna1", coluna2:"valorColuna2", ...}
   * }
   */
  selectAll: async () => {
    const sql = "SELECT * FROM clientes";
    const [rows] = await pool.query(sql);
    return rows;
  },

  /**
   * Seleciona um cliente específico pelo ID.
   * @async
   * @function selectById
   * @param {number} idCliente - ID único do cliente.
   * @returns {Promise<Array<Object>>} Array contendo o cliente encontrado (vazio se não existir).
   */
  selectById: async (idCliente) => {
    const sql = "SELECT * FROM clientes WHERE id_cliente = ?";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Seleciona um cliente pelo número do CPF.
   * @async
   * @function selectByCPF
   * @param {string} cpf - CPF do cliente (apenas números).
   * @returns {Promise<Array<Object>>} Array contendo o cliente encontrado.
   */
  selectByCPF: async (cpf) => {
    const sql = "SELECT * FROM clientes WHERE cpf_cliente = ?";
    const values = [cpf];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Seleciona um cliente pelo endereço de e-mail.
   * @async
   * @function selectByEmail
   * @param {string} email - E-mail do cliente.
   * @returns {Promise<Array<Object>>} Array contendo o cliente encontrado.
   */
  selectByEmail: async (email) => {
    const sql = "SELECT * FROM clientes WHERE email_cliente = ?";
    const values = [email];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
  
  /**
   * Verifica se já existe algum cliente com o CPF informado.
   * Útil para validação antes de cadastros.
   * @async
   * @function verificaCpf
   * @param {string} cpf - CPF a ser verificado.
   * @returns {Promise<Array<Object>>} Array com o cliente caso exista (length > 0).
   */
  verificaCpf: async (cpf) => {
    const sql = "SELECT * FROM clientes WHERE cpf_cliente = ?";
    const values = [cpf];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Verifica se já existe algum cliente com o e-mail informado.
   * @async
   * @function verificaEmail
   * @param {string} email - E-mail a ser verificado.
   * @returns {Promise<Array<Object>>} Array com o cliente caso exista.
   */
  verificaEmail: async (email) => {
    const sql = "SELECT * FROM clientes WHERE email_cliente = ?";
    const values = [email];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Retorna o maior ID de cliente existente na tabela.
   * Útil para identificar o ID do último cliente cadastrado manualmente, se necessário.
   * @async
   * @function selectUltimoId
   * @returns {Promise<Array<Object>>} Array contendo um objeto com a propriedade { idCliente }.
   */
  selectUltimoId: async () => {
    const sql = "SELECT MAX(id_cliente) AS idCliente FROM clientes";
    const [rows] = await pool.query(sql);
    return rows;
  },

  /**
   /**
   * Insere um novo cliente na base de dados chamando a procedure 'cadastrar_novo_cliente'.
   * @async
   * @function insertCliente
   * @param {string} nome - Nome completo do cliente.
   * @param {string} cpf - CPF do cliente (apenas números).
   * @param {string} email - E-mail do cliente.
   * @param {string} dataNasc - Data de nascimento (formato YYYY-MM-DD).
   * @returns {Promise<Object>} Objeto ResultSetHeader (contém insertId, affectedRows, etc).
   * @example
   * const message = await clienteModel.insert(paramA, paramB, paramC, paramD);
   * console.log(resultadoInsert)
   * {
      ResultSetHeader {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
      }
    }
   */
  insertCliente: async (nome, cpf, email, dataNasc) => {
    const procedure = "CALL cadastrar_novo_cliente(?,?,?,?)";
    const values = [nome, cpf, email, dataNasc];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Insere um telefone para um cliente via procedure.
   * @async
   * @function insertTelefone
   * @param {number} idCliente - ID do cliente dono do telefone.
   * @param {string} telefone - Número do telefone (ex: '11999999999').
   * @returns {Promise<Object>} Objeto ResultSetHeader com o resultado da inserção.
   * @example
   * const message = await clienteModel.insert(paramA, paramB, paramC, paramD);
   * console.log(resultadoTelefone)
   * {
      ResultSetHeader {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
      }
    }
   */
  insertTelefone: async (idCliente, telefone) => {
    const procedure = "CALL cadastrar_telefone(?,?)";
    const values = [idCliente, telefone];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Insere um endereço principal para um cliente via procedure.
   * @async
   * @function insertEndereco
   * @param {string} estado - Sigla do estado (UF).
   * @param {string} cidade - Nome da cidade.
   * @param {string} bairro - Nome do bairro.
   * @param {string} logradouro - Nome da rua/avenida.
   * @param {string} numero - Número da residência.
   * @param {string} cep - CEP (apenas números).
   * @param {number} idCliente - ID do cliente.
   * @returns {Promise<Object>} Objeto ResultSetHeader com o resultado da inserção.
   * @example
   * const message = await clienteModel.insert(paramA, paramB, paramC, paramD);
   * console.log(resultadoInsert)
   * {
      ResultSetHeader {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
      }
    }
   */
  insertEndereco: async (estado, cidade, bairro, logradouro, numero, cep, idCliente) => {
    const procedure = "CALL cadastrar_endereco(?,?,?,?,?,?,?)";
    const values = [estado, cidade, bairro, logradouro, numero, cep, idCliente];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Exclui um cliente e seus telefones/endereços via procedure.
   * @async
   * @function deleteCliente
   * @param {number} idCliente - ID do cliente.
   * @returns {Promise<Object>} Resultado da procedure.
   */
  deleteCliente: async (idCLiente) => {
    const procedure = "CALL excluir_cliente(?);";
    // essa procedure de excluir clientes já envolve a exclusão de telefones e endereços
    const values = [idCLiente];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Verifica se um cliente possui pedidos cadastrados.
   * Usado para impedir exclusão de clientes com histórico de compras.
   * @async
   * @function verificaPedido
   * @param {number} idCliente - ID do cliente.
   * @returns {Promise<Array<Object>>} Array com os pedidos encontrados.
   */
  verificaPedido: async (idCliente) => {
    const sql = "SELECT * FROM pedidos WHERE fk_id_cliente = ?";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Atualiza os dados pessoais de um cliente chamando a procedure 'atualizar_cliente'.
   * @async
   * @function atualizarCliente
   * @param {number} idCliente - ID do cliente a ser atualizado.
   * @param {string} novoNome - Novo nome (ou o atual se não mudou).
   * @param {string} novoCpf - Novo CPF.
   * @param {string} novoEmail - Novo E-mail.
   * @param {string} novaDataNasc - Nova data de nascimento.
   * @returns {Promise<Object>} Objeto ResultSetHeader com 'affectedRows'.
   */
  atualizarCliente: async(idCliente, novoNome, novoCpf, novoEmail, novaDataNasc) => {
    const procedure = `CALL atualizar_cliente(?, ?, ?, ?, ?)`;
    const values = [idCliente, novoNome, novoCpf, novoEmail, novaDataNasc];
    const rows = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Atualiza os dados de um endereço específico via procedure.
   * @async
   * @function atualizarEndereco
   * @param {number} idEndereco - ID do endereço a ser alterado.
   * @param {string} novoCep - Novo CEP.
   * @param {string} novoNumero - Novo número.
   * @param {string} novoEstado - Novo estado.
   * @param {string} novaCidade - Nova cidade.
   * @param {string} novoBairro - Novo bairro.
   * @param {string} novoLogradouro - Novo logradouro.
   * @returns {Promise<Object>} Objeto ResultSetHeader.
   */
  atualizarEndereco: async(idEndereco, novoCep, novoNumero, novoEstado, novaCidade, novoBairro, novoLogradouro) => {
    const procedure = `CALL atualizar_endereco(?, ?, ?, ?, ?, ?, ?)`;
    const values = [idEndereco, novoCep, novoNumero, novoEstado, novaCidade, novoBairro, novoLogradouro];
    const rows = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Verifica se determinado endereço já existe para um cliente específico.
   * Evita duplicidade de endereços idênticos para a mesma pessoa.
   * @async
   * @function verificaEndereco
   * @param {number} idCliente - ID do cliente.
   * @param {string} cep - CEP do endereço.
   * @param {string} numero - Número da residência.
   * @returns {Promise<Array<Object>>} Array com o endereço caso já exista.
   */
  verificaEndereco: async (idCliente, cep, numero) => {
    const sql = `SELECT * FROM enderecos WHERE fk_id_cliente = ? AND cep = ? AND numero = ?`;
    const values = [idCliente, cep, numero];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Retorna todos os endereços associados a um cliente específico.
   * @async
   * @function selectEnderecosByCliente
   * @param {number} idCliente - ID do cliente.
   * @returns {Promise<Array<Object>>} Array com os endereços encontrados.
   */
  selectEnderecoByCliente: async (idCliente) => {
    const sql = "SELECT * FROM enderecos WHERE fk_id_cliente = ?";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Atualiza o número de um telefone específico via procedure.
   * @async
   * @function atualizarTelefone
   * @param {number} idTelefone - ID do registro de telefone.
   * @param {string} telefone - Novo número de telefone.
   * @returns {Promise<Object>} Objeto ResultSetHeader.
   */
  atualizarTelefone: async (idTelefone, telefone) => {
    const procedure = `CALL atualizar_telefone(?, ?)`;
    const values =  [idTelefone, telefone];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Seleciona todos os telefones de um cliente específico.
   * @async
   * @function selectTelefoneByCliente
   * @param {number} idCliente - ID do cliente.
   * @returns {Promise<Array<Object>>} Array com os telefones encontrados.
   */
  selectTelefoneByCliente: async (idCliente) => {
    const sql = "SELECT * FROM telefones WHERE fk_id_cliente = ?";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Verifica se um número de telefone já está cadastrado na base (globalmente).
   * @async
   * @function verificaTelefone
   * @param {string} telefone Número de telefone a ser verificado.
   * @returns {Promise<Array<Object>>} Retorna array com resultado da busca (vazio = não existe).
   */
  verificaTelefone: async (telefone) => {
    const sql = "SELECT * FROM telefones WHERE telefone = ?";
    const values = [telefone];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Insere um endereço adicional para um cliente existente (mesma lógica de insertEndereco).
   * @async
   * @function insertEnderecoExtra
   * @param {string} estado - Sigla do estado.
   * @param {string} cidade - Nome da cidade.
   * @param {string} bairro - Nome do bairro.
   * @param {string} logradouro - Logradouro.
   * @param {number|string} numero - Número da residência.
   * @param {string} cep - CEP.
   * @param {number} idCliente - ID do cliente.
   * @returns {Promise<Object>} Objeto ResultSetHeader.
   */
  insertEnderecoExtra: async (estado, cidade, bairro, logradouro, numero, cep, idCliente) => {
    const procedure = "CALL cadastrar_endereco(?,?,?,?,?,?,?)";
    const values = [estado, cidade, bairro, logradouro, numero, cep, idCliente];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Remove um endereço específico da base de dados.
   * @async
   * @function deleteEndereco
   * @param {number} idEndereco - ID do endereço a remover.
   * @returns {Promise<Object>} Objeto ResultSetHeader.
   */
  deleteEndereco: async (idEndereco) => {
    const sql = `DELETE FROM enderecos WHERE id_endereco = ?`;
    const values = [idEndereco];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Retorna todos os endereços associados a um cliente específico.
   * @async
   * @function selectEnderecosByCliente
   * @param {number} idCliente - ID do cliente.
   * @returns {Promise<Array<Object>>} Array com os endereços encontrados.
   */
  selectEnderecosByCliente: async (idCliente) => {
    const sql = `SELECT * FROM enderecos WHERE fk_id_cliente = ?`;
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Insere um telefone adicional para o cliente.
   * @async
   * @function insertTelefoneExtra
   * @param {number} idCliente - ID do cliente.
   * @param {string} telefone - Número de telefone.
   * @returns {Promise<Object>} Objeto ResultSetHeader.
   */
  insertTelefoneExtra: async (idCliente, telefone) => {
    const procedure = "CALL cadastrar_telefone(?,?)";
    const values = [idCliente, telefone];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Verifica se um número de telefone já está cadastrado na base (globalmente).
   * @async
   * @function verificaTelefone
   * @param {string} telefone Número de telefone a ser verificado.
   * @returns {Promise<Array<Object>>} Retorna array com resultado da busca (vazio = não existe).
   */
  verificaTelefone: async (telefone) => {
    const sql = `SELECT * FROM telefones WHERE telefone = ?`;
    const values = [telefone];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Remove um telefone específico da base de dados.
   * @async
   * @function deleteTelefone
   * @param {number} idTelefone - ID do telefone a remover.
   * @returns {Promise<Object>} Objeto ResultSetHeader.
   */
  deleteTelefone: async (idTelefone) => {
    const sql = `DELETE FROM telefones WHERE id_telefone = ?`;
    const values = [idTelefone];
    const [rows] = await pool.query(sql, values);
    return rows;
  }

};

module.exports = { clienteModel };
