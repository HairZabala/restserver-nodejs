//======================
// Puerto
//======================
process.env.PORT = process.env.PORT || 3000;

//======================
// Entorno
//======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//======================
// Vencimiento del token
//======================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
// process.env.CADUCIDAD_TOKEN = 10;

//======================
// SEED de autenticidad
//======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ===============================
// Google Client ID
// ===============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '237661695143-vp2pkdmf0la6s0s7ee4mn44prut25p8b.apps.googleusercontent.com';

//======================
// BD
//======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;