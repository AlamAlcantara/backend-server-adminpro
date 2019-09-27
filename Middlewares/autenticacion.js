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
