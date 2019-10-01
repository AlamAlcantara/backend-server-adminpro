let express = require('express');
const fileUpload = require('express-fileupload');

let app = express();

//rutas
app.get('/',(req,res,next)=>{
    res.status(200).json({
        ok:true,
        mensaje:'peticion realizada correctamente'
    });
});

app.put('/',(req,res,next)=>{

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

    return res.status(200).json({
        ok:true,
        mensaje:'peticion correcta',
        nombreCortado: nombreCortado
    })
})

module.exports = app;
