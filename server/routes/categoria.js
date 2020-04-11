const express = require('express');
const Categoria = require('../models/categoria');

const { verificacionToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

// ===============================
// Obteniendo todas las categorias
// ===============================
app.get('/categoria', verificacionToken, (req, res) => {

    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort({ descripcion: 1 })
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, total) => {

                res.json({
                    ok: true,
                    categorias,
                    registros: total
                });

            });

        });
});

// ===============================
// Obtener categoria por ID
// ===============================
app.get('/categoria/:id', verificacionToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Categoria.populate(categoriaDB, { path: 'usuario', select: 'nombre email' }, (err, categoriaPop) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaPop
            });
        });

    })

});

// ===============================
// Creación de una nueva categoría.
// ===============================
app.post('/categoria', verificacionToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});


// ===============================
// Editar una categoria
// ===============================
app.put('/categoria/:id', verificacionToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


// ===============================
// Eliminar una categoria
// ===============================
app.delete('/categoria/:id', [verificacionToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria que intenta eliminar no existe.'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });

    });

});


module.exports = app;