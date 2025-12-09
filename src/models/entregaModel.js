const { pool } = require('../config/db');

const entregaModel = {
    /**
     * @async
     * @function selectTodasEntregas
     * Seleciona todas as entregas presentes na base de dados, da VIEW vw_entregas
     * @returns {Promise<Array<object} Retorna um array de objetos, onde cada objeto representa uma entrega.
     */
    selectTodasEntregas: async() => {
        const sql = 'SELECT * FROM vw_entregas;';
        const [rows] = await pool.query(sql);
        return rows;
    },
    /**
     * @async
     * @function selectByIdView
     *Seleciona uma entrega na base de dados com base em seu ID.
     * @param {number} pIdEntrega Identificador da entrega que será selecionada. EX: 1
     * @returns {Promise<object} Retorna um objeto contendo as propriedades sobre o resultado da execução da Query, diretamente da VIEW vw_entregas.
     */
    selectByIdView: async (pIdEntrega) => {
        const sql = 'SELECT * FROM vw_entregas WHERE id_entrega =?;';
        const values = [pIdEntrega];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    /**
     * @async
     * @function selectById
     *Seleciona uma entrega na base de dados com base em seu ID.
     * @param {number} pIdEntrega Identificador da entrega que será selecionada. EX: 1
     * @returns {Promise<object} Retorna um objeto contendo as propriedades sobre o resultado da execução da Query.
     */
    selectById: async (pIdEntrega) => {
        const sql = 'SELECT * FROM entregas WHERE id_entrega =?;';
        const values = [pIdEntrega];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * @async
     * @function selectByPedido
     * Seleciona todas as entregas presentes na base de dados, com base no ID do pedido
     * @param {number} pIdPedido Identificador do pedido que está atrelado às entregas selecionadas
     * @returns {Promise<Array<object} Retorna um array de objetos, onde cada objeto representa uma entrega.
     */
    selectByPedido: async (pIdPedido) => {
        const sql = 'SELECT * FROM entregas WHERE fk_id_pedido = ?;';
        const values = [pIdPedido];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * @async
     * @function insertEntrega
     * Insere uma entrega na base de dados
     * @param {number} pIdPedido Identificador do pedido. EX: 1
     * @param {number} pIdStatus Identificador do status da entrega. EX: 1
     * @returns {Promise<object} Retorna um objeto contendo propriedades sobre o resultado da execução da Query
     */
    insertEntrega: async(pIdPedido, pIdStatus) => {
        const procedure = 'CALL cadastrar_nova_entrega(?, ?);';
        const values = [pIdPedido, pIdStatus];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    },
    /**
     * @async
     * @function updateEstadoEntrega
     * Altera os dados do cliente selecionado
     * @param {number} pIdEntrega Identificador da entrega que será alterada EX: 1
     * @param {number} pIdStatus Identificador do status da entrega. EX: 1
     * @returns {Promise<object}
     */
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
    /**
     * @async
     * @function deleteEntrega
     * Deleta os dados da entrega da base de dados
     * @param {number} pIdEntrega Identificador da entrega que será deletada
     * @returns {Promise<object}
     */
    deleteEntrega: async (pIdEntrega) => {
         const sql = 'DELETE FROM entregas WHERE id_entrega = ?;';
        const values = [pIdEntrega];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * @async
     * @function deleteEntregasByPedido
     * Deleta os dados da entrega da base de dados com base no ID do pedido
     * @param {number} pIdPedido Identificador do pedido que será referencia para as entregas deletadas
     * @returns {Promise<object}
     */
    deleteEntregasByPedido: async (pIdPedido) => {
         const sql = 'DELETE FROM entregas WHERE fk_id_pedido = ?;';
        const values = [pIdPedido];
        const [rows] = await pool.query(sql, values);
        return rows;
    }
}

module.exports = { entregaModel };