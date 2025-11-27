const { clienteModel } = require('../models/clienteModel');
const clienteController = {
    cadastraClientes: async (req, res) => {
        try {
            const {nome, cpf, email} = req.body;
            res.status(201).json
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
        }
    }
}

module.exports = { clienteController };