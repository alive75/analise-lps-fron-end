const express = require('express');
const app = express();
const port = 3000;

// IMPORTANTE: Não usaremos NENHUM middleware de body-parser global (app.use).
// Vamos processar o corpo da requisição manualmente dentro da própria rota.

app.set('view engine', 'ejs');

let htmlContent = '<h2>Aguardando conteúdo do n8n...</h2>';

// Rota principal para exibir o HTML
app.get('/', (req, res) => {
    res.render('index', { htmlContent: htmlContent });
});

// Rota de Webhook para receber o HTML do n8n
app.post('/webhook', (req, res) => {
    // Verificamos se o header está correto, como boa prática.
    if (req.headers['content-type'] === 'text/html') {
        let bodyData = '';

        // Escutamos o evento 'data'. Ele é chamado sempre que um pedaço (chunk) de dados chega.
        req.on('data', (chunk) => {
            // Concatenamos os pedaços para montar o corpo completo.
            bodyData += chunk.toString();
        });

        // Escutamos o evento 'end'. Ele é chamado quando a requisição inteira foi recebida.
        req.on('end', () => {
            console.log('--- LEITURA MANUAL DO CORPO ---');
            console.log('CORPO FINAL RECEBIDO:', bodyData);
            console.log('---------------------------------');

            // Agora 'bodyData' contém o HTML puro, exatamente como foi enviado.
            htmlContent = bodyData;
            res.status(200).send('Conteúdo recebido manualmente com sucesso.');
        });

        // Lidamos com possíveis erros durante o recebimento dos dados.
        req.on('error', (err) => {
            console.error("Erro no stream da requisição:", err);
            res.status(500).send("Erro ao processar a requisição.");
        });

    } else {
        // Se o Content-Type não for o esperado, retornamos um erro.
        res.status(400).send('Content-Type incorreto. Esperado: text/html');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
