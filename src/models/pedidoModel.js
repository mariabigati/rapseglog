const { pool } = require('../config/db');

const pedidoModel = {
    selectTodosPedidos: async () => {
        const sql = 'SELECT * FROM pedidos;'
        const [rows] = await pool.query(sql);
        return rows;
    },

    selectPedidoPorId: async (pIdPedido) => {
        const sql = 'SELECT * FROM pedidos WHERE id_pedido = ?;';
        const values = [pIdPedido];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectPedidosPorCliente: async (pIdCliente) => {
        const sql = 'SELECT * FROM pedidos WHERE fk_id_cliente = ?;';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    insertPedido: async(pDataPedido, pIdCliente, pIdTipoEntrega, pDistancia, pPesoCarga, pValorBaseKG, pValorBaseKM) => {
        const procedure = 'CALL cadastrar_novo_pedido(?, ?, ?, ?, ?, ?, ?);';
        const values = [pDataPedido, pIdCliente,
        pIdTipoEntrega, pDistancia, pPesoCarga, pValorBaseKG, pValorBaseKM];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    },

    updatePedido: async(pIdPedido, pDistancia, pPesoCarga, pValorBaseKG, pValorBaseKM) => {
        const procedure = 'CALL update_pedidos(?,?,?,?,?);';
        const values = [pIdPedido, pDistancia,
        pPesoCarga, pValorBaseKG, pValorBaseKM];
        const [rows] = await pool.query(procedure, values);
        return rows;
    }
     
}

module.exports = { pedidoModel };