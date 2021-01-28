const User = require('../models/User');
const Owner = require('../models/Owner');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');
//el ciente me pasa por post
//username
//password

function login(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email }).then(user => { // se puede solo username
        if (!user) res.status(404).send({ message: "El usuario no existe" });
        //si existe, hago mi logica de login
        bcrypt.compare(password, user.password)
            .then(match => {
                if (match) {
                    if (user.status == 1) {
                        payload = { //se debe meter fecha de entrega
                            email: user.email,
                            name: user.name,
                            _id: user._id,
                            id_user: user.id_user,
                            role: user.role
                        }
                        //acceso con web token npm i jsonwebtoken
                        jwt.sign(payload, CONFIG.SECRET_TOKEN, function (error, token) {
                            if (error) {
                                res.status(500).send({ error });
                            } else {
                                res.status(200).send({ message: "accedido", token, role: payload.role, id: payload.id_user });
                            }
                        });
                    } else {
                        res.status(200).send({ message: "Empleado desactivado" });
                    }

                } else {
                    res.status(200).send({ message: "Password mala" }); //no doy acceso
                }

            }).catch(error => { //se le envia tambien el status para mejorar practicas
                console.log(error);
                res.status(400).send({ error: "el campo email y password, son requeridos" });
            });
    }).catch(error => { //este error no se , si no existe el username en la db
        console.log(error);
        res.status(400).send({ error: "Campo no encontrados" });
    });

}

function loginToken(req, res) {

    let tokken = req.body.token;
    jwt.verify(tokken, 'JDPAUTOS', function (error, respuesta) {
        if (error) {
            res.status(400).send({ message: "Token invalido" });
        } else {
            let email = respuesta.email;
            Owner.findOne({ email }).then(user => { // se puede solo username
                if (!user) res.status(404).send({ message: "El email no existe" });
                //verificar que el token sea igual al que esta en la base de datos
                if (user.token == tokken) {
                    //si la fecha de caducidad es mayor a la fecha de actual, entonces es valido
                    if (Date.now() < respuesta.fechaCaduca) {
                        let query = {};
                        query["email"] = respuesta.email;
                        Owner.find(query).then(ownerr => {
                            if (!ownerr.length) return res.status(404).send({ message: 'NO Hay dueño para ese token' });
                            let id = ownerr[0].id_owner;
                            res.status(200).send({ id , message: "accedido" });
                            
                        }).catch(error => {
                            return res.status(500).send({ error });
                        });
                    } else {
                        res.status(404).send({ message: "El token ha caducado" });
                    }
                } else {
                    res.status(404).send({ message: "Este token es antiguo" });
                }
            }).catch(error => { //este error no es si no existe el username en la db
                console.log(error);
                res.status(400).send({ error });
            });
        }
    });
}

module.exports = {
    login,
    loginToken
};
