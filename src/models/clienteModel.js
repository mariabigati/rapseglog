const { pool } = require("../config/db");

const clienteModel = {
  selectAll: async () => {
    const sql = "SELECT * FROM clientes";
    const [rows] = await pool.query(sql);
    return rows;
  },

  selectById: async (idCliente) => {
    const sql = "SELECT * FROM clientes WHERE id_cliente = ?";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
  
  verificaCpf: async (cpf) => {
    const sql = "SELECT * FROM clientes WHERE cpf_cliente = ?";
    const values = [cpf];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  verificaEmail: async (email) => {
    const sql = "SELECT * FROM clientes WHERE email_cliente = ?";
    const values = [email];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  selectUltimoId: async () => {
    const sql = "SELECT MAX(id_cliente) AS idCliente FROM clientes";
    const [rows] = await pool.query(sql);
    return rows;
  },

  insertCliente: async (nome, cpf, email, dataNasc) => {
    const procedure = "CALL cadastrar_novo_cliente(?,?,?,?)";
    const values = [nome, cpf, email, dataNasc];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  insertTelefone: async (idCliente, telefone) => {
    const procedure = "CALL cadastrar_telefone(?,?)";
    const values = [idCliente, telefone];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  insertEndereco: async (estado, cidade, bairro, logradouro, numero, cep, idCliente) => {
    const procedure = "CALL cadastrar_endereco(?,?,?,?,?,?,?)";
    const values = [estado, cidade, bairro, logradouro, numero, cep, idCliente];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  deleteCliente: async (idCLiente) => {
    const procedure = "CALL excluir_cliente(?);";
    // essa procedure de excluir clientes já envolve a exclusão de telefones e endereços
    const values = [idCLiente];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  verificaPedido: async (idCliente) => {
    const sql = "SELECT * FROM pedidos WHERE fk_id_cliente = ?";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  atualizarCliente: async(idCliente, novoNome, novoCpf, novoEmail, novaDataNasc) => {
    const procedure = `CALL atualizar_cliente(?, ?, ?, ?, ?)`;
    const values = [idCliente, novoNome, novoCpf, novoEmail, novaDataNasc];
    const rows = await pool.query(procedure, values);
    return rows;
  },

  atualizarEndereco: async(idEndereco, novoCep, novoNumero, novoEstado, novaCidade, novoBairro, novoLogradouro) => {
    const procedure = `CALL atualizar_endereco(?, ?, ?, ?, ?, ?, ?)`;
    const values = [idEndereco, novoCep, novoNumero, novoEstado, novaCidade, novoBairro, novoLogradouro];
    const rows = await pool.query(procedure, values);
    return rows;
  },

  selectEnderecoByCliente: async (idCliente) => {
    const sql = "SELECT * FROM enderecos WHERE fk_id_cliente = ?";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  atualizarTelefone: async (idTelefone, telefone) => {
    const procedure = `CALL atualizar_telefone(?, ?)`;
    const values =  [idTelefone, telefone];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  selectTelefoneByCliente: async (idCliente) => {
    const sql = "SELECT * FROM telefones WHERE fk_id_cliente = ?";
    const [rows] = await pool.query(sql, [idCliente]);
    return rows;
  },

  verificaTelefone: async (telefone) => {
    const sql = "SELECT * FROM telefones WHERE telefone = ?";
    const [rows] = await pool.query(sql, [telefone]);
    return rows;
  },

  insertEnderecoExtra: async (estado, cidade, bairro, logradouro, numero, cep, idCliente) => {
    const procedure = "CALL cadastrar_endereco(?,?,?,?,?,?,?)";
    const values = [estado, cidade, bairro, logradouro, numero, cep, idCliente];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  deleteEndereco: async (idEndereco) => {
    const sql = `DELETE FROM enderecos WHERE id_endereco = ?`;
    const values = [idEndereco];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  selectEnderecosByCliente: async (idCliente) => {
    const sql = `SELECT * FROM enderecos WHERE fk_id_cliente = ?`;
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  insertTelefoneExtra: async (idCliente, telefone) => {
    const procedure = "CALL cadastrar_telefone(?,?)";
    const values = [idCliente, telefone];
    const [rows] = await pool.query(procedure, values);
    return rows;
  },

  selectTelefonesByCliente: async (idCliente) => {
  const sql = `SELECT * FROM telefones WHERE fk_id_cliente = ?`;
  const [rows] = await pool.query(sql, [idCliente]);
  return rows;
  },

  verificaTelefone: async (telefone) => {
  const sql = `SELECT * FROM telefones WHERE telefone = ?`;
  const [rows] = await pool.query(sql, [telefone]);
  return rows;
  },

  deleteTelefone: async (idTelefone) => {
  const sql = `DELETE FROM telefones WHERE id_telefone = ?`;
  const values = [idTelefone];
  const [rows] = await pool.query(sql, values);
  return rows;
  }

};

module.exports = { clienteModel };
