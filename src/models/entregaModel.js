const { pool } = require('../config/db');

const entregaModel = {

    selectTodasEntregas: async() => {
        const sql = 'SELECT * FROM entregas;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    insertEntrega: async(pIdPedido, pIdStatus) => {
        const procedure = 'CALL cadastrar_nova_entrega(?, ?);';
        const values = [pIdPedido, pIdStatus];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    },

    updateEstadoEntrega: async(pIdEntrega, pIdStatus) => {
        const procedure = 'CALL update_estado_entrega(?, ?);';
        const values = [pIdEntrega, pIdStatus];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    },
}

module.exports = { entregaModel };