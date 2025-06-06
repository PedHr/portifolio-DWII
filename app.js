const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do EJS e arquivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fatec',
    database: 'pedro'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao MySQL!');
});

// Dados estáticos do portfólio
const dadosPortfolio = {
    geral: {
        nomeCompleto: "Pedro Rosa",
        tituloPortfolio: "Portfólio",
        ocupacao: "Desenvolvedor Back-End",
        localizacao: "São José dos Campos"
    },
    introducao: {
        titulo: "Olá! Sou o Pedro",
        paragrafo1: "Sou um estudante de desenvolvimento de softwares multiplataforma na Fatec SJC.",
        paragrafo2: "Busco oportunidades para aplicar meus conhecimentos em desafios práticos e contribuir para o desenvolvimento de soluções criativas e eficientes.",
        imagemPerfil: "/images/pedro_img.jpg"
    },
    curriculo: {
        titulo: "Minha Trajetória",
        formacaoAcademica: [
            { curso: "Desenvolvimento de Sistemas", instituicao: "Etec Ilza Nascimento Pintus", periodo: "2022 - 2023" },
            { curso: "Desenvilvimento de software multiplataforma", instituicao: "Fatec SJC", periodo: "2024 - cursando" }
        ],
        experiencias: [
            {
                cargo: "Estagiário de Desenvolvimento",
                empresa: "Equatorial Sistemas.",
                periodo: "Setembro, 2024 - presente.",
                descricao: "Desenvolvimento e manutenção de aplicações web utilizando Python, Linux embarcado e PyQT5."
            }
        ]
    },
    habilidades: {
        titulo: "Minhas Competências",
        tecnicas: [
            { nome: 'Python', nivel: 'Avançado', percentual: 90 },
            { nome: 'PyQT5', nivel: 'Avançado', percentual: 75 },
            { nome: 'HTML5 & CSS3', nivel: 'Avançado', percentual: 95 },
            { nome: 'Banco de Dados (SQL & NoSQL)', nivel: 'Intermediário', percentual: 70 },
            { nome: 'React & Next.js', nivel: 'Intermediário', percentual: 80 }
        ],
        softSkills: [
            "Comunicação Efetiva", "Trabalho em Equipe", "Resolução de Problemas",
            "Pensamento Crítico", "Adaptabilidade", "Proatividade"
        ]
    },
    contato: {
        titulo: "Entre em Contato",
        email: "pedrohe313131@gmail.com",
        linkedin: "https://www.linkedin.com/in/pedro-rosa-b66b70224/",
        github: "https://github.com/PedHr",
        telefone: "(12) 98147-9880"
    }
};

// Rotas frontend

app.get('/', (req, res) => {
    res.render('index', {
        pageTitle: `${dadosPortfolio.geral.nomeCompleto} | ${dadosPortfolio.geral.tituloPortfolio}`,
        dados: dadosPortfolio
    });
});

app.get('/projetos', (req, res) => {
    db.query('SELECT * FROM projetos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.render('projetos', {
            pageTitle: `Projetos | ${dadosPortfolio.geral.nomeCompleto}`,
            dados: dadosPortfolio,
            projetos: results
        });
    });
});

app.post('/projetos', (req, res) => {
    const { nome, descricao } = req.body;
    db.query('INSERT INTO projetos (nome, descricao) VALUES (?, ?)', [nome, descricao], err => {
        if (err) return res.status(500).send(err);
        res.redirect('/projetos');
    });
});

app.get('/projetos/:id/edit', (req, res) => {
    db.query('SELECT * FROM projetos WHERE id = ?', [req.params.id], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('Projeto não encontrado');
        res.render('editar-projeto', { projeto: result[0] });
    });
});

app.post('/projetos/:id', (req, res) => {
    const { nome, descricao } = req.body;
    db.query('UPDATE projetos SET nome = ?, descricao = ? WHERE id = ?', [nome, descricao, req.params.id], err => {
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

// Rotas para o thunder

app.get('/api/projetos', (req, res) => {
    db.query('SELECT * FROM projetos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.get('/api/projetos/:id', (req, res) => {
    db.query('SELECT * FROM projetos WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send({ mensagem: 'Projeto não encontrado' });
        res.json(result[0]);
    });
});

app.post('/api/projetos', (req, res) => {
    const { nome, descricao } = req.body;
    db.query('INSERT INTO projetos (nome, descricao) VALUES (?, ?)', [nome, descricao], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: result.insertId, nome, descricao });
    });
});

app.put('/api/projetos/:id', (req, res) => {
    const { nome, descricao } = req.body;
    db.query('UPDATE projetos SET nome = ?, descricao = ? WHERE id = ?', [nome, descricao, req.params.id], err => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Projeto atualizado com sucesso' });
    });
});

app.delete('/api/projetos/:id', (req, res) => {
    db.query('DELETE FROM projetos WHERE id = ?', [req.params.id], err => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Projeto excluído com sucesso' });
    });
});

// Iniciar projeto
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
