const { entregaModel } = require('../models/entregaModel');
const entregaController = {

    selecionarTodasEntregas: async (req, res) => {
        try {
            const resultado = await entregaModel.selectTodasEntregas();
            if (resultado.length === 0) {
                return res.status(200).json({ message: 'Não foram encontrados resultados' });
            }
            res.status(200).json({data: resultado});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    },

    cadastraEntregas: async (req, res) => {
        try {
            const {id_pedido, id_tipo_entrega, id_status_entrega, distancia, peso_carga, valor_base_kg,
            valor_base_km
            } = req.body;

            if (!id_pedido || !id_tipo_entrega || !id_status_entrega || !distancia || !peso_carga || !valor_base_kg || !valor_base_km) {
                return res.status(400).json({ message: 'Há dados faltantes! Tente novamente.'});
            }

            if (isNaN(id_pedido) || isNaN(id_tipo_entrega) || isNaN(id_status_entrega) || isNaN(distancia) || isNaN(peso_carga) || isNaN(valor_base_kg) || isNaN(valor_base_km)) {
                return res.status(400).json({ message: 'Há dados inválidos! Tente novamente.'});
            }

            const resultado = await entregaModel.insertEntrega(id_pedido, id_tipo_entrega, id_status_entrega, distancia, peso_carga, valor_base_kg, valor_base_km);

            if (resultado.affectedRows === 0) {
                return res.status(200).json({ message: 'Houve um erro ao inserir os dados da entrega no sistema. Tente novamente!' });
            }

            res.status(201).json({ message: 'Dados da entrega inseridos com sucesso!', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    }
}

module.exports = { entregaController };