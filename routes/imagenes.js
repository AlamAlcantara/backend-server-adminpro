let express = require('express');

let app = express();

const path = require('path');
const fs = require('fs');

//rutas
app.get('/:tipo/:img',(req,res,next)=>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    let imagePath = path.resolve(__dirname,`../uploads/${tipo}/${img}`);

    if(fs.existsSync(imagePath)){
        res.sendFile(imagePath);
        console.log('imagen existe');
    }else{
        let noImagePath = path.resolve(__dirname,'../assets/no-img.jpg');
        res.sendFile(noImagePath);
        console.log('imagen no existe');

    }
});

module.exports = app;
