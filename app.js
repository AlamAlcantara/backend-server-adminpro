//require
let express = require('express');
let mongoose = require('mongoose');

//variables
let app = express();


mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err,res)=>{

    if(err){
        console.log('ERROR EN LA BASE DE DATOS MONGODB');
        throw err;
    }

    console.log('MongoDB online');

} );


//rutas
app.get('/',(req,res,next)=>{
    res.status(403).json({
        ok:true,
        mensaje:'peticion realizada correctamente'
    });
});


//escuchar puerto
app.listen(3000,()=>{
    console.log('EXPRESS SERVER PUERTO 3000');
})