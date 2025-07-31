const express = require('express');
const app = express();
const port = 3000;

// --- DIAGNÓSTICO E CORREÇÃO ---
// Vamos remover o express.json() completamente por enquanto para forçar
// o express.text() a ser o único a processar o corpo da requisição.
// Isso elimina qualquer conflito de middleware.
app.use(express.text({ type: 'text/html' }));

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
    // --- LOGS PARA DIAGNÓSTICO ---
    // Vamos imprimir no console do Coolify exatamente o que estamos recebendo.
    console.log('--- NOVO WEBHOOK RECEBIDO ---');
    console.log('CABEÇALHOS (Headers):', JSON.stringify(req.headers, null, 2));
    console.log('CORPO BRUTO (req.body):', req.body);
    console.log('TIPO DO CORPO (typeof req.body):', typeof req.body);
    console.log('-----------------------------');

    // A variável 'req.body' já deve ser o texto HTML puro por causa do middleware
    htmlContent = req.body;

    res.status(200).send('Conteúdo HTML recebido e logado.');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
