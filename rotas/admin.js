const express = require('express');
const appAdmin = express();
const db = require('../banco/database');
const upload = require('../util/imagens');
 
 
//================== ROTAS DE LOGIN/INDEX ==================//
appAdmin.get('/index', (req, res) => {
    res.render('admin/index-admin');
});
 
appAdmin.get('/', (req, res) => {
    res.render('admin/login');
});
 
appAdmin.post('/login', (req, res) => {
    //algoritmo de autenticação do usuário - FUTURO
    res.redirect('/admin/index');
});
 
 
//================== ROTAS DE CATEGORIAS ==================//
appAdmin.get('/categorias', (req, res) => {
    db.all(
        'SELECT * FROM categorias', 
        [], 
        function (erro, categorias) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao consultar categorias.');
            }
            res.render('admin/categorias/lista', { categorias });
        }
    );
});
 
appAdmin.get('/categorias/form-cadastrar', (req, res) => {
    res.render('admin/categorias/cadastro');
});
 
appAdmin.post('/categorias/cadastrar', (req, res) => {
    const nome = req.body.nome;
    const descricao = req.body.descricao;

    db.run(
        `INSERT INTO categorias (nome, descricao) VALUES (?, ?)`,
        [nome, descricao],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao cadastrar categoria.');
            }
            res.redirect('/admin/categorias');
        }
    );
});

//ROTA PARA EXIBIR O FORMULÁRIO DE EDIÇÃO DE CATEGORIAS
appAdmin.get('/categorias/:id/form-editar', (req, res) => {
    const id = req.params.id;

    db.get(
        'SELECT * FROM categorias WHERE id = ?',
        [id],
        function (erro, categoria) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao consultar categoria.');
            }
            res.render('admin/categorias/editar', { categoria });
        }
    );
});

//ROTA PARA EDITAR A CATEGORIA
appAdmin.post('/categorias/:id/editar', (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const descricao = req.body.descricao;

    db.run(
        `UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?`,
        [nome, descricao, id],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao editar categoria.');
            }
            res.redirect('/admin/categorias');
        }
    );
});

//ROTA PARA EXCLUIR A CATEGORIA
appAdmin.get('/categorias/:id/excluir', (req, res) => {
    const id = req.params.id;

    db.run(
        'DELETE FROM categorias WHERE id = ?',
        [id],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao excluir categoria.');
            }
            res.redirect('/admin/categorias');
        }
    );
});

//================== ROTAS DE PRODUTOS ==================//
 
 
//ROTA PARA CONSULTAR TODOS OS PRODUTOS
appAdmin.get('/produtos', (req, res) => {
    db.all(
         'SELECT * FROM produtos', 
        [], 
        function (erro, produtos) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao consultar produtos.');
            }
            res.render('admin/produtos/lista', { produtos });
        }
    );
});
 
//ROTA PARA EXIBIR O FORMULÁRIO DE CADASTRO DE PRODUTOS
//Precisa consultar as categorias para popular o select do formulário
appAdmin.get('/produtos/form-cadastrar', (req, res) => {
    db.all(
        'SELECT * FROM categorias',
        [],
        function (erro, categorias) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao consultar categorias.');
            }
            res.render('admin/produtos/cadastro', { categorias });
        }
    );
});
 
//ROTA PARA CADASTRAR O PRODUTO
appAdmin.post('/produtos/cadastrar', upload.single('imagem'), (req, res) => {
    const imagem = req.file ? req.file.filename : null; // nome do arquivo enviado
    const nome = req.body.nome;
    const categoria = req.body.categoria;
    const valor = req.body.valor;
    const estoque = req.body.estoque;
    const descricao = req.body.descricao;

    db.run(
        `INSERT INTO produtos (nome, descricao, valor, categoria, imagem, estoque)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nome, descricao, valor, categoria, imagem, estoque],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao cadastrar produto.');
            }
            res.redirect('/admin/produtos');
        }
    );
});

//ROTA PARA EXIBIR O FORMULÁRIO DE EDIÇÃO DE PRODUTOS
appAdmin.get('/produtos/:id/form-editar', (req, res) => {
    const id = req.params.id;

    db.all(
        'SELECT * FROM categorias',
        [],
        function (erro, categorias) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao consultar categorias.');
            }

            db.get(
                'SELECT * FROM produtos WHERE id = ?',
                [id],
                function (erro, produto) {
                    if (erro) {
                        console.log(erro.message);
                        return res.send('Erro ao consultar produto.');
                    }
                    res.render('admin/produtos/editar', { produto, categorias });
                }
            );
        }
    );
});

//ROTA PARA EDITAR O PRODUTO
appAdmin.post('/produtos/:id/editar', upload.single('imagem'), (req, res) => {
    const id = req.params.id;
    const imagem = req.file ? req.file.filename : req.body.imagem_atual;
    const nome = req.body.nome;
    const categoria = req.body.categoria;
    const valor = req.body.valor;
    const estoque = req.body.estoque;
    const descricao = req.body.descricao;

    db.run(
        `UPDATE produtos SET nome = ?, descricao = ?, valor = ?, categoria = ?, imagem = ?, estoque = ?
         WHERE id = ?`,
        [nome, descricao, valor, categoria, imagem, estoque, id],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao editar produto.');
            }
            res.redirect('/admin/produtos');
        }
    );
});

//ROTA PARA EXCLUIR O PRODUTO
appAdmin.get('/produtos/:id/excluir', (req, res) => {
    const id = req.params.id;

    db.run(
        'DELETE FROM produtos WHERE id = ?',
        [id],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao excluir produto.');
            }
            res.redirect('/admin/produtos');
        }
    );
});
 
//================== ROTAS DE FLORES ==================//

//ROTA PARA CONSULTAR TODAS AS FLORES
appAdmin.get('/flores', (req, res) => {
    db.all(
        'SELECT * FROM flores',
        [],
        function (erro, flores) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao consultar flores.');
            }
            res.render('admin/flores/lista', { flores });
        }
    );
});

//ROTA PARA EXIBIR O FORMULÁRIO DE CADASTRO DE FLORES
appAdmin.get('/flores/form-cadastrar', (req, res) => {
    res.render('admin/flores/cadastro');
});

//ROTA PARA CADASTRAR A FLOR
appAdmin.post('/flores/cadastrar', upload.single('imagem'), (req, res) => {
    const imagem = req.file ? req.file.filename : null;
    const nome = req.body.nome;
    const especie = req.body.especie;
    const cor = req.body.cor;
    const valor = req.body.valor;
    const estoque = req.body.estoque;
    const descricao = req.body.descricao;
    const cuidados = req.body.cuidados;

    db.run(
        `INSERT INTO flores (nome, especie, cor, valor, estoque, descricao, cuidados, imagem)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nome, especie, cor, valor, estoque, descricao, cuidados, imagem],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao cadastrar flor.');
            }
            res.redirect('/admin/flores');
        }
    );
});

//ROTA PARA EXIBIR O FORMULÁRIO DE EDIÇÃO DE FLORES
appAdmin.get('/flores/:id/form-editar', (req, res) => {
    const id = req.params.id;

    db.get(
        'SELECT * FROM flores WHERE id = ?',
        [id],
        function (erro, flor) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao consultar flor.');
            }
            res.render('admin/flores/editar', { flor });
        }
    );
});

//ROTA PARA EDITAR A FLOR
appAdmin.post('/flores/:id/editar', upload.single('imagem'), (req, res) => {
    const id = req.params.id;
    const imagem = req.file ? req.file.filename : req.body.imagem_atual;
    const nome = req.body.nome;
    const especie = req.body.especie;
    const cor = req.body.cor;
    const valor = req.body.valor;
    const estoque = req.body.estoque;
    const descricao = req.body.descricao;
    const cuidados = req.body.cuidados;

    db.run(
        `UPDATE flores SET nome = ?, especie = ?, cor = ?, valor = ?, estoque = ?, descricao = ?, cuidados = ?, imagem = ? WHERE id = ?`,
        [nome, especie, cor, valor, estoque, descricao, cuidados, imagem, id],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao editar flor.');
            }
            res.redirect('/admin/flores');
        }
    );
});

//ROTA PARA EXCLUIR A FLOR
appAdmin.get('/flores/:id/excluir', (req, res) => {
    const id = req.params.id;

    db.run(
        'DELETE FROM flores WHERE id = ?',
        [id],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao excluir flor.');
            }
            res.redirect('/admin/flores');
        }
    );
});

//-----------------ROTAS DE FLORES DE VASO----------------//

//ROTA PARA CONSULTAR TODAS AS FLORES DE VASO
appAdmin.get('/flores-de-vaso', (req, res) => {
    db.all(
        'SELECT * FROM floresDeVaso',
        [],
        function (erro, floresDeVaso) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao consultar flores de vaso.');
            }
            res.render('admin/flores-de-vaso/lista', { floresDeVaso });
        }
    );
});

//ROTA PARA EXIBIR O FORMULÁRIO DE CADASTRO DE FLORES DE VASO
appAdmin.get('/flores-de-vaso/form-cadastrar', (req, res) => {
    res.render('admin/flores-de-vaso/cadastro');
});

//ROTA PARA CADASTRAR AS FLORES DE VASO
appAdmin.post('/flores-de-vaso/cadastrar', upload.single('imagem'), (req, res) => {
    const imagem = req.file ? req.file.filename : null;
    const nome = req.body.nome;
    const especie = req.body.especie;
    const cor = req.body.cor;
    const valor = req.body.valor;
    const estoque = req.body.estoque;
    const descricao = req.body.descricao;
    const cuidados = req.body.cuidados;

    db.run(
        `INSERT INTO floresDeVaso (nome, especie, cor, valor, estoque, descricao, cuidados, imagem)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nome, especie, cor, valor, estoque, descricao, cuidados, imagem],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao cadastrar flor de vaso.');
            }
            res.redirect('/admin/flores-de-vaso');
        }
    );
});

//ROTA PARA EXIBIR O FORMULÁRIO DE EDIÇÃO DE FLORES DE VASO
appAdmin.get('/flores-de-vaso/:id/form-editar', (req, res) => {
    const id = req.params.id;

    db.get(
        'SELECT * FROM floresDeVaso WHERE id = ?',
        [id],
        function (erro, flor) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao consultar flor de vaso.');
            }
            res.render('admin/flores-de-vaso/editar', { flor });
        }
    );
});

//ROTA PARA EDITAR AS FLORES DE VASO
appAdmin.post('/flores-de-vaso/:id/editar', upload.single('imagem'), (req, res) => {
    const id = req.params.id;
    const imagem = req.file ? req.file.filename : req.body.imagem_atual;
    const nome = req.body.nome;
    const especie = req.body.especie;
    const cor = req.body.cor;
    const valor = req.body.valor;
    const estoque = req.body.estoque;
    const descricao = req.body.descricao;
    const cuidados = req.body.cuidados;

    db.run(
        `UPDATE floresDeVaso SET nome = ?, especie = ?, cor = ?, valor = ?, estoque = ?, descricao = ?, cuidados = ?, imagem = ? WHERE id = ?`,
        [nome, especie, cor, valor, estoque, descricao, cuidados, imagem, id],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao editar a flor de vaso.');
            }
            res.redirect('/admin/flores-de-vaso');
        }
    );
});

//ROTA PARA EXCLUIR A FLOR DE VASO
appAdmin.get('/flores-de-vaso/:id/excluir', (req, res) => {
    const id = req.params.id;

    db.run(
        'DELETE FROM floresDeVaso WHERE id = ?',
        [id],
        function (erro) {
            if (erro) {
                console.log(erro.message);
                return res.send('Erro ao excluir flor de vaso.');
            }
            res.redirect('/admin/flores-de-vaso');
        }
    );
});

module.exports = appAdmin;
