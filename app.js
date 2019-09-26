//require
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

//variables
let app = express();

//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//importar rutas
let appRoutes = require('./routes/app');
let usuariosRoutes = require('./routes/usuarios');



//Conexion con mongodb
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err,res)=>{

    if(err){
        console.log('ERROR EN LA BASE DE DATOS MONGODB');
        throw err;
    }

    console.log('MongoDB online');

});


//rutas
app.use('/usuarios',usuariosRoutes);
app.use('/',appRoutes);

//escuchar puerto
app.listen(3000,()=>{
    console.log('EXPRESS SERVER PUERTO 3000');
})