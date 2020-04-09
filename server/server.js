require('./config/config');
const express = require('express');
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Configuración global de rutas
app.use(require('./routes/index'));

let connectionBD = async() => {

    await mongoose.connect(process.env.URL_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (err) => {

        if (err) throw err;

        console.log(`Base de datos ONLINE`);

    });
}

connectionBD();


app.listen(process.env.PORT, () => console.log(`Escuchando peticiones en el puerto ${process.env.PORT}`));