let express = require('express');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let app = express();

let Usuario = require('../models/usuario');
 //rutas

 //===========================================
// Obtener todos los usuarios
//==========================================

app.post('/',(req,res)=>{

    let body = req.body;

    Usuario.findOne({email: body.email},(err,usuarioEncontrado)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al intentar hacer login',
                error:err
            });
        }else if(!usuarioEncontrado){
            return res.status(400).json({
                ok:false,
                mensaje:'Credenciales incorrectas - email'
            });
        }else if( !bcrypt.compareSync(body.password,usuarioEncontrado.password) ){
            return res.status(400).json({
                ok:false,
                mensaje:'Credenciales incorrectas - contraseña'
            });
        }else{

            //crear token
            usuarioEncontrado.password = ';)';
            let token = jwt.sign({usuario: usuarioEncontrado},'@este-es@un-seed@dificil-de-decifrat',{expiresIn:14400}) //4 horas para expirar

            return res.status(200).json({
                ok:true,
                mensaje:'Credenciales correctas',
                usuario: usuarioEncontrado,
                token: token 
            });
        }
    });
}); 

module.exports = app;