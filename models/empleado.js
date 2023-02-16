const mongoose = require('mongoose');

const EmpleadoSchema = new mongoose.Schema({

    codigo:String,
    nombre:String,
    apellido:String,
    direccion: String,
    telefono:String,
    fecha_nac:Date,
    puesto:String,
    sueldo: Number,
    NSS: String,
    RFC: String,
    email: String,
    imgurl:String
    
});

EmpleadoSchema.methods.setimgurl = function setimgurl(imagen){
    this.imgurl = "http://localhost:3000/foto/"+imagen;
}

mongoose.model("Empleado", EmpleadoSchema);