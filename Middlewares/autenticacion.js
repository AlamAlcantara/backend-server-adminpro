let jwt = require('jsonwebtoken');
let SEED = require('../config/config').SEED;


//===========================================
// Validar token
//===========================================

module.exports.verificarToken = function(req,res,next){

    let token = req.query.token;

   jwt.verify(token,SEED,(err,decoded)=>{
       if(err){
          return res.status(401).json({ 
               ok:false, 
               mensaje:'token incorrecto',
               error:err
           });
       }
       
       req.usuario = decoded.usuario;
       next();
   });
};

//===========================================
// Validar ADMIN
//===========================================

module.exports.verificarAdmin = function(req,res,next){

    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
        return;
    }else{
        return res.status(401).json({ 
            ok:false, 
            mensaje:'token incorrecto',
            error: {mensaje:'No tiene los permisos para realizar la accion'}
        });
    }
};

//===========================================
// Validar ADMIN o Mismo Usuario
//===========================================

module.exports.verificarAdminOMismoUsuario = function(req,res,next){

    let usuario = req.usuario;
    let id = req.params.id;

    if(usuario.role === 'ADMIN_ROLE' || usuario._id === id){
        next();
        return;
    }else{
        return res.status(401).json({ 
            ok:false, 
            mensaje:'Token incorrecto',
            error: {mensaje:'No tiene los permisos para realizar la accion'}
        });
    }
};