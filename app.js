var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://noesito:noesito123@cluster0.3l4fqy0.mongodb.net/angular5abc?retryWrites=true&w=majority");

//lista de modelos (Schema)
require('./models/sensor');
require("./models/usuario");
require("./models/empleado");

//listado de archivos de ruta
var indexRouter = require('./routes/index');
var usuarioRouter = require('./routes/usuarios');
var empleadoRouter = require('./routes/empleados');
var productoRouter = require('./routes/productos');
var arduinosensorRouter = require("./routes/arduinosensor");


var app = express();

app.use(cors({
  "origin": "*",
  "methods": "GET,PUT,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/foto',express.static(__dirname+'/almacen/img'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/usuario', usuarioRouter);
app.use('/empleado', empleadoRouter);
app.use('/producto', productoRouter);
app.use('/sensor',arduinosensorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
