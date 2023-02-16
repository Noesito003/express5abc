const mongoose = require('mongoose');


const UsuarioSchema = new mongoose.Schema({

    email:{
        type:String,
        require:true,
        unique:true
    },

/*     persona:[],
    persona1:[{
        nombre:{
            type:String,
            require:true
        },
        direccion:String,
        telefono:String,
        rfc:String,
        edad:number
    }],
    persona3:{
        nombre:{
        type:String,
        require:true    
    },
    direccion:String,
    telefono:String,
    rfc:String,
    edad:number}, */
    password:String,
    tipo: Number,
});

mongoose.model("Usuario", UsuarioSchema);