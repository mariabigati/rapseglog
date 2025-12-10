const { entregaModel } = require('../models/entregaModel');
const { pedidoModel } = require('../models/pedidoModel');


const pedidoController = {
    /**
     * Retorna os pedidos cadastrados
     * Rota GET /pedidos
     * @async
     * @function selecionarPedidos
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<Array<object} Objeto contendo o resultado da consulta.
     * @example {
    "data": [
        {
            "id_pedido": 1,
            "fk_id_tipo_entrega": 1,
            "fk_id_cliente": 1,
            "data_pedido": "2020-01-12T03:00:00.000Z",
            "distancia": "4.00",
            "peso_carga": "30.000",
            "valor_base_kg": "1.00",
            "valor_base_km": "60.00"
        },
        {
            "id_pedido": 2,
            "fk_id_tipo_entrega": 2,
            "fk_id_cliente": 1,
            "data_pedido": "2020-01-12T03:00:00.000Z",
            "distancia": "40.00",
            "peso_carga": "20.000",
            "valor_base_kg": "4.90",
            "valor_base_km": "6.90"
            }
        ]
    }
     */
    selecionarPedidos: async (req, res) => {
        try {
            const { idPedido, idCliente, idTipoEntrega } = req.query;


            if (idPedido && idCliente && idTipoEntrega) {
                return res.status(200).json({ message: 'Por favor, envie apenas um id, ou se deseja buscar pedidos de um cliente com um tipo específico, envie ID do cliente e do tipo de entrega.' });
            }


            if (idCliente && idTipoEntrega) {
                const resultadoPedido = await pedidoModel.selectPedidoPorClienteTipo(idCliente, idTipoEntrega);
                if (resultadoPedido.length === 0) {
                    return res.status(200).json({ message: 'Não foram encontrados resultados' });
                } else {
                    return res.status(200).json({ data: resultadoPedido });
                };


            }
            if (idPedido) {
                const resultadoPedido = await pedidoModel.selectPedidoPorId(idPedido);
                if (resultadoPedido.length === 0) {
                    return res.status(200).json({ message: 'Não foram encontrados resultados' });
                } else {
                    return res.status(200).json({ data: resultadoPedido });
                }
            }


            if (idCliente) {
                const resultadoPedidoCliente = await pedidoModel.selectPedidosPorCliente(idCliente);
                if (resultadoPedidoCliente.length === 0) {
                    return res.status(200).json({ message: 'Não foram encontrados resultados' });
                } else {
                    return res.status(200).json({ data: resultadoPedidoCliente });
                };


            };


            if (idTipoEntrega) {
                const resultadoPedidoTipo = await pedidoModel.selectPedidosPorTipo(idTipoEntrega);
                if (resultadoPedidoTipo.length === 0) {
                    return res.status(200).json({ message: 'Não foram encontrados resultados' });
                } else {
                    return res.status(200).json({ data: resultadoPedidoTipo });
                };


            };


            const resultado = await pedidoModel.selectTodosPedidos();
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
     * Cadastra novos pedidos
     * Rota POST /pedidos
     * @async
     * @function cadastrarPedido
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<object} Objeto contendo o resultado do insert.
     * @example {
        "message": "Registro incluído com sucesso!"
        }
     */
    cadastrarPedido: async (req, res) => {
        try {
            const { data_pedido, id_cliente,
                id_tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg } = req.body;


            if (!id_cliente || !data_pedido || !id_tipo_entrega) {
                return res.status(400).json({ message: 'Há dados faltantes! Tente novamente.' });
            }


            if (distancia === 0 || peso_carga === 0 || valor_base_kg === 0 || valor_base_km === 0) {
                return res.status(400).json({ message: 'Valores não podem ser 0! Tente novamente.' });
            }


            const resultado = await pedidoModel.insertPedido(data_pedido, id_cliente, id_tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg);


            res.status(201).json({ message: 'Registro incluído com sucesso!', data: resultado });


        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    },
    /**
     * Realiza alterações em um pedido
     * Rota PUT /pedidos
     * @async
     * @function alteraPedido
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<object} Objeto contendo o resultado da consulta.
     * @example {
        "message": "Registro alterado com sucesso!",
        "linhasAfetadas": 1
        }   
     */
    alteraPedido: async (req, res) => {
        try {


            const idPedido = Number(req.params.idPedido);


            const { distancia, peso, valor_kg, valor_km } = req.body;


            if (!idPedido || isNaN(idPedido) || idPedido <= 0) {
                return res.status(400).json({ message: 'Verifique o ID enviado e tente novamente.' });
            }


            if (distancia === undefined && peso === undefined && valor_kg === undefined && valor_km === undefined) {
                return res.status(400).json({ message: 'Nenhum campo para atualização foi fornecido.' });
            }


            if (distancia === 0 || peso === 0 || valor_kg === 0 || valor_km === 0 || isNaN(distancia) || isNaN(peso) || isNaN(valor_kg) || isNaN(valor_km)) {
                return res.status(400).json({ message: 'Valores inválidos! Tente novamente.' });
            }


            const pedidoAtual = await pedidoModel.selectPedidoPorId(idPedido);


            if (pedidoAtual.length === 0) {
                return res.status(200).json({ message: 'Pedido não localizado' });
            }


            const novaDistancia = distancia ?? pedidoAtual[0].distancia;
            const novoPeso = peso ?? pedidoAtual[0].peso_carga;
            const novoValorKg = valor_kg ?? pedidoAtual[0].valor_base_kg;
            const novoValorKm = valor_km ?? pedidoAtual[0].valor_base_km;


            const resultUpdate = await pedidoModel.updatePedido(idPedido, novaDistancia, novoPeso, novoValorKg, novoValorKm);


            // testes de validação se houve alguma alteração nas informações do pedido, puxa as linhas afetadas da procedure
            const linhas = resultUpdate[0][0].linhas_afetadas || 0;


            if (linhas === 0) {
                return res.status(200).json({ message: 'Não há alterações a serem realizadas.', linhasAfetadas: linhas });
            }


            return res.status(200).json({
                message: 'Registro alterado com sucesso!', linhasAfetadas: linhas
            });




        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message })
        }
    },


    /**
     * Deleta pedidos
     * Rota DELETE /pedidos
     * @async
     * @function deletarPedido
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<object} Objeto contendo o resultado da exclusão.
     * @example {
        "message": "Pedido deletado com sucesso.",
        "data": {
            "fieldCount": 0,
            "affectedRows": 1,
            "insertId": 0,
            "info": "",
            "serverStatus": 3,
            "warningStatus": 0,
            "changedRows": 0
        }
    }
     */
    deletarPedido: async (req, res) => {
        const idPedido = Number(req.params.idPedido);


        const pedidoSelecionado = await pedidoModel.selectPedidoPorId(idPedido);
        const entregaSelecionada = await entregaModel.selectByPedido(idPedido);


        if (pedidoSelecionado.length === 0) {
            return res.status(200).json({ message: 'Pedido não localizado na base de dados!' });
        };


        for (const entrega of entregaSelecionada) {
            const statusEntrega = parseInt(entrega.fk_id_status_entrega, 10);


            if (statusEntrega !== 4) {
                return res.status(400).json({
                    message: 'Esse pedido possui uma entrega ativa. Por favor, cancele a entrega para deletar o pedido.'
                });
            };


        };


        if (entregaSelecionada.length > 0) {
            await entregaModel.deleteEntregasByPedido(idPedido);
        };


        const resultado = await pedidoModel.deletePedido(idPedido);
        res.status(200).json({ message: 'Pedido deletado com sucesso.', data: resultado });
    }


}


module.exports = { pedidoController };

