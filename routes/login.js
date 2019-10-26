let express = require('express');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let SEED = require('../config/config').SEED;
let Usuario = require('../models/usuario');

let app = express();

//google
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

//rutas

//===========================================
// Autenticacion con Google
//===========================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {

    let token = req.body.token;
    let googleUser = await verify(token)
        .catch(e => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al auntenticarse con cuenta de google',
                errors: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al auntenticarse con cuenta de google',
                errors: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) { //Si la cuenta encontrada no fue auntenticada por google
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe auntenticarse con su cuenta normal'
                });
            } else {
                //crear token
                let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) //4 horas para expirar

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Credenciales correctas',
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            }
        } else { // el usuario no se encuentra en la base de datos

            //crear usuario
            var usuarioNuevo = new Usuario();
            usuarioNuevo.nombre = googleUser.name;
            usuarioNuevo.email = googleUser.email;
            usuarioNuevo.img = googleUser.img;
            usuarioNuevo.password = ':)';
            usuarioNuevo.google = true;

            usuarioNuevo.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al CrearCredenciales',
                        errors: err
                    });
                } else {
                    //crear token
                    let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas para expirar

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Credenciales creadas',
                        usuario: usuarioGuardado,
                        token: token,
                        userID: usuarioGuardado._id
                    });
                }
            });
        }
    });

    // res.status(200).json({
    //     ok:true,
    //     mensaje:'peticion al login de google correcta',
    //     googleUser: googleUser
    // });

});

//===========================================
// Autenticacion normal
//===========================================

app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioEncontrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al intentar hacer login',
                error: err
            });
        } else if (!usuarioEncontrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email'
            });
        } else if (!bcrypt.compareSync(body.password, usuarioEncontrado.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - contraseña'
            });
        } else {

            //crear token
            usuarioEncontrado.password = ';)';
            let token = jwt.sign({ usuario: usuarioEncontrado }, SEED, { expiresIn: 14400 }) //4 horas para expirar

            return res.status(200).json({
                ok: true,
                mensaje: 'Credenciales correctas',
                usuario: usuarioEncontrado,
                token: token
            });
        }
    });
});

module.exports = app;