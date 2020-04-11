const express = require('express');
const Producto = require('../models/producto');
const _ = require('underscore');

const { verificacionToken } = require('../middlewares/autenticacion');

const app = express();

// ===============================
// Obtener todos los productos paginados 
// ===============================
app.get('/productos', verificacionToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limit = Number(req.query.limit) || 5;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, total) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos,
                    registros: total
                });
            })
        });

});

// ===============================
// Obtener un producto por ID 
// ===============================
app.get('/productos/:id', verificacionToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let opts = [{
            path: 'usuario',
            select: 'nombre email'
        }, {
            path: 'categoria',
            select: 'descripcion'
        }]

        Producto.populate(productoDB, opts, (err, productoPop) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoPop
            });

        })
    });

});

// ===============================
// Buscar productos
// ===============================
app.get('/productos/buscar/:termino', verificacionToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ nombre: regex }, (err, total) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos,
                    registros: total
                });
            });

        });
});

// ===============================
// Crear un nuevo producto
// ===============================
app.post('/productos', verificacionToken, (req, res) => {

    let body = req.body;

    // let categoria = 

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let opts = [{
            path: 'usuario',
            select: 'nombre email'
        }, {
            path: 'categoria',
            select: 'descripcion'
        }]

        Producto.populate(productoDB, opts, (err, productoPop) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoPop
            });
        });


    });

});

// ===============================
// Editar un producto
// ===============================
app.put('/productos/:id', verificacionToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let opts = [{
            path: 'usuario',
            select: 'nombre email'
        }, {
            path: 'categoria',
            select: 'descripcion'
        }]

        Producto.populate(productoDB, opts, (err, productoPop) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoPop
            });
        });

    });

});

// ===============================
// Eliminar un producto (cambiar el estado de disponible) 
// ===============================
app.delete('/productos/:id', verificacionToken, (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: "Producto elminado exitosamente!"
        });
    });

});

module.exports = app;