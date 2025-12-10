const { pool } = require("../config/db");

const clienteModel = {
  /**
   * Retorna todos os clientes cadastrados na tabela clientes
   * @async
   * @function selectAll
   * @returns {Promise<Array<Object>>} Retorna um array de objetos, cada objeto representa um cliente
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
   * Seleciona um cliente pelo ID.
   * @async
   * @function selectById
   * @param {number} idCliente - ID do cliente.
   * @returns {Promise<Array<Object>>} Cliente encontrado (ou array vazio).
   */
  selectById: async (idCliente) => {
    const sql = "SELECT * FROM clientes WHERE id_cliente = ?";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Seleciona um cliente pelo CPF.
   * @async
   * @function selectByCPF
   * @param {string} cpf - CPF do cliente.
   * @returns {Promise<Array<Object>>} Cliente encontrado (ou array vazio).
   */
  selectByCPF: async (cpf) => {
    const sql = "SELECT * FROM clientes WHERE cpf_cliente = ?";
    const values = [cpf];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Seleciona um cliente pelo email.
   * @async
   * @function selectByEmail
   * @param {string} email - E-mail do cliente.
   * @returns {Promise<Array<Object>>} Cliente encontrado (ou array vazio).
   */
  selectByEmail: async (email) => {
    const sql = "SELECT * FROM clientes WHERE email_cliente = ?";
    const values = [email];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
  
  /**
   * Verifica se já existe cliente com o CPF informado.
   * @async
   * @function verificaCpf
   * @param {string} cpf - CPF a verificar.
   * @returns {Promise<Array<Object>>} Resultado da busca.
   */
  verificaCpf: async (cpf) => {
    const sql = "SELECT * FROM clientes WHERE cpf_cliente = ?";
    const values = [cpf];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Verifica se já existe cliente com o e-mail informado.
   * @async
   * @function verificaEmail
   * @param {string} email - E-mail a verificar.
   * @returns {Promise<Array<Object>>} Resultado da busca.
   */
  verificaEmail: async (email) => {
    const sql = "SELECT * FROM clientes WHERE email_cliente = ?";
    const values = [email];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Retorna o maior ID de cliente existente.
   * @async
   * @function selectUltimoId
   * @returns {Promise<Array<Object>>} Objeto com { idCliente }.
   */
  selectUltimoId: async () => {
    const sql = "SELECT MAX(id_cliente) AS idCliente FROM clientes";
    const [rows] = await pool.query(sql);
    return rows;
  },

  /**
   * Insere um cliente na base de dados
   * @async
   * @function insertCliente
   * @param {string} nome Descrição do nome do cliente que deve ser inserido no banco de dados. Ex.: 'Ana'
   * @param {number} cpf Valor do cliente que deve ser inserido no banco de dados. Ex.: 48000000000
   * @param {string} email Descrição do email do cliente que deve ser inserido no banco de dados. Ex.: 'user@gmail.com'
   * @param {number} dataNasc Valor da data de nascimento do cliente que deve ser inserido no banco de dados. Ex.: '2000-01-01'
   * @returns {Promise<Object} Retorna um objeto contendo propriedades sobre o resultado da execução da query
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
   * Insere um telefone para um cliente.
   * @async
   * @function insertTelefone
   * @param {number} idCliente - ID do cliente.
   * @param {string} telefone - Telefone.
   * @returns {Promise<Object} Retorna um objeto contendo propriedades sobre o resultado da execução da query
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
   * Insere um endereço para um cliente.
   * @async
   * @function insertEndereco
   * @param {string} estado
   * @param {string} cidade
   * @param {string} bairro
   * @param {string} logradouro
   * @param {string} numero
   * @param {string} cep
   * @param {number} idCliente
   * @returns {Promise<Object>} Resultado da procedure.
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
   * @async
   * @function verificaPedido
   * @param {number} idCliente
   * @returns {Promise<Array<Object>>} Pedidos encontrados.
   */
  verificaPedido: async (idCliente) => {
    const sql = "SELECT * FROM pedidos WHERE fk_id_cliente = ?";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Atualiza dados básicos do cliente via procedure.
   * @async
   * @function atualizarCliente
   * @param {number} idCliente
   * @param {string} novoNome
   * @param {string} novoCpf
   * @param {string} novoEmail
   * @param {string} novaDataNasc
   * @returns {Promise<Object>} Resultado da procedure.
   */
  atualizarCliente: async(idCliente, novoNome, novoCpf, novoEmail, novaDataNasc) => {
    const procedure = `CALL atualizar_cliente(?, ?, ?, ?, ?)`;
    const values = [idCliente, novoNome, novoCpf, novoEmail, novaDataNasc];
    const rows = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Atualiza um endereço via procedure.
   * @async
   * @function atualizarEndereco
   * @param {number} idEndereco
   * @param {string} novoCep
   * @param {string} novoNumero
   * @param {string} novoEstado
   * @param {string} novaCidade
   * @param {string} novoBairro
   * @param {string} novoLogradouro
   * @returns {Promise<Object>} Resultado da procedure.
   */
  atualizarEndereco: async(idEndereco, novoCep, novoNumero, novoEstado, novaCidade, novoBairro, novoLogradouro) => {
    const procedure = `CALL atualizar_endereco(?, ?, ?, ?, ?, ?, ?)`;
    const values = [idEndereco, novoCep, novoNumero, novoEstado, novaCidade, novoBairro, novoLogradouro];
    const rows = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Verifica se determinado endereço já existe para o cliente.
   * @async
   * @function verificaEndereco
   * @param {number} idCliente
   * @param {string} cep
   * @param {string} numero
   * @returns {Promise<Array<Object>>}
   */
  verificaEndereco: async (idCliente, cep, numero) => {
    const sql = `SELECT * FROM enderecos WHERE fk_id_cliente = ? AND cep = ? AND numero = ?`;
    const values = [idCliente, cep, numero];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Seleciona todos os endereços de um cliente.
   * @async
   * @function selectEnderecoByCliente
   * @param {number} idCliente
   * @returns {Promise<Array<Object>>}
   */
  selectEnderecoByCliente: async (idCliente) => {
    const sql = "SELECT * FROM enderecos WHERE fk_id_cliente = ?";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Atualiza um telefone via procedure.
   * @async
   * @function atualizarTelefone
   * @param {number} idTelefone
   * @param {string} telefone
   * @returns {Promise<Object>}
   */
  atualizarTelefone: async (idTelefone, telefone) => {
    const procedure = `CALL atualizar_telefone(?, ?)`;
    const values =  [idTelefone, telefone];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Seleciona todos os telefones de um cliente.
   * @async
   * @function selectTelefoneByCliente
   * @param {number} idCliente
   * @returns {Promise<Array<Object>>}
   */
  selectTelefoneByCliente: async (idCliente) => {
    const sql = "SELECT * FROM telefones WHERE fk_id_cliente = ?";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Verifica se um número de telefone já existe.
   * @async
   * @function verificaTelefone
   * @param {string} telefone
   * @returns {Promise<Array<Object>>}
   */
  verificaTelefone: async (telefone) => {
    const sql = "SELECT * FROM telefones WHERE telefone = ?";
    const values = [telefone];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Insere um endereço adicional para o cliente
   * @async
   * @function insertEnderecoExtra
   * @param {string} estado Estado do endereço. Ex.: 'SP'
   * @param {string} cidade Cidade do endereço. Ex.: 'Campinas'
   * @param {string} bairro Bairro do endereço. Ex.: 'Centro'
   * @param {string} logradouro Logradouro do endereço. Ex.: 'Rua das Flores'
   * @param {number} numero Número da residência. Ex.: 123
   * @param {string} cep CEP do endereço. Ex.: '13170023'
   * @param {number} idCliente ID do cliente para associar o endereço
   * @returns {Promise<Object>} Resultado da execução da stored procedure
   */
  insertEnderecoExtra: async (estado, cidade, bairro, logradouro, numero, cep, idCliente) => {
    const procedure = "CALL cadastrar_endereco(?,?,?,?,?,?,?)";
    const values = [estado, cidade, bairro, logradouro, numero, cep, idCliente];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  /**
   * Deleta um endereço específico.
   * @async
   * @function deleteEndereco
   * @param {number} idEndereco
   * @returns {Promise<Object>}
   */
  deleteEndereco: async (idEndereco) => {
    const sql = `DELETE FROM enderecos WHERE id_endereco = ?`;
    const values = [idEndereco];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Retorna todos os endereços associados a um cliente específico
   * @async
   * @function selectEnderecosByCliente
   * @param {number} idCliente ID do cliente que deseja consultar os endereços
   * @returns {Promise<Array<Object>>} Retorna um array de objetos contendo os endereços do cliente
   */
  selectEnderecosByCliente: async (idCliente) => {
    const sql = `SELECT * FROM enderecos WHERE fk_id_cliente = ?`;
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Insere um telefone adicional para o cliente
   * @async
   * @function insertTelefoneExtra
   * @param {number} idCliente ID do cliente para associar o telefone
   * @param {string} telefone Número de telefone. Ex.: '19999999999'
   * @returns {Promise<Object>} Resultado da execução da stored procedure
   */
  insertTelefoneExtra: async (idCliente, telefone) => {
    const procedure = "CALL cadastrar_telefone(?,?)";
    const values = [idCliente, telefone];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  /**
   *Verifica se um número de telefone já está cadastrado na base
   * @async
   * @function verificaTelefone
   * @param {string} telefone Número de telefone a ser verificado. Ex.: '19999999999'
   * @returns {Promise<Array<Object>>} Retorna array com resultado da busca (vazio = não existe)
   */
  verificaTelefone: async (telefone) => {
    const sql = `SELECT * FROM telefones WHERE telefone = ?`;
    const values = [telefone];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Deleta um telefone específico.
   * @async
   * @function deleteTelefone
   * @param {number} idTelefone
   * @returns {Promise<Object>}
   */
  deleteTelefone: async (idTelefone) => {
    const sql = `DELETE FROM telefones WHERE id_telefone = ?`;
    const values = [idTelefone];
    const [rows] = await pool.query(sql, values);
    return rows;
  }

};

module.exports = { clienteModel };
