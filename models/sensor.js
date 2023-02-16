const mongoose = require('mongoose');

const sensorChema = new mongoose.Schema({
    lectura:String,
    fecha:String,
    hora:String
})

mongoose.model('sensor', sensorChema);