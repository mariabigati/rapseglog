const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'rapseglog',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await pool.getConnection;
        console.log('Conexão com o MySQL bem sucedida!');
        connection.release;
    } catch (error) {
        console.error(`Erro ao conectar com o banco de dados: ${error}`);
    }
})();

module.exports = { pool };