const { pool } = require('../config/db');

const pedidoModel = {
    selectTodosPedidos: async () => {
        const sql = 'SELECT * FROM pedidos;'
        const [rows] = await pool.query(sql);
        return rows;
    }
}

module.exports = { pedidoModel };