const express = require('express');
const bodyParser = require('body-parser');
const User = require('./routes/user');
const Car = require('./routes/car');

const Auth = require('./routes/auth');
const Owner = require('./routes/owner');
const Reparation = require('./routes/reparation');
const AuthToken = require('./middleware/AuthToken')



const app = express();
const cors = require('cors');
app.use(cors());

var whitelist = ['https://danielaocampo2.github.io/JDPAutos/']
var corsOptions = {
        origin: function(origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    }
    //app.use(AuthToken); // antes d ecualquier ruta se ejecuta este 


//para poder manejar jsons, peticiones y respuestas 
app.use(bodyParser.json({ limit: '50mb' }));
//se dice que no utilizamos peticiones directamente en formularios, sino que se procesa en formato json
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

//para que pueda guardar imagenes ARRIBA SE PUSO 50mb para controlar el tamaño de imagen
app.use('/public', express.static(`${__dirname}/public/upload/`));
//`${__dirname}/public/upload/`
//(__dirname + "/public/upload")


// creo el path primero /user y ya lo que sigue de la , es el product que puede variar
app.use('/user', User, corsOptions);
app.use('/car', Car, corsOptions);
// crea el path /auth
app.use('/auth', Auth, corsOptions);
//crea el path owner
app.use('/owner', Owner, corsOptions);
//crea el path reparacion
app.use('/reparation', Reparation, corsOptions);



module.exports = app;