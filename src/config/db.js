const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: '10.87.169.20',
    user: 'vivian',
    password: 'MySQL1234',
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