let express = require('express');
let Hospital = require('../models/hospital');
let Medico = require('../models/medico');
let Usuario = require('../models/usuario');


let app = express();

//rutas
app.get('/todo/:busqueda',(req,res,next)=>{

    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda,'i');

    Promise.all([
        cargarHospitales(busqueda,regex),
        cargarMedicos(busqueda,regex),
        cargarUsuarios(busqueda,regex)
    ])
    .then(resultados=>{
        res.status(200).json({
            ok:true,
            mensaje:'peticion a busqueda realizada correctamente',
            hospitales: resultados[0],
            medicos:resultados[1],
            usuarios:resultados[2]
        });
    })
});

function cargarHospitales(busqueda, regex){

    return new Promise((resolve,reject)=>{
        Hospital.find({nombre:regex})
        .populate('usuario','nombre email role')
        .exec((err,hospitales)=>{
            if(err){
                reject('error en la busqueda de hospitales',err);
            }else{
                resolve(hospitales);
            }
        });
    });
}


function cargarMedicos(busqueda, regex){

    return new Promise((resolve,reject)=>{
        Medico.find({nombre:regex})
            .populate('usuario','nombre email role')
            .populate('hospital')
            .exec((err,medicos)=>{
            if(err){
                reject('error en la busqueda y de medicos',err);
            }else{
                resolve(medicos);
            }
        });
    });
}

function cargarUsuarios(busqueda, regex){

    return new Promise((resolve,reject)=>{
        Usuario.find({},'nombre email role')
                .or([{'nombre':regex,'email':regex}])
                .exec((err,usuarios)=>{
                    if(err){
                        reject('Error en la busqueda de usuarios',err);
                    }else{
                        resolve(usuarios);
                    }
                });
    });
}

module.exports = app;
