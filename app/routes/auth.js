const express = require('express');
const AuthCtrl = require('../controllers/AuthController')
const router = express.Router();

//le vamos a dar al router algunas rutas //ejemplos
router.post('/login', AuthCtrl.login)
    .post('/loginToken', AuthCtrl.loginToken)

module.exports = router;