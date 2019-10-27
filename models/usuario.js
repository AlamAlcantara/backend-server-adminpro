let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = { 
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: ' {VALUE} no es rol permitido'
};

let usuarioSchema = new Schema({
    nombre : { type: String, required:[true, 'El nombre es necesario'] },
    email : { type: String, required:[true, 'El correo es necesario'], unique:true },
    password : { type: String, required:[true, 'El nombre es necesario'] },
    img : { type: String, required:false },
    role : { type: String, required:true, default:'USER_ROLE', enum:rolesValidos},
    google : {type:Boolean, default:false}
});

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe ser unico'}); 

module.exports =  mongoose.model('Usuario',usuarioSchema);