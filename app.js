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
let loginRoutes = require('./routes/login');
let hospitalRoutes = require('./routes/hospitales');
let medicoRoutes = require('./routes/medicos');
let busquedaRoutes = require('./routes/busqueda');
let uploadRoutes = require('./routes/upload');
let imagenesRoutes = require('./routes/imagenes');


//Conexion con mongodb
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err,res)=>{
    if(err){
        console.log('ERROR EN LA BASE DE DATOS MONGODB');
        throw err;
    }
    console.log('MongoDB online');
});

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//rutas
app.use('/login',loginRoutes);
app.use('/usuarios',usuariosRoutes);
app.use('/hospitales',hospitalRoutes);
app.use('/medicos',medicoRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/upload',uploadRoutes);
app.use('/imagenes',imagenesRoutes);
app.use('/',appRoutes);

//escuchar puerto
app.listen(3000,()=>{
    console.log('EXPRESS SERVER PUERTO 3000');
})