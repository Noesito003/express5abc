
var express = require('express');
const { body, validationResult } = require('express-validator');
var router = express.Router();
const upload = require ('../libs/almacen');
const fs = require('fs-extra');
const path= require('path');
const mongoose = require("mongoose");
const Empleado = mongoose.model("Empleado");
//existen 2 maneras
// 1.
router.get('/',async function(req, res) {
  await Empleado.find((err,emp)=>{
    if(err){
  return res.send("No hay informacion")
    }
    res.send(emp);
  }).clone();
  });

// 2.
  router.get('/email/:email', async(req, res, next)=> {
    let emp = await Empleado.findOne({email:req.params.email})
    if(!emp){
    return res.status(402).send("Empleado no encontrado");
    }
    res.send({emp});
});

router.post('/login',
body('usuario').notEmpty().withMessage("no vacio"),
body('password').isStrongPassword({minLength:5,
                                  minLowercase:1,
                                minNumbers:1,
                              minSymbols:1,
                            minUppercase:1}).withMessage("Minimo 8 caracteres, /nMinimo 1 simbolo, /nMinimo 1 minuscula, /nMinimo 1 Mayuscula, /nMinimo 1 Numero")
,(req,res)=>{

  errores = validationResult(req);

  if(!errores.isEmpty()){
    return res.status(402).json({error: errores.array()});
  }

    res.send("Bienvenido al sistema");
});

module.exports = router;

//insertar sin imagen.
/* router.post('/',
body('codigo').isNumeric().withMessage(' Solo se admiten Numeros').notEmpty().withMessage('no vacio'),
body('nombre').isLength({min:5,max:15}),
body('sueldo').isNumeric(),
body('puesto').isLength({min:5})
,async(req,res)=>{

  errores = validationResult(req);

  if(!errores.isEmpty()){
    return res.status(402).json({error: errores.array()});
  }

    let emp_guardado= new Empleado({
      codigo:req.body.codigo,
      nombre:req.body.nombre,
      apellido:req.body.apellido,
      telefono:req.body.telefono,
      puesto:req.body.puesto,
      sueldo:req.body.sueldo,
      RFC:req.body.RFC,
      email:req.body.email,
    });

    await emp_guardado.save();

    res.status(201).send({emp_guardado});
}); */

router.post('/',upload.single('imagen'), async(req,res)=>{

    let emp_guardado= new Empleado({
      codigo:req.body.codigo,
      nombre:req.body.nombre,
      apellido:req.body.apellido,
      telefono:req.body.telefono,
      puesto:req.body.puesto,
      sueldo:req.body.sueldo,
      RFC:req.body.RFC,
      email:req.body.email,
    });

    if(req.file){
      const {filename} = req.file;
      emp_guardado.setimgurl(filename);
    }

    await emp_guardado.save();

    res.status(201).send({emp_guardado});
});

// router.put('/',
// body('codigo').isNumeric().withMessage(' Solo se admiten Numeros').notEmpty().withMessage('no vacio'),
// body('nombre').isLength({min:5,max:15}),
// body('sueldo').isNumeric(),
// body('puesto').isLength({min:5})
// ,async(req,res)=>{

//   errores = validationResult(req);

//   if(!errores.isEmpty()){
//     return res.status(402).json({error: errores.array()});
//   }

//   let emp = await Empleado.findOne({email: req.body.email});
//   if(!emp){
//     return res.status(402).send("Empleado no encontrado");
//   }

// let emp_modificado = await Empleado.findByIdAndUpdate(
//   {email: req.body.email},
//   {
//       codigo:req.body.codigo,
//       nombre:req.body.nombre,
//       apellido:req.body.apellido,
//       telefono:req.body.telefono,
//       puesto:req.body.puesto,
//       sueldo:req.body.sueldo,
//       RFC:req.body.RFC,
//     },
//     {
//       new:true
//     },
// );
//     res.status(201).send({emp_modificado});
// });

router.put('/',upload.single('imagen') ,async(req,res)=>{


  let emp = await Empleado.findOne({email: req.body.email});
  
  if(!emp){
    return res.status(402).send("Empleado no encontrado");
  }

  //http://localhost:3000/foto/imagen.png;
  let urlfotoanterior = emp.imgurl.split("/");
  //console.log(urlfotoanterior[4]);
  //obtiene la url de la imagen almacenada
  //agreagar a ingurl dicha url obtenida

  if(req.file) {
    const {filename} = req.file;
    emp.setimgurl(filename);
  }

  let emp_modificado = await Empleado.findOneAndUpdate(
    {email: req.body.email},
    {
        codigo:req.body.codigo,
        nombre:req.body.nombre,
        apellido:req.body.apellido,
        telefono:req.body.telefono,
        puesto:req.body.puesto,
        sueldo:req.body.sueldo,
        RFC:req.body.RFC,
        imgurl:emp.imgurl
      },

      {
        new:true
    },
  );
    await fs.unlink(path.resolve("almacen/img/"+urlfotoanterior[4]));
    res.send({emp_modificado});
});

router.delete('/borrar/:email', async(req,res)=> {
  let emp= await Empleado.findOne({email:req.params.email});
    if(!emp){
      return res.status(402).send("Empleado no encontrado");
     }
  
    let emp_eliminado = await Usuario.findOneAndDelete({email:req.params.email});
    res.send({emp_eliminado});
  });

module.exports = router;
