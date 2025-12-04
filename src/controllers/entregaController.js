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
            const {id_pedido, id_status_entrega} = req.body;

            if (!id_pedido ||  !id_status_entrega) {
                return res.status(400).json({ message: 'Há dados faltantes! Tente novamente.'});
            }

            if (isNaN(id_pedido) || isNaN(id_status_entrega)) {
                return res.status(400).json({ message: 'Há dados inválidos! Tente novamente.'});
            }

            const resultado = await entregaModel.insertEntrega(id_pedido, id_status_entrega);

            // if (resultado.affectedRows() === 0) {
            //     return res.status(200).json({ message: 'Houve um erro ao inserir os dados da entrega no sistema. Tente novamente!' });
            // }

            res.status(201).json({ message: 'Dados da entrega inseridos com sucesso!', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    },

    atualizaEstadoEntrega: async (req, res) => {
        try {
            const {id_pedido, status_entrega} = req.body;
            let id_status_entrega;
            if (!id_pedido ||  !status_entrega) {
                return res.status(400).json({ message: 'Há dados faltantes! Tente novamente.'});
            }

            if (isNaN(id_pedido) || isNaN(status_entrega)) {
                return res.status(400).json({ message: 'Há dados inválidos! Tente novamente.'});
            }

            if (status_entrega.toLowerCase() === "calculado"){
                id_status_entrega = 1;
            } else if {
                
            }
                
            const resultado = await entregaModel.insertEntrega(id_pedido, id_status_entrega);

            res.status(201).json({ message: 'Dados da entrega inseridos com sucesso!', data: resultado });


        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    }
}

module.exports = { entregaController };