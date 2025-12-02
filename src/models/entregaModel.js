const { pool } = require('../config/db');

const entregaModel = {

    selectTodasEntregas: async() => {
        const sql = 'SELECT * FROM entregas;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    insertEntrega: async(pIdPedido, pIdStatus, pValorDistancia, pValorPeso, pValorBase, pAcresimo, pDesconto, pTaxaExtra, pValorFinal) => {
        const procedure = 'CALL cadastrar_nova_entrega(?, ?, ?, ?, ?, ?, ?, ?, ?);';
        const values = [pIdPedido, pIdStatus, pValorDistancia, pValorPeso, pValorBase, pAcresimo, pDesconto, pTaxaExtra, pValorFinal];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    }
}

module.exports = { entregaModel };