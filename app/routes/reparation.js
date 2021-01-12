const express = require('express');
const ReparationCtrl = require('../controllers/ReparationController');
const routerR = express.Router();


routerR.get('/', ReparationCtrl.index) 
    .post('/create', ReparationCtrl.create) 
    .get('/placa/:value', ReparationCtrl.findPlaca)
    .put('/_id/:value', ReparationCtrl.find , ReparationCtrl.editReparation)
   
module.exports = routerR;