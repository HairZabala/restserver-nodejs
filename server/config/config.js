//======================
// Puerto
//======================
process.env.PORT = process.env.PORT || 3000;

//======================
// Entorno
//======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//======================
// BD
//======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://hair-zabala:NRXEgSusGP9oEmsT@cluster0-2m1np.mongodb.net/cafe';
}

process.env.URL_DB = urlDB;