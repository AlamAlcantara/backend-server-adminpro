let express = require('express');
const fileUpload = require('express-fileupload');

let app = express();
let fs = require('fs');

let Usuario = require('../models/usuario');
let Medico = require('../models/medico');
let Hospital = require('../models/hospital');


//default options
app.use(fileUpload());

//rutas
app.get('/',(req,res,next)=>{
    res.status(200).json({
        ok:true,
        mensaje:'peticion realizada correctamente'
    });
});

app.put('/:tipo/:id',(req,res,next)=>{

    let tipo = req.params.tipo;
    let id = req.params.id;

    //tipos de colecciones validos
    let tiposValidos = ['hospitales','usuarios','medicos'];

    //verificar que el tipo sea valido
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            mensaje:'el tipo de coleccion no es valido',
            errors:{message:`El tipo de coleccion ${tipo} no es valido`},
            coleccionesValidas : tiposValidos
        })
    }

    if(!req.files){
        return res.status(400).json({
            ok:false,
            mensaje:'No hay archivos seleccionados',
            errors:{message:'Debe seleccionar una imagen'}
        })
    } 

    //obtener nombre de la imagen
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.'); 
    let extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //extensiones aceptadas
    let extensionesValidas = ['png','jpg','gif','jpeg'];

    //si la extension del archivo no se encuentra en el arreglo de las extensiones validas
    if(extensionesValidas.indexOf(extensionArchivo) < 0){ 
        return res.status(400).json({
            ok:false,
            mensaje:'La extension del archivo no es valida',
            errors:{message:`Las extensiones validas son ${extensionesValidas.join(',')}`}
        })
    }

    //nuevo nombre para el archivo subido Ej: 123243242-1232.png
    let nuevoNombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //nuevo path del archivo
    let path = `./uploads/${tipo}/${nuevoNombreArchivo}`;

    //mover archivo
    archivo.mv(path,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'erro al tratar de guardar archivo en el servidor',
                errors:err
            })
        }
        subirPorTipo(tipo,id,nuevoNombreArchivo,res);
        // return res.status(200).json({
        //     ok:true,
        //     mensaje:'Archivo movido',
        //     nombreCortado: nombreCortado,
        //     extensionArchivo: extensionArchivo,
        //     nuevoNombreArchivo : nuevoNombreArchivo
        // })

    });

})


function subirPorTipo(tipoColeccion,id,nuevoNombreArchivo,res){

    if(tipoColeccion == 'usuarios'){

        Usuario.findById(id,(err,usuario)=>{

            let pathViejo =`./uploads/usuarios/${usuario.img}`;

            //para eliminar la imagen ya existente si el ususario ya posee una
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo); 
            }

            usuario.img = nuevoNombreArchivo;
            usuario.save((err,usuarioActualizado)=>{

                if(err){
                    return res.status(500).json({
                        ok:true,
                        mensaje:'Erro al actualizar imagen de usuario',
                        err: err  
                    })
                }

                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de usuario actualizada',
                    usuario: usuarioActualizado 
                })
            });

        });

    }

    if(tipoColeccion == 'medicos'){

        Medico.findById(id,(err,medico)=>{

            let pathViejo = `./uploads/medicos/${medico.img}`;

            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            medico.img = nuevoNombreArchivo;
            medico.save((err,medicoActualizado)=>{
                if(err){
                    return res.status(500).json({
                        ok:true,
                        mensaje:'Erro al actualizar imagen de medico',
                        err: err  
                    })
                }

                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de medico actualizada',
                    medico: medicoActualizado 
                })
            });
        });
    }

    if(tipoColeccion == 'hospitales'){

        Hospital.findById(id,(err,hospitalEncontrado)=>{

            let pathViejo = `./uploads/hospitales/${hospitalEncontrado.img}`;

            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            hospitalEncontrado.img = nuevoNombreArchivo;
            hospitalEncontrado.save((err,hospitalActualizado)=>{
                if(err){
                    return res.status(500).json({
                        ok:true,
                        mensaje:'Erro al actualizar imagen de hospital',
                        err: err  
                    })
                }

                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de hospital actualizada',
                    hospital: hospitalActualizado 
                })
            });

        });

    }


}

module.exports = app;
