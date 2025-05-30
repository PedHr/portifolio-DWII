const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Define a porta do servidor

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

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
            { cargo: "Estagiário de Desenvolvimento", empresa: "Equatorial Sistemas.", periodo: "Setembro, 2024 - presente.", descricao: "Desenvolvimento e manutenção de aplicações web utilizando Python, Linux embarcado e PyQT5."}
        ]
    },
    habilidades: {
        titulo: "Minhas Competências",
        tecnicas: [
            { nome: "JavaScript", nivel: "Intermediário" },
            { nome: "Node.js & Express", nivel: "Intermediário" },
            { nome: "React & Next.js", nivel: "Intermediário" },
            { nome: "Python", nivel: "Avançado" },
            { nome: "HTML5 & CSS3", nivel: "Avançado" },
            { nome: "SQL & NoSQL (MongoDB)", nivel: "Intermediário" },
            { nome: "Git & GitHub", nivel: "Avançado" },
            { nome: "Docker", nivel: "Básico" }
        ],
        softSkills: ["Comunicação Efetiva", "Trabalho em Equipe", "Resolução de Problemas", "Pensamento Crítico", "Adaptabilidade", "Proatividade"]
    },
    contato: {
        titulo: "Entre em Contato",
        email: "pedrohe313131@gmail.com",
        linkedin: "https://www.linkedin.com/in/pedro-rosa-b66b70224/",
        github: "https://github.com/PedHr",
        telefone: "(12) 98147-9880"
    }
};

app.get('/', (req, res) => {
    // Renderiza 'index.ejs' e passa os dados para o template
    res.render('index', {
        pageTitle: `${dadosPortfolio.geral.nomeCompleto} | ${dadosPortfolio.geral.tituloPortfolio}`,
        dados: dadosPortfolio
    });
});

app.get('/projetos', (req, res) => {
    // Renderiza 'projetos.ejs' e passa os dados para o template
    res.render('projetos', {
        pageTitle: `Projetos | ${dadosPortfolio.geral.nomeCompleto}`,
        dados: dadosPortfolio
    });
});

app.get('/projetos/:id', (req, res) => {
    const projetoId = req.params.id;
    const projeto = dadosPortfolio.projetos.find(p => p.id === projetoId);

    if (projeto) {
        res.render('projeto-detalhe', { // Você precisará criar este arquivo EJS: views/projeto-detalhe.ejs
            pageTitle: `${projeto.nome} | ${dadosPortfolio.geral.nomeCompleto}`,
            projeto: projeto,
            dados: dadosPortfolio
        });
    } else {
        res.status(404).send('Projeto não encontrado');
    }
});



app.listen(port, () => {
    console.log(`Servidor do portfólio rodando em http://localhost:${port}`);
});
