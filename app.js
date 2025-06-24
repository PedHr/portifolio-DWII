const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do View Engine (EJS) e arquivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o Banco de Dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'pedro',
    password: 'pedro',
    database: 'pedro_port',
    multipleStatements: true // <-- ADICIONE ESTA LINHA

});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

// Middleware para carregar dados comuns a todas as páginas
const carregarDadosGerais = (req, res, next) => {
    db.query('SELECT * FROM informacoes WHERE id = 1', (err, results) => {
        if (err) return next(err);
        if (results.length > 0) {
            res.locals.dadosGerais = results[0];
        } else {
            res.locals.dadosGerais = {}; // Garante que não quebre se a tabela estiver vazia
        }
        next();
    });
};

app.use(carregarDadosGerais);

// --- ROTAS DO SITE (FRONT-END) ---

// Home Page (Índice)
app.get('/', (req, res) => {
    const query = `
        SELECT * FROM formacao_academica;
        SELECT * FROM experiencias;
        SELECT * FROM habilidades_tecnicas;
        SELECT * FROM projetos ORDER BY id DESC LIMIT 3;
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.render('index', {
            pageTitle: 'Home',
            formacao: results[0],
            experiencias: results[1],
            habilidades: results[2],
            projetos: results[3]
        });
    });
});

// Página de Projetos
app.get('/projetos', (req, res) => {
    db.query('SELECT * FROM projetos ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.render('projetos', {
            pageTitle: 'Projetos',
            projetos: results
        });
    });
});

// Página de Experiências
app.get('/experiencias', (req, res) => {
    db.query('SELECT * FROM experiencias ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.render('experiencias', {
            pageTitle: 'Experiências',
            experiencias: results
        });
    });
});

// Página de Habilidades
app.get('/habilidades', (req, res) => {
    db.query('SELECT * FROM habilidades_tecnicas ORDER BY percentual DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.render('habilidades', {
            pageTitle: 'Habilidades',
            habilidades: results
        });
    });
});


// --- ROTAS DE GERENCIAMENTO (CRUD PARA O FRONT-END) ---

// PROJETOS
app.post('/projetos', (req, res) => {
    const { nome, descricao, imagem_url, repo_url, demo_url } = req.body;
    const query = 'INSERT INTO projetos (nome, descricao, imagem_url, repo_url, demo_url) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nome, descricao, imagem_url, repo_url, demo_url], err => {
        if (err) return res.status(500).send(err);
        res.redirect('/projetos');
    });
});

app.get('/projetos/:id/edit', (req, res) => {
    db.query('SELECT * FROM projetos WHERE id = ?', [req.params.id], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('Projeto não encontrado');
        res.render('editar-projeto', { pageTitle: 'Editar Projeto', projeto: result[0] });
    });
});

app.post('/projetos/:id/edit', (req, res) => {
    const { nome, descricao, imagem_url, repo_url, demo_url } = req.body;
    const query = 'UPDATE projetos SET nome = ?, descricao = ?, imagem_url = ?, repo_url = ?, demo_url = ? WHERE id = ?';
    db.query(query, [nome, descricao, imagem_url, repo_url, demo_url, req.params.id], err => {
        if (err) return res.status(500).send(err);
        res.redirect('/projetos');
    });
});

app.post('/projetos/:id/delete', (req, res) => {
    db.query('DELETE FROM projetos WHERE id = ?', [req.params.id], err => {
        if (err) return res.status(500).send(err);
        res.redirect('/projetos');
    });
});

// EXPERIÊNCIAS
app.post('/experiencias', (req, res) => {
    const { cargo, empresa, periodo, descricao } = req.body;
    const query = 'INSERT INTO experiencias (cargo, empresa, periodo, descricao) VALUES (?, ?, ?, ?)';
    db.query(query, [cargo, empresa, periodo, descricao], err => {
        if (err) return res.status(500).send(err);
        res.redirect('/experiencias');
    });
});

app.get('/experiencias/:id/edit', (req, res) => {
    db.query('SELECT * FROM experiencias WHERE id = ?', [req.params.id], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('Experiência não encontrada');
        res.render('editar-experiencia', { pageTitle: 'Editar Experiência', experiencia: result[0] });
    });
});

app.post('/experiencias/:id/edit', (req, res) => {
    const { cargo, empresa, periodo, descricao } = req.body;
    const query = 'UPDATE experiencias SET cargo = ?, empresa = ?, periodo = ?, descricao = ? WHERE id = ?';
    db.query(query, [cargo, empresa, periodo, descricao, req.params.id], err => {
        if (err) return res.status(500).send(err);
        res.redirect('/experiencias');
    });
});

app.post('/experiencias/:id/delete', (req, res) => {
    db.query('DELETE FROM experiencias WHERE id = ?', [req.params.id], err => {
        if (err) return res.status(500).send(err);
        res.redirect('/experiencias');
    });
});

// HABILIDADES
app.post('/habilidades', (req, res) => {
    const { nome, percentual } = req.body;
    const query = 'INSERT INTO habilidades_tecnicas (nome, percentual) VALUES (?, ?)';
    db.query(query, [nome, percentual], err => {
        if (err) return res.status(500).send(err);
        res.redirect('/habilidades');
    });
});

app.get('/habilidades/:id/edit', (req, res) => {
    db.query('SELECT * FROM habilidades_tecnicas WHERE id = ?', [req.params.id], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('Habilidade não encontrada');
        res.render('editar-habilidade', { pageTitle: 'Editar Habilidade', habilidade: result[0] });
    });
});

app.post('/habilidades/:id/edit', (req, res) => {
    const { nome, percentual } = req.body;
    const query = 'UPDATE habilidades_tecnicas SET nome = ?, percentual = ? WHERE id = ?';
    db.query(query, [nome, percentual, req.params.id], err => {
        if (err) return res.status(500).send(err);
        res.redirect('/habilidades');
    });
});

app.post('/habilidades/:id/delete', (req, res) => {
    db.query('DELETE FROM habilidades_tecnicas WHERE id = ?', [req.params.id], err => {
        if (err) return res.status(500).send(err);
        res.redirect('/habilidades');
    });
});


// --- ROTAS DA API (PARA CLIENTES EXTERNOS COMO THUNDER CLIENT) ---

// API - Projetos
app.get('/api/projetos', (req, res) => {
    db.query('SELECT * FROM projetos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/projetos/:id', (req, res) => {
    db.query('SELECT * FROM projetos WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ mensagem: 'Projeto não encontrado' });
        res.json(result[0]);
    });
});

app.post('/api/projetos', (req, res) => {
    const { nome, descricao } = req.body;
    if (!nome || !descricao) return res.status(400).json({ mensagem: 'Nome e descrição são obrigatórios' });
    db.query('INSERT INTO projetos (nome, descricao) VALUES (?, ?)', [nome, descricao], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nome, descricao });
    });
});

app.put('/api/projetos/:id', (req, res) => {
    const { nome, descricao } = req.body;
    if (!nome || !descricao) return res.status(400).json({ mensagem: 'Nome e descrição são obrigatórios' });
    db.query('UPDATE projetos SET nome = ?, descricao = ? WHERE id = ?', [nome, descricao, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Projeto não encontrado' });
        res.json({ mensagem: 'Projeto atualizado com sucesso' });
    });
});

app.delete('/api/projetos/:id', (req, res) => {
    db.query('DELETE FROM projetos WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Projeto não encontrado' });
        res.json({ mensagem: 'Projeto excluído com sucesso' });
    });
});

// Adicione aqui as rotas de API para HABILIDADES e EXPERIÊNCIAS seguindo o mesmo padrão dos projetos.

// Iniciar Servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});