const express = require('express');
const ReparationCtrl = require('../controllers/ReparationController');
const routerR = express.Router();


routerR.get('/', ReparationCtrl.index) 
    .post('/create', ReparationCtrl.existePlaca, ReparationCtrl.create) 
    .get('/placa/:value', ReparationCtrl.findPorPlaca)
    .get('/onplaca/:value', ReparationCtrl.findPorPlacaActivos)
    .put('/_id/:value', ReparationCtrl.find , ReparationCtrl.editReparation)
    .delete('/delete/:value', ReparationCtrl.find, ReparationCtrl.remove)
   
module.exports = routerR;