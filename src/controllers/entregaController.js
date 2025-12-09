const { entregaModel } = require('../models/entregaModel');
const { pedidoModel } = require('../models/pedidoModel');
const entregaController = {

    selecionarEntregas: async (req, res) => {
        try {
            const {idEntrega} = req.query;
            if (idEntrega) {
                const resultadoEntrega = await entregaModel. selectByIdView(idEntrega);
                return res.status(200).json({data : resultadoEntrega});
            }
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
            const pedidoSelecionado = await pedidoModel.selectPedidoPorId(id_pedido);

            if (pedidoSelecionado.length === 0) {
                return res.status(200).json({message: 'Pedido não localizado na base de dados!'}) };

            const entregaSelecionada = await entregaModel.selectByPedido(id_pedido);

            // se já houver uma entrega com esse pedido, e se o status não for 'cancelado'
            for (const entrega of entregaSelecionada) {
            const statusEntrega = parseInt(entrega.fk_id_status_entrega, 10);

            if (statusEntrega !== 4) {
                return res.status(200).json({
                    message: 'Já existe uma entrega ativa para este pedido. Não é permitido nova entrega até o cancelamento.'
                });
          
             }
            }

            const resultado = await entregaModel.insertEntrega(id_pedido, id_status_entrega);
            res.status(201).json({ message: 'Dados da entrega inseridos com sucesso!', data: resultado });
            
            // if (resultado.affectedRows === 0) {
            //     return res.status(200).json({ message: 'Houve um erro ao inserir os dados da entrega no sistema. Tente novamente!' });
            // }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    },

    atualizaEstadoEntrega: async (req, res) => {
        try {
            const id_entrega = Number(req.params.idEntrega);
            const {status_entrega} = req.body;
            let id_status_entrega;
            if (!id_entrega |  !status_entrega) {
                return res.status(400).json({ message: 'Há dados faltantes! Tente novamente.'});
            }

            if (isNaN(id_entrega) || !isNaN(status_entrega)) {
                return res.status(400).json({ message: 'Há dados inválidos! Tente novamente.'});
            }

            const entregaAtual = await entregaModel.selectById(id_entrega);

            if (entregaAtual.length === 0) {
                return res.status(200).json({ message: 'Entrega não localizada' });
            }

            if (status_entrega.toLowerCase() === "calculado"){
                id_status_entrega = 1;
            } else if (status_entrega.toLowerCase() === "em transito") {
                id_status_entrega = 2;
            }  else if (status_entrega.toLowerCase() === "entregue") {
                id_status_entrega = 3;
            }  else if (status_entrega.toLowerCase() === "cancelado") {
                id_status_entrega = 4;
            } else {
                return res.status(400).json({ message: 'Este status é inválido! Por favor, digite o status calculado, em transito, entregue ou cancelado.'});
            }
            
            const novoStatusEntrega = id_status_entrega ?? entregaAtual[0].fk_id_status_entrega;

            const resultado = await entregaModel.updateEstadoEntrega(id_entrega, novoStatusEntrega);

            // testes de validação se houve mudança de estado, puxa as linhas afetadas da procedure
            const linhas = resultado[0].linhas_afetadas || 0;

            if (linhas === 0) {
                return res.status(200).json({ message: 'Não há alterações a serem realizadas.', data: linhas });
            }

            return res.status(201).json({
                message: 'Entrega alterada com sucesso!', data: linhas
            });


        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    },

    deletaEntrega: async (req, res) => {
        const id_entrega = Number(req.params.idEntrega);
        const entregaSelecionada = await entregaModel.selectById(id_entrega);

        if (entregaSelecionada.length === 0) {
            return res.status(200).json({message: 'Entrega não localizada na base de dados!'});
        }

        for (const entrega of entregaSelecionada) {
            const statusEntrega = parseInt(entrega.fk_id_status_entrega, 10);

            if (statusEntrega !== 4) {
                return res.status(400).json({
                    message: 'Essa entrega está ativa. Por favor, cancele a entrega para deletá-la.'
                })
            } 

            if (entregaSelecionada.length > 0) {
            const resultado = await entregaModel.deleteEntrega(id_entrega);
            res.status(201).json({ message: 'Entrega deletada com sucesso!', data: resultado });    
            }

            

        }

    }
}

module.exports = { entregaController };