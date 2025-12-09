const { pool } = require('../config/db');

const pedidoModel = {
   /**
     * @async
     * @function selectTodosPedidos
     * Seleciona todos os pedidos presentes na base de dados
     * @returns {Promise<Array<object} Retorna um array de objetos, onde cada objeto representa uma entrega.
     */ 
    selectTodosPedidos: async () => {
        const sql = 'SELECT * FROM pedidos;'
        const [rows] = await pool.query(sql);
        return rows;
    },
    /**
     * @async
     * @function selectPedidoPorId
     *Seleciona um pedido na base de dados com base em seu ID.
     * @param {number} pIdPedido Identificador do pedido que será selecionada. EX: 1
     * @returns {Promise<object} Retorna um objeto contendo as propriedades sobre o resultado da execução da Query.
     */
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

    selectPedidosPorTipo: async (pIdTipoEntrega) => {
        const sql = 'SELECT * FROM pedidos WHERE fk_id_tipo_entrega = ?;';
        const values = [pIdTipoEntrega];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectPedidoPorClienteTipo: async (pIdCliente, pIdTipoEntrega) => {
         const sql = 'SELECT * FROM pedidos WHERE fk_id_cliente = ? AND fk_id_tipo_entrega = ?;';
        const values = [pIdCliente, pIdTipoEntrega];
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
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const procedure = 'CALL update_pedidos(?,?,?,?,?);';
            const values = [pIdPedido, pDistancia,
            pPesoCarga, pValorBaseKG, pValorBaseKM];
            const [rows] = await connection.query(procedure, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
        
    },

    deletePedido: async(pIdPedido) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'DELETE FROM pedidos WHERE id_pedido = ?;';
            const values = [pIdPedido];
            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
        
    }
     
}

module.exports = { pedidoModel };