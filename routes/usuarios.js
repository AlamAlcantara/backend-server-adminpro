let express = require('express');
let Usuario = require('../models/usuario');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let mdAutenticacion = require('../Middlewares/autenticacion');

let app = express();
//rutas

//===========================================
// Obtener todos los usuarios
//==========================================

app.get('/',(req,res,next)=>{


    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({},'nombre email img role')
    .skip(desde)
    .limit(5)
    .exec((err,Usuarios)=>{
        if(err){
            res.status(500).json({
                ok:false,
                mensaje:'Error en peticion a base de datos'
            });
        }else{
            // console.log(Usuarios);
            Usuario.count({},(err,conteo)=>{
                res.status(200).json({
                    ok:true,
                    mensaje:'collecion de usuarios',
                    Usuarios: Usuarios,
                    total:conteo
                });
            });
        }
    });
});

//===========================================
// Actualizar usuario
//===========================================

app.put('/:id',mdAutenticacion.verificarToken,(req,res)=>{
    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err,usuario)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'error al buscar usuario',
                error:err
            });
        }else if(!usuario){
            return res.status(400).json({
                ok:false,
                mensaje:'usuario no encontrado'
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err,usuarioGuardado)=>{

            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'error al actualizar usuario',
                    error:err
                });
            }

            usuario.password = ';)';
            return res.status(200).json({
                ok:true,
                mensaje:'Usuario actualizado correctamente',
                usuario:usuarioGuardado
            });

        });

    });
});


//===========================================
// Crear usuario
//===========================================
app.post('/',(req,res)=>{

    let _body = req.body;
    let usuario = new Usuario({
        nombre: _body.nombre,
        email: _body.email,
        password: bcrypt.hashSync(_body.password,10 ),
        img: _body.img,
        role: _body.role
    });
     
    usuario.save( (err, usuarioGuardado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'error al crear usuario',
                error: err
            });
        }

        res.status(201).json({
            ok:true,
            mensaje:'usuario creado! ',
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        }); 
    });
});


//===========================================
// Eliminar usuario
//===========================================

app.delete('/:id',mdAutenticacion.verificarToken, (req,res)=>{

    let id = req.params.id;

    Usuario.findByIdAndRemove(id,  (err,usuarioBorrado)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al borrar usuario',
                error:err
            });
        }else if(usuarioBorrado){
            return res.status(200).json({
                ok:true,
                mensaje:`${usuarioBorrado.nombre} eliminado`,
                usuario: usuarioBorrado
            });
        }else{
            return res.status(400).json({
                ok:false,
                mensaje:'usuario no encontrado'
            });
        }
    });
});

module.exports = app;
