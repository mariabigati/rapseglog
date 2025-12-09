const { pool } = require('../config/db');

const entregaModel = {

    selectTodasEntregas: async() => {
        const sql = 'SELECT * FROM vw_entregas;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    selectByIdView: async (pIdEntrega) => {
        const sql = 'SELECT * FROM vw_entregas WHERE id_entrega =?;';
        const values = [pIdEntrega];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectById: async (pIdEntrega) => {
        const sql = 'SELECT * FROM entregas WHERE id_entrega =?;';
        const values = [pIdEntrega];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selectByPedido: async (pIdPedido) => {
        const sql = 'SELECT * FROM entregas WHERE fk_id_pedido = ?;';
        const values = [pIdPedido];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    insertEntrega: async(pIdPedido, pIdStatus) => {
        const procedure = 'CALL cadastrar_nova_entrega(?, ?);';
        const values = [pIdPedido, pIdStatus];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    },

    updateEstadoEntrega: async(pIdEntrega, pIdStatus) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const procedure = 'CALL update_estado_entrega(?, ?);';
            const values = [pIdEntrega, pIdStatus];
            const [rows] = await connection.query(procedure, values);
            connection.commit();
            return rows[0];
        } catch (error) {
            connection.rollback();
            throw error;
        }
        
    },

    deleteEntrega: async (pIdEntrega) => {
         const sql = 'DELETE FROM entregas WHERE id_entrega = ?;';
        const values = [pIdEntrega];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    deleteEntregasByPedido: async (pIdPedido) => {
         const sql = 'DELETE FROM entregas WHERE fk_id_pedido = ?;';
        const values = [pIdPedido];
        const [rows] = await pool.query(sql, values);
        return rows;
    }
}

module.exports = { entregaModel };