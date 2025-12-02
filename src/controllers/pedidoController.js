const { pedidoModel } = require('../models/pedidoModel');
const pedidoController = {
    selecionarTodosPedidos: async (req, res) => {
        try {
            const resultado = await pedidoModel.selectTodosPedidos();
            if (resultado.length === 0) {
                return res.status(200).json({ message: 'Não foram encontrados resultados' });
            }
            res.status(200).json({data: resultado});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    },

    cadastrarPedido: async (req, res) => {
        try {
            const {data_pedido, id_cliente, 
            id_tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg} = req.body;

            if(!id_cliente || !data_pedido || !id_tipo_entrega) {
                return res.status(400).json({message: 'Há dados faltantes! Tente novamente.'});
            }

            const resultado = await pedidoModel.insertPedido(data_pedido, id_cliente, id_tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg);

            res.status(201).json({message: 'Registro incluído com sucesso!', data: resultado});

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message })
        }
    }
}

module.exports = { pedidoController };