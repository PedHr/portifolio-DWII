CREATE TABLE IF NOT EXISTS informacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeCompleto VARCHAR(255),
    tituloPortfolio VARCHAR(255),
    ocupacao VARCHAR(255),
    localizacao VARCHAR(255),
    introducaoTitulo VARCHAR(255),
    introducaoParagrafo1 TEXT,
    introducaoParagrafo2 TEXT,
    imagemPerfil VARCHAR(255),
    email VARCHAR(255),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    telefone VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS formacao_academica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    curso VARCHAR(255),
    instituicao VARCHAR(255),
    periodo VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS experiencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cargo VARCHAR(255),
    empresa VARCHAR(255),
    periodo VARCHAR(255),
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS habilidades_tecnicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    percentual INT
);

CREATE TABLE IF NOT EXISTS projetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    imagem_url VARCHAR(255),
    repo_url VARCHAR(255),
    demo_url VARCHAR(255)
);

INSERT INTO informacoes (nomeCompleto, tituloPortfolio, ocupacao, localizacao, introducaoTitulo, introducaoParagrafo1, introducaoParagrafo2, imagemPerfil, email, linkedin, github, telefone) VALUES
('Pedro Rosa', 'Portfólio', 'Desenvolvedor Back-End', 'São José dos Campos', 'Olá! Sou o Pedro', 'Sou um estudante de desenvolvimento de softwares multiplataforma na Fatec SJC.', 'Busco oportunidades para aplicar meus conhecimentos em desafios práticos e contribuir para o desenvolvimento de soluções criativas e eficientes.', '/images/pedro_img.jpg', 'pedrohe313131@gmail.com', 'https://www.linkedin.com/in/pedro-rosa-b66b70224/', 'https://github.com/PedHr', '(12) 98147-9880');

INSERT INTO formacao_academica (curso, instituicao, periodo) VALUES
('Desenvolvimento de Sistemas', 'Etec Ilza Nascimento Pintus', '2022 - 2023'),
('Desenvolvimento de software multiplataforma', 'Fatec SJC', '2024 - cursando');

INSERT INTO experiencias (cargo, empresa, periodo, descricao) VALUES
('Estagiário de Desenvolvimento', 'Equatorial Sistemas.', 'Setembro, 2024 - presente.', 'Desenvolvimento e manutenção de aplicações web utilizando Python, Linux embarcado e PyQT5.');

INSERT INTO habilidades_tecnicas (nome, percentual) VALUES
('Python', 90),
('PyQT5', 75),
('HTML5 & CSS3', 95),
('Banco de Dados (SQL & NoSQL)', 70),
('React & Next.js', 80);