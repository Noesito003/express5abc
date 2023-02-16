var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
//libreria de mongoose para manipular los datos
const mongoose = require("mongoose");
const {body, validationResult}= require ('express-validator');

//referencia al schema para usarlo en las rutas de aprest
const Usuario = mongoose.model("Usuario");

/* GET users listing. */
router.get('/', async (req,res)=> {
  await Usuario.find((err,usu)=>{
  if(err){
return res.send("No hay informacion")
  }
  res.send(usu);
}).clone();
});

//consultar un solo documneto
router.get('/dato/:usu', async (req,res)=> {
  let email = await Usuario.findOne({email:req.params.usu})
  if(!email){
  return res.status(402).send("Usuario no encontrado");
  }
  res.send({email});
});

//guardar
router.post('/', async (req,res)=> {
  let salt = await bcrypt.genSalt(10);
  let pass = await bcrypt.hash(req.body.password,salt);
  let usu = new Usuario({
    email:req.body.email,
    password:pass,
    tipo: req.body.tipo
  });

  await usu.save();

  res.send({usu});
});

//modificar
router.put('/', async (req,res)=> {
let usu = await Usuario.findOne({email: req.body.email});
  if(!usu){
    return res.status(402).send("Usuario no encontrado");
  }
  let salt = await bcrypt.genSalt(10);
  let pass = await bcrypt.hash(req.body.password,salt);
  let usu_modificado = await Usuario.findOneAndUpdate(
    //lo que se busca
    {email: req.body.email},
    //lo que se modifica
    {
      password:pass,
      tipo: req.body.tipo,
    },
    //retorno si es true objeto modificado, false objeto antes de la modificacion
    {
      new: true 
    });

  res.send({usu_modificado});
});

//eliminar
router.delete('/:usu', async(req,res)=> {
let usu = await Usuario.findOne({email:req.params.usu});
  if(!usu){
    return res.status(402).send("Usuario no encontrado");
   }

  let usu_eliminado = await Usuario.findOneAndDelete({email:req.params.usu});
  res.send({usu_eliminado});
});


//Inicio de sesion
router.post('/Login',
 body('email').isEmail().withMessage("Introduce un Email Valido."),
 body('password').isStrongPassword({minLength:8,
                                      minLowercase:1,
                                        minNumbers:1,
                                        minSymbols:1,
                                          minUppercase:1}).withMessage("La Contraseña debe tener: \nMinimo 8 caracteres, \nMinimo 1 simbolo, \nMinimo 1 minuscula, \nMinimo 1 Mayuscula, \nMinimo 1 Numero"),
  async (req,res)=> {
    let errores = validationResult(req);

    if(!errores.isEmpty()){
      return res.status(402).json({error: errores.array()});
    }

  let usu = await Usuario.findOne({email:req.body.email});

  if(!usu){
    return res.status(402).send("Usuario o contraseña incorrecto");
  }

  // if(usu.password != req.body.password)
  if(!await bcrypt.compare(req.body.password, usu.password)){
    return res.status(402).send("Usuario o contraseña incorrecto");
  }

  res.send({usu});
  
});


//eliminar con metodo post
router.post('/borrar', async(req,res)=> {
  let usu = await Usuario.findOne({email:req.body.usu});
    if(!usu){
      return res.status(402).send("Usuario no encontrado");
     }
  
    let usu_eliminado = await Usuario.findOneAndDelete({email:req.body.usu});
    res.send(usu_eliminado);
  });

module.exports = router;
