//imports
let express = require('express');
let Hospital = require('../models/hospital');
let mdAutenticacion = require('../Middlewares/autenticacion')

//Inicialzar variables
let app = express();

//rutas

//===========================================
// Obtener todos los hospitales
//=========================================== 
app.get('/',(req,res,next)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .exec((err,hospitales)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al consultar hospitales',
                error:err
            })
        }else{
            Hospital.count({},(err,conteo)=>{
                return res.status(200).json({ 
                    ok:true,
                    mensaje:'Lista de hospitales',
                    hospitales:hospitales,
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
// Obtener hospital por ID
//=========================================== 

app.get('/:id',(req,resp,err)=>{
    // let token = req.params.token;
    let hospital_id = req.params.id;

    Hospital.findById(hospital_id)
    .populate('usuario','nombre img email')
    .exec((err,hospitalEncontrado)=>{
        if(err){
            return resp.status(500).json({
                ok:false,
                mensaje:'Error obteniendo hospital',
                error:err
            })
        }

        if(!hospitalEncontrado){
            return resp.status(400).json({
                ok:false,
                mensaje:`No se pudo encontrar el hospital con id: ${hospital_id}`,
                error:{message:`No existe hospital con id: ${hospital_id}`}
            })
        }

        return resp.status(200).json({
            ok:true,
            mensaje:'Hospital cargado exitosamente',
            hospital:hospitalEncontrado
        })
    })
});

//===========================================
// Crear Hospital
//===========================================
app.post('/',mdAutenticacion.verificarToken ,(req,res,next)=>{
    let body = req.body;
    let _hospital = new Hospital({
        nombre:body.nombre,
        img:body.img,
        usuario:req.usuario._id
    });

    _hospital.save((err,hospitalCreado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'error al intentar crear hospital',
                error:err
            });
        }else{
            return res.status(201).json({
                ok:true,
                mensaje:'Hospital creado!',
                hospitalCreado:hospitalCreado,
                usuarioToken: req.usuario
            });
        }
    });
});

//===========================================
// Actualizar Hospital
//===========================================

app.put('/:id',mdAutenticacion.verificarToken,(req,res)=>{

    let id =req.params.id;
    let body = req.body;

    Hospital.findById(id,(err,hospital)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar hospital',
                error:err
            });
        }else if(!hospital){
            return res.status(400).json({
                ok:false,
                mensaje:'Hospital no encontrado',
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario =req.usuario._id;

        hospital.save((err,hospitalGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al actualizar hospital',
                    error:err
                });
            }

            return res.status(200).json({
                ok:true,
                mensaje:'Hospital actualizado correctamente',
                hospital: hospitalGuardado
            });

        });
    });
});

//===========================================
// Eliminar Hospital
//===========================================

app.delete('/:id',mdAutenticacion.verificarToken,(req,res)=>{

    let id = req.params.id;
    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'error al borrar hospital',
                error:err
            });
        }else if(!hospitalBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'hospital no encontrado',
            });
        }else{
            return res.status(200).json({
                ok:true,
                mensaje:`Hospital ${hospitalBorrado.nombre} eliminado`,
                usuario: req.usuario
            });
        }
    });
});


module.exports = app;