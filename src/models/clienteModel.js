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

  insertCliente: async (nome, cpf, email, dataNasc) => {
    const sql = "CALL cadastrar_novo_cliente(?,?,?,?)";
    const values = [nome, cpf, email, dataNasc];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  selectUltimoId: async () => {
    const sql = "SELECT MAX(id_cliente) AS idCliente FROM clientes";
    const [rows] = await pool.query(sql);
    return rows;
  },

  insertTelefone: async (idCliente, telefone) => {
    const sql = "CALL cadastrar_telefone(?,?)";
    const values = [idCliente, telefone];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  insertEndereco: async (
    estado,
    cidade,
    bairro,
    logradouro,
    numero,
    cep,
    idCliente
  ) => {
    const sql = "CALL cadastrar_endereco(?,?,?,?,?,?,?)";
    const values = [estado, cidade, bairro, logradouro, numero, cep, idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  deleteCliente: async (idCLiente) => {
    const sql = "CALL excluir_cliente(?);";
    // essa procedure de excluir clientes já envolve a exclusão de telefones e endereços
    const values = [idCLiente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  verificaPedido: async (idCLiente) => {
    const sql = "SELECT * FROM pedidos WHERE fk_id_cliente = ?";
    const values = [idCLiente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  updateCliente: async (idCliente) => {
    const sql = "CALL atualizar_cliente()";
    const values = [idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
};

module.exports = { clienteModel };
