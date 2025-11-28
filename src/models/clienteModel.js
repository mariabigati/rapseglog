const { pool } = require("../config/db");

const clienteModel = {
  selectAll: async () => {
    const sql = "SELECT * FROM clientes";
    const [rows] = await pool.query(sql);
    return rows;
  },

  selectById: async (idCliente) => {
    const sql = "SELECT * FROM clientes WHERE id_cliente = ?";
    const [rows] = await pool.query(sql, [idCliente]);
    return rows;
  },
  
  verificaCpf: async (cpf) => {
    const sql = "SELECT * FROM clientes WHERE cpf_cliente = ?";
    const values = [cpf];
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

  insertCliente: (nome, cpf, email, dataNasc) => {
    return pool.query(`CALL cadastrar_novo_cliente(?,?,?,?)`, [
      nome,
      cpf,
      email,
      dataNasc,
    ]);
  },

  insertTelefone: async (idCliente, telefone) => {
    const sql = "CALL cadastrar_telefone(?,?)";
    const values = [idCliente, telefone];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  insertEndereco: async (
    estado,
    bairro,
    logradouro,
    numero,
    cep,
    idCliente
  ) => {
    const sql = "CALL cadastrar_endereco(?,?,?,?,?,?)";
    const values = [estado, bairro, logradouro, numero, cep, idCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
};

module.exports = { clienteModel };
