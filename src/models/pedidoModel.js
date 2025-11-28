const { pool } = require('../config/db');

const pedidoModel = {
    selectTodosPedidos: async () => {
        const sql = 'SELECT * FROM pedidos;'
        const [rows] = await pool.query(sql);
        return rows;
    },

    insertPedido: async(pDataPedido, pIdCliente ) => {
        const procedure = 'CALL cadastrar_novo_pedido(?, ?);';
        const values = [pDataPedido, pIdCliente];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    }
}

module.exports = { pedidoModel };