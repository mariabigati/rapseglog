const { entregaModel } = require('../models/entregaModel');
const { pedidoModel } = require('../models/pedidoModel');
const entregaController = {

    /**
     * Retorna as entregas cadastradas
     * Rota GET /entregas
     * @async
     * @function selecionarEntregas
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<Array<object} Objeto contendo o resultado da consulta.
     * @example {
        "data": [
            {
                "id_entrega": 1,
                "id_pedido": 4,
                "nome_cliente": "Fulano de Tal",
                "status_entrega": "Em trânsito",
                "tipo_entrega": "Urgente",
                "valor_distancia": "276.00",
                "valor_peso": "810.00",
                "valor_base": "1086.00",
                "acrescimo": "217.20",
                "desconto": "131.82",
                "taxa_extra": "15.00",
                "valor_final": "1186.38"
            }
        ]
    }
     */
    selecionarEntregas: async (req, res) => {
        try {
            const { idEntrega } = req.query;
            if (idEntrega) {
                const resultadoEntrega = await entregaModel.selectByIdView(idEntrega);
                return res.status(200).json({ data: resultadoEntrega });
            }
            const resultado = await entregaModel.selectTodasEntregas();


            if (resultado.length === 0) {
                return res.status(200).json({ message: 'Não foram encontrados resultados' });
            }
            res.status(200).json({ data: resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    },
    /**
    * Cadastra novas entregas manualmente
    * Rota POST /entregas
    * @async
    * @function cadastraEntregas
    * @param {Request} req Objeto da requisição HTTP
    * @param {Response} res Objeto da resposta HTTP
    * @returns {Promise<object} Objeto contendo o resultado do insert.
    * @example {
        "message": "Dados da entrega inseridos com sucesso!"
        }
    */
    cadastraEntregas: async (req, res) => {
        try {
            const { id_pedido, id_status_entrega } = req.body;


            if (!id_pedido || !id_status_entrega) {
                return res.status(400).json({ message: 'Há dados faltantes! Tente novamente.' });
            }


            if (isNaN(id_pedido) || isNaN(id_status_entrega)) {
                return res.status(400).json({ message: 'Há dados inválidos! Tente novamente.' });
            }
            const pedidoSelecionado = await pedidoModel.selectPedidoPorId(id_pedido);


            if (pedidoSelecionado.length === 0) {
                return res.status(200).json({ message: 'Pedido não localizado na base de dados!' })
            };


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


        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    },
    /**
     * Realiza alterações no estado de uma entrega
     * Rota PUT /entregas
     * @async
     * @function atualizaEstadoEntrega
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<object} Objeto contendo o resultado da consulta.
     * @example {
        "message": "Entrega alterada com sucesso!",
        "linhasAfetadas": 1
        }
     */
    atualizaEstadoEntrega: async (req, res) => {
        try {
            const id_entrega = Number(req.params.idEntrega);
            const { status_entrega } = req.body;
            let id_status_entrega;
            if (!id_entrega || !status_entrega) {
                return res.status(400).json({ message: 'Há dados faltantes! Tente novamente.' });
            }


            if (isNaN(id_entrega) || typeof status_entrega !== 'string') {
                return res.status(400).json({ message: 'Há dados inválidos! Tente novamente.' });
            }


            const entregaAtual = await entregaModel.selectById(id_entrega);


            if (entregaAtual.length === 0) {
                return res.status(200).json({ message: 'Entrega não localizada' });
            }


            if (status_entrega.toLowerCase() === "calculado") {
                id_status_entrega = 1;
            } else if (status_entrega.toLowerCase() === "em transito" || status_entrega.toLowerCase() === "em trânsito") {
                id_status_entrega = 2;
            } else if (status_entrega.toLowerCase() === "entregue") {
                id_status_entrega = 3;
            } else if (status_entrega.toLowerCase() === "cancelado") {
                id_status_entrega = 4;
            } else {
                return res.status(400).json({ message: 'Este status é inválido! Por favor, digite o status calculado, em transito, entregue ou cancelado.' });
            }


            const novoStatusEntrega = id_status_entrega ?? entregaAtual[0].fk_id_status_entrega;


            const resultado = await entregaModel.updateEstadoEntrega(id_entrega, novoStatusEntrega);


            // testes de validação se houve mudança de estado, puxa as linhas afetadas da procedure
            const linhas = resultado[0].linhas_afetadas || 0;


            if (linhas === 0) {
                return res.status(200).json({ message: 'Não há alterações a serem realizadas.', linhasAfetadas: linhas });
            }


            return res.status(201).json({
                message: 'Entrega alterada com sucesso!', linhasAfetadas: linhas
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    },
    /**
     * Deleta entregas
     * Rota DELETE /entregas
     * @async
     * @function deletarEntregas
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<object} Objeto contendo o resultado da exclusão.
     * @example {
        "message": "Entrega deletada com sucesso!",
        "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 0,
        "changedRows": 0
        }
    }
     */
    deletarEntregas: async (req, res) => {
        try {
            const id_entrega = Number(req.params.idEntrega);


            if (isNaN(id_entrega)) {
                return res.status(400).json({ message: 'ID inválido!' });
            }


            const entrega = await entregaModel.selectById(id_entrega);


            if (entrega.length === 0) {
                return res.status(404).json({ message: 'Entrega não encontrada!' });
            }


            const statusEntrega = Number(entrega[0].fk_id_status_entrega);


            if (statusEntrega !== 4) {
                return res.status(400).json({
                    message: 'Essa entrega está ativa. Cancele antes de deletar.'
                });
            }


            const resultado = await entregaModel.deleteEntrega(id_entrega);


            return res.status(200).json({
                message: 'Entrega deletada com sucesso!',
                data: resultado
            });


        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro no servidor.', error: error.message });
        }
    }

}

module.exports = { entregaController };

