const express = require('express');
const app = express();
const port = 3000;

// O ÚNICO middleware necessário agora é o de JSON.
// Ele irá processar o corpo da requisição como um objeto JSON.
app.use(express.json());

// Configura o EJS como motor de visualização
app.set('view engine', 'ejs');

// Variável para armazenar o HTML recebido
let htmlContent = '<h2>Aguardando conteúdo JSON do n8n...</h2>';

// Rota principal para exibir o HTML
app.get('/', (req, res) => {
    res.render('index', { htmlContent: htmlContent });
});

// Rota de Webhook para receber o JSON do n8n
app.post('/webhook', (req, res) => {
    console.log('--- RECEBENDO REQUISIÇÃO JSON ---');
    console.log('CORPO DA REQUISIÇÃO (req.body):', req.body);

    // O HTML agora virá dentro de uma chave no objeto JSON
    if (req.body && req.body.html_content) {
        htmlContent = req.body.html_content;
        res.status(200).send({ message: 'HTML recebido com sucesso via JSON.' });
    } else {
        res.status(400).send({ error: 'Formato JSON incorreto. Chave "html_content" não encontrada.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
