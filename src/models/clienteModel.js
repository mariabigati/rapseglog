const {pool} = require('../config/db');
const clienteModel = {

    cadastroCliente: async (pNomeCliente, pCpfCliente, pEmailCliente, pTelefone) => {
        const connection = await pool.getConnection();
        try {
            const sqlCadastro = 'CALL cadastrar_cliente(?,?,?)'
            const valuesCadastro = [pNomeCliente, pCpfCliente, pEmailCliente]
            const [rowsCadastro] = await connection.query(sqlCadastro, valuesCadastro);

            const sqlTelefone = 'INSERT INTO telefones (fk_id_telefone, telefone) VALUES (?,?)';
            const valuesTelefone = [rowsCadastro.insertId, pTelefone];
            const [rowsTelefone] = await connection.query(sqlTelefone, valuesTelefone)
            connection.commit();
            return {rows, rowsTelefone};

        } catch (error) {
            connection.rollback();
            throw error;
        }      
    }
} 

module.exports = { clienteModel }