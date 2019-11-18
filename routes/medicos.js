//imports
let express = require('express');
let Medico = require('../models/medico');
let mdAutenticacion = require('../Middlewares/autenticacion');

//Iinicializar variables
let app = express();

//rutas

//===========================================
// Obtener todos los medicos
//=========================================== 
app.get('/',(req,res,next)=>{

    let desde = req.query.desde;
    desde = Number(desde);

    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .populate('hospital','nombre')
    .exec((err,medicos)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al consultar medicos',
                error:err
            })
        }else{

            Medico.count({},(err,conteo)=>{
                return res.status(200).json({
                    ok:true,
                    mensaje:'Lista de medicos',
                    medicos:medicos,
                    total:conteo
                })
            });
        }
    });
    // res.status(200).json({
    //     ok:true,
    //     mensaje:'peticion get a hospitales'
    // });
});

//===========================================
// Crear Medico
//===========================================
app.post('/',mdAutenticacion.verificarToken ,(req,res,next)=>{
    let body = req.body;
    let _medico = new Medico({
        nombre:body.nombre,
        img:body.img,
        usuario:req.usuario._id,
        hospital: body.hospital
    });

    _medico.save((err,medicoCreado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'error al intentar crear medico',
                error:err
            });
        }else{
            return res.status(201).json({
                ok:true,
                mensaje:'Medico creado!',
                medicoCreado:medicoCreado,
                usuarioToken: req.usuario
            });
        }
    });
});

//===========================================
// Actualizar Medico
//===========================================

app.put('/:id',mdAutenticacion.verificarToken,(req,res)=>{

    let id =req.params.id;
    let body = req.body;

    Medico.findById(id,(err,medico)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar medico',
                error:err
            });
        }else if(!medico){
            return res.status(400).json({
                ok:false,
                mensaje:'medico no encontrado',
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err,medicoGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al actualizar medico',
                    error:err
                });
            }

            return res.status(200).json({
                ok:true,
                mensaje:'medico actualizado correctamente',
                medico: medicoGuardado
            });

        });
    });
});

//===========================================
// Eliminar Medico
//===========================================

app.delete('/:id',mdAutenticacion.verificarToken,(req,res)=>{

    let id = req.params.id; 
    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'error al borrar medico',
                error:err
            });
        }else if(!medicoBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'medico no encontrado',
            });
        }else{
            return res.status(200).json({
                ok:true,
                mensaje:`medico ${medicoBorrado.nombre} eliminado`,
                usuario: req.usuario
            });
        }
    });
});



module.exports = app;