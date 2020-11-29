const express = require('express');
const bodyParser = require('body-parser');
const Product = require('./routes/product');
const User = require('./routes/user');
const Auth = require('./routes/auth');
const Owner = require('./routes/owner');
const AuthToken = require('./middleware/AuthToken')

const app = express();
const cors = require('cors');
app.use(cors());

//app.use(AuthToken); // antes d ecualquier ruta se ejecuta este 


//para poder manejar jsons, peticiones y respuestas 
app.use(bodyParser.json({limit: '50mb'}));
//se dice que no utilizamos peticiones directamente en formularios, sino que se procesa en formato json
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

//para que pueda guardar imagenes ARRIBA SE PUSO 50mb para controlar el tamaño de imagen
app.use("/public/upload", express.static(__dirname + "app/public/upload"));



/// creo el path primero /product y ya lo que sigue de la , es el product que puede variar
app.use('/product', Product);
// creo el path primero /user y ya lo que sigue de la , es el product que puede variar
app.use('/user', User);
// crea el path /auth
app.use('/auth', Auth);
//crea el path owner
app.use('/owner', Owner);


module.exports = app;