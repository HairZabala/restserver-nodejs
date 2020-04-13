const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const path = require('path');
const fs = require('fs');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['usuarios', 'productos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos de archivos permitidos son: ' + tiposValidos.join(', '),
            }
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se seleccionó ningún archivo!'
                }
            });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    let extensiones = ['jpg', 'jpeg', 'png', 'gif'];


    if (extensiones.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones de archivos permitidos son: ' + extensiones.join(', '),
                ext: extension
            }
        });
    }

    let now = new Date();

    let nombreArchivo = `${id}-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,"0")}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        switch (tipo) {
            case 'usuarios':
                imagenUsuarios(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProductos(id, res, nombreArchivo);
                break;
        }
        // res.json({
        //     ok: true,
        //     message: 'Archivo cargado exitosamente!'
        // });

    });
});

let imagenUsuarios = (id, res, nombreArchivo) => {


    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo('usuarios', nombreArchivo);
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!usuarioDB) {
            borrarArchivo('usuarios', nombreArchivo);
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'El ID del usario es invalido.'
                    }
                });
        }

        borrarArchivo('usuarios', usuarioDB.img);

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
    });

}

let imagenProductos = (id, res, nombreArchivo) => {


    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo('productos', nombreArchivo);
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!productoDB) {
            borrarArchivo('productos', nombreArchivo);
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'El ID del producto es invalido.'
                    }
                });
        }

        borrarArchivo('productos', productoDB.img);

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            res.json({
                ok: true,
                usuario: productoGuardado
            });

        });
    });

}

let borrarArchivo = (tipo, nombreArchivo) => {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;