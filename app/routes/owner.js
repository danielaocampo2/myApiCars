const express = require('express');
const OwnerCtrl = require('../controllers/OwnerController');
const routerU = express.Router();

//le vamos a dar al router algunas rutas //ejemplos
routerU.get('/showOwners', OwnerCtrl.index) // api.com/user/  #Index: listar todos los users
    .post('/', OwnerCtrl.create) // api.com/user/  #Create: crear un nuevo users
    //lo siguiente sera mandarle como un middleware prepararlo y se manda
    .post('/refreshToken', OwnerCtrl.refreshtoken) // api.com/user/  #Create: crear un nuevo users
    .get('/:key/:value', OwnerCtrl.find, OwnerCtrl.show) // api.com/user/category/Hogar #show: muestra un user en especifico
    .put('/:key/:value', OwnerCtrl.find, OwnerCtrl.update) // api.com/user/name/SamsungGalaxy #update : actualizar un user en especifico
    .delete('/:key/:value', OwnerCtrl.find, OwnerCtrl.remove) // api.com/user/name/SamsungGalaxy

module.exports = routerU;