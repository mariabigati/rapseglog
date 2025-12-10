const { pool } = require('../config/db');


const pedidoModel = {
    /**
      * @async
      * @function selectTodosPedidos
      * Seleciona todos os pedidos presentes na base de dados
      * @returns {Promise<Array<object} Retorna um array de objetos, onde cada objeto representa uma entrega.
      */
    selectTodosPedidos: async () => {
        const sql = 'SELECT * FROM pedidos;';
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
    /**
     * @async
     * @function selectPedidosPorCliente
     *Seleciona pedidos na base de dados com base no cliente qual está atrelado.
     * @param {number} pIdCliente Identificador do cliente do pedido que será selecionado. EX: 1
     * @returns {Promise<object} Retorna um objeto contendo as propriedades sobre o resultado da execução da Query.
     */
    selectPedidosPorCliente: async (pIdCliente) => {
        const sql = 'SELECT * FROM pedidos WHERE fk_id_cliente = ?;';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },


    /**
     * @async
     * @function selectPedidosPorTipo
     *Seleciona pedidos na base de dados com base no seu tipo de entrega (normal ou urgente).
     * @param {number} pIdTipoEntrega Identificador do tipo de entrega. EX: 1 (entrega normal)
     * @returns {Promise<object} Retorna um objeto contendo as propriedades sobre o resultado da execução da Query.
     */
    selectPedidosPorTipo: async (pIdTipoEntrega) => {
        const sql = 'SELECT * FROM pedidos WHERE fk_id_tipo_entrega = ?;';
        const values = [pIdTipoEntrega];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * @async
     * @function selectPedidosPorClienteTipo
     *Seleciona pedidos na base de dados com base no seu tipo de entrega (normal ou urgente) e com seu cliente correspondente.
     * @param {number} pIdCliente Identificador do cliente. EX: 1
     * @param {number} pIdTipoEntrega Identificador do tipo de entrega. EX: 1 (entrega normal)
     * @returns {Promise<object} Retorna um objeto contendo as propriedades sobre o resultado da execução da Query.
     */
    selectPedidoPorClienteTipo: async (pIdCliente, pIdTipoEntrega) => {
        const sql = 'SELECT * FROM pedidos WHERE fk_id_cliente = ? AND fk_id_tipo_entrega = ?;';
        const values = [pIdCliente, pIdTipoEntrega];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    /**
     * @async
     * @function insertPedido
     * Insere um pedido na base de dados
     * @param {string} pDataPedido Data da realização do pedido. EX: "02-02-2022"
     * @param {number} pIdCliente Identificador do cliente que fez o pedido. EX: 1
     * @param {number} pIdTipoEntrega Identificador do tipo da entrega (normal/urgente) EX: 1
     * @param {number} pDistancia Distância a se percorrer na entrega EX: 10.50
     * @param {number} pPesoCarga Peso a se levar na carga EX: 30.350
     * @param {number} pValorBaseKG Valor base a se cobrar por cada KG de peso da carga. EX: 5.90
     * @param {number} pValorBaseKM Valor base a se cobrar por cada KM de distância a se percorrer. EX: 6.90
     * @returns {Promise<object} Retorna um objeto contendo propriedades sobre o resultado da execução da Query
     */
    insertPedido: async (pDataPedido, pIdCliente, pIdTipoEntrega, pDistancia, pPesoCarga, pValorBaseKG, pValorBaseKM) => {
        const procedure = 'CALL cadastrar_novo_pedido(?, ?, ?, ?, ?, ?, ?);';
        const values = [pDataPedido, pIdCliente,
            pIdTipoEntrega, pDistancia, pPesoCarga, pValorBaseKG, pValorBaseKM];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    },


    /**
     * @async
     * @function updatePedido
     * Altera os dados do pedido selecionado
     * @param {number} pIdPedido Identificador do pedido que será alterado EX: 1
     * @param {number} pIdStatus Identificador do status da entrega. EX: 1
     * @returns {Promise<object}
     */
    updatePedido: async (pIdPedido, pDistancia, pPesoCarga, pValorBaseKG, pValorBaseKM) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const procedure = 'CALL update_pedidos(?,?,?,?,?);';
            const values = [pIdPedido, pDistancia,
                pPesoCarga, pValorBaseKG, pValorBaseKM];
            const [rows] = await connection.query(procedure, values);
            await connection.commit();
            return rows;
        } catch (error) {
            await connection.rollback();
            throw error;
        }

    },
    /**
     * @async
     * @function deletePedido
     * Deleta um pedido da base de dados com base no ID do pedido
     * @param {number} pIdPedido Identificador do pedido que será referencia para as entregas deletadas
     * @returns {Promise<object} Retorna um objeto contendo propriedades sobre o resultado da execução da Query
     * @example "data": {
            "fieldCount": 0,
            "affectedRows": 1,
            "insertId": 0,
            "info": "",
            "serverStatus": 3,
            "warningStatus": 0,
            "changedRows": 0
            }
     */
    deletePedido: async (pIdPedido) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'DELETE FROM pedidos WHERE id_pedido = ?;';
            const values = [pIdPedido];
            const [rows] = await connection.query(sql, values);
            await connection.commit();
            return rows;
        } catch (error) {
            await connection.rollback();
            throw error;
        }

    }

}


module.exports = { pedidoModel };

