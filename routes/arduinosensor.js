const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { SerialPort } = require('serialport');

const { ReadlineParser } = require('@serialport/parser-readline');
const Sensor = mongoose.model('sensor');

const arduinoPort = "COM4";

const arduinoSerialPort = new SerialPort({ path: arduinoPort, baudRate: 115200});

const parser = arduinoSerialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

let valorDistancia="";

//rutas del metodo http
router.get('/', async (req,res)=> {
    parser.on('data', function(data,err){
        if(err) {
            return console.log(err)
        }
        console.log("valor:" + data);
        valorDistancia = data.toString('utf8');
    });
    res.send({valorDistancia});
});

router.get('/detener', async (req,res)=> {
    arduinoSerialPort.pause();
    res.send("cerrar");
});

router.post('/', async (req,res)=> {
    //let cod = await Sensor.find().count() + 1
    var distancia = new Sensor({
        fecha: req.body.fecha,
        hora: req.body.hora,
        //distancia: valorDistancia
        lectura: req.body.lectura
    });

    await distancia.save();
    res.status(201).send(distancia);
});

//apertura del puerto COM4

parser.on('open', function(err) {
    if(err) {
        return console.log(err);
    }
    console.log();
});

/* parser.on('data', function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("valor: "+ data);
    valorDistancia = data.toString('utf8');
}); */

arduinoSerialPort.on('error', function(err) {
    if(err) {
        return console.log(err);
    }
});

module.exports = router;


