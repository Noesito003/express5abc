var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/datos', function(req, res ,next) {

  let usuario={
    nombre:"Angel",
    tel:"3344556677",
    ocupation:"Cajero",
    edad:23
  }


  res.send({usuario});
});

router.put('/', function(req, res, next) {
  res.send("Estoy Modificando");
})

router.post('/', function(req, res, next) {
  res.send("Estoy Guardando");
})

router.delete('/', function(req, res, next) {
  res.send("Estoy Borrando");
})

module.exports = router;
