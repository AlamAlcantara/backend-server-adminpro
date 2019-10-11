let express = require('express');
const fileUpload = require('express-fileupload');

let app = express();

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

        return res.status(200).json({
            ok:true,
            mensaje:'Archivo movido',
            nombreCortado: nombreCortado,
            extensionArchivo: extensionArchivo,
            nuevoNombreArchivo : nuevoNombreArchivo
        })

    });

})

module.exports = app;
