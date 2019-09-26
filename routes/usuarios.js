let express = require('express');

let app = express();

let Usuario = require('../models/usuario');

//rutas

//===========================================
// Obtener todos los usuarios
//==========================================

app.get('/',(req,res,next)=>{


    Usuario.find({},'nombre email img role')
    .exec((err,Usuarios)=>{
        if(err){
            res.status(500).json({
                ok:false,
                mensaje:'Error en peticion a base de datos'
            });
        }else{
            console.log(Usuarios);
            res.status(200).json({
                ok:true,
                mensaje:'collecion de usuarios',
                Usuarios: Usuarios
            });
        }
    });
});

//===========================================
// Crear usuario
//===========================================


app.post('/', (req,res)=>{
    res.status(200).json({
        ok:true,
        mensaje:'collecion de usuarios',
        Usuarios: Usuarios
    });
});

module.exports = app;
