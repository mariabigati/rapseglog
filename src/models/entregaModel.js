const { pool } = require('../config/db');

const entregaModel = {

    selectTodasEntregas: async() => {
        const sql = 'SELECT * FROM entregas;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    insertEntrega: async(pIdPedido, pDistancia, pPesoCarga, pValorBaseKG, pValorBaseKM) => {
        const procedure = 'CALL cadastrar_nova_entrega(?, ?, ?, ?, ?);';
        const values = [pIdPedido, pDistancia, pPesoCarga, pValorBaseKG, pValorBaseKM];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    }
}

module.exports = { entregaModel };