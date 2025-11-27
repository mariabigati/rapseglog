const express = require('express');
const app = express();
const PORT = 8000;

const { router } = require('./src/routes/routes');

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Servidor respondendo na porta ${PORT}`)
})