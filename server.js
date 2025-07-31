const express = require('express');
const app = express();
const port = 3000;

// Middleware para analisar o corpo das solicitações
// CORRETO: O parser de texto específico vem PRIMEIRO
app.use(express.text({ type: 'text/html' }));
app.use(express.json());

// Configura o EJS como motor de visualização
app.set('view engine', 'ejs');

// Variável para armazenar o HTML recebido
let htmlContent = '<h2>Aguardando conteúdo do n8n...</h2>';

// Rota principal para exibir o HTML
app.get('/', (req, res) => {
    res.render('index', { htmlContent: htmlContent });
});

// Rota de Webhook para receber o HTML do n8n
app.post('/webhook', (req, res) => {
    // O n8n enviará o HTML no corpo da solicitação
    // Usamos 'req.body' pois o middleware 'express.text' irá processá-lo
    htmlContent = req.body;
    console.log("HTML recebido via webhook!");
    res.status(200).send('Conteúdo HTML recebido com sucesso!');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
