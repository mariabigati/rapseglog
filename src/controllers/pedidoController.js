const { pedidoModel } = require('../models/pedidoModel');
const pedidoController = {
    selecionarPedidos: async (req, res) => {
        try {
            const { idPedido, idCliente } = req.query;

            if (idPedido && idCliente) {
                return res.status(200).json({ message: 'Por favor, envie apenas um id!' });
            }

            if (idPedido) {
                const resultadoPedido = await pedidoModel.selectPedidoPorId(idPedido);
                return res.status(200).json({ data: resultadoPedido });
            }

            if (idCliente) {
                const resultadoPedidoCliente = await pedidoModel.selectPedidosPorCliente(idCliente);
                return res.status(200).json({ data: resultadoPedidoCliente });
            }


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

    cadastrarPedido: async (req, res) => {
        try {
            const { data_pedido, id_cliente,
                id_tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg } = req.body;

            if (!id_cliente || !data_pedido || !id_tipo_entrega) {
                return res.status(400).json({ message: 'Há dados faltantes! Tente novamente.' });
            }
            
            if (distancia === 0 || peso === 0 || valor_kg === 0 || valor_km === 0) {
                return res.status(400).json({ message: 'Valores não podem ser 0! Tente novamente.' });
            }

            const resultado = await pedidoModel.insertPedido(data_pedido, id_cliente, id_tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg);

            res.status(201).json({ message: 'Registro incluído com sucesso!', data: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message })
        }
    },

    alteraPedido: async (req, res) => {
        try {

            const idPedido = Number(req.params.idPedido);

            const { distancia, peso, valor_kg, valor_km } = req.body;

            if (!idPedido || (!distancia && !peso && !valor_kg && !valor_km) || isNaN(distancia) || isNaN(peso) || isNaN(valor_kg) || isNaN(valor_km) || typeof idPedido != 'number') {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente.' });
            }

            if (distancia === 0 || peso === 0 || valor_kg === 0 || valor_km === 0) {
                return res.status(400).json({ message: 'Valores não podem ser 0! Tente novamente.' });
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
                return res.status(200).json({ message: 'Não há alterações a serem realizadas.', data: linhas });
            }

            return res.status(200).json({
                message: 'Registro alterado com sucesso!', data: linhas
            });


        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message })
        }
    }
}

module.exports = { pedidoController };