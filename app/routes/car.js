const express = require('express');
const CarCtrl = require('../controllers/CarController');
const routerU = express.Router();

routerU.get('/', CarCtrl.index) // api.com/user/  #Index: listar todos los users
    .post('/create', CarCtrl.existsOwner, CarCtrl.create) // api.com/user/  #Create: crear un nuevo users
    //lo siguiente sera mandarle como un middleware prepararlo y se manda
    .get('/:key/:value', CarCtrl.find, CarCtrl.show) // api.com/user/category/Hogar #show: muestra un user en especifico
    .put('/:key/:value', CarCtrl.find, CarCtrl.update)

module.exports = routerU;