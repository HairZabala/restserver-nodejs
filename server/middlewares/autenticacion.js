const jwt = require('jsonwebtoken');

// ===============================
// Verificar token
// ===============================
let verificacionToken = (req, res, next) => {
    let authorization = req.get('Authorization');

    let token;
    if (authorization) {
        token = authorization.split(' ')[1];
    } else {
        token = null;
    }

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

}

// ===============================
// Verifica administrador role
// ===============================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;


    if (!(usuario.role === "ADMIN_ROLE")) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();

};

// ===============================
// Verificar token para imagenes
// ===============================
let verificacionTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

}

module.exports = {
    verificacionToken,
    verificaAdmin_Role,
    verificacionTokenImg
}