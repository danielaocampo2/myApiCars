const ReparationM = require('../models/Reparation');
const CarM = require('../models/Car');
const nodemailer = require('nodemailer');
const owner = require('../models/Owner');

let reparacionGlobal;

function index(req, res) {
    ReparationM.find({}).then(reparations => {
        // si hay usuarios envio codigo de aceptacion y un cuerpo con los prdctos
        if (reparations.length) return res.status(200).send({ reparations });
        //en caso de que no hayan datos se manda un codigo y un mensaje xD
        return res.status(204).send({ message: 'No hay contenido en la db de reparaciones' });
    }).catch(error => res.status(500).send({ error }));
}

function findPorPlaca(req, res) {
    //se hara lo siguiente para entrar por ejemplo (categoria: 'Hogar')
    let query = {};
    query["placa"] = req.params.value;
    ReparationM.find(query).then(reparations => {
        if (reparations.length === 0) {
            if (!req.body.reparations) return res.status(404).send({ message: 'Error, no existen reparaciones de esa placa' });
        }
        return res.status(200).send({ reparations });

    }).catch(error => {
        return res.status(404).send({ message: 'Error, no hay reparaciones para esa placa' });
    });
}

function existePlaca(req, res, next) {
    //se hara lo siguiente para entrar por ejemplo (categoria: 'Hogar')
    let query = {};
    query["placa"] = req.body.placa;
    CarM.find(query).then(car => {
        if (!car.length) return next();
        req.body.car = car;
        return next();
    }).catch(error => {
        req.body.error = error;
        next();
    });
}



function findPorPlacaActivos(req, res) {
    //se hara lo siguiente para entrar por ejemplo (categoria: 'Hogar')
    let query = {};
    query["placa"] = req.params.value;
    ReparationM.find(query).then(reparations => {
        if (reparations.length === 0) {
            return res.status(404).send({ message: 'Error, no existen reparaciones de esa placa' });
        }
        let query2 = {};
        query2["status"] = "1";
        query2["placa"] = req.params.value;
        ReparationM.find(query2).then(rreparations => {
            if (rreparations.length) {
                return res.status(200).send({ rreparations });
            }
            return res.status(204).send({ message: 'No existen reparaciones activas de esa placa' });

        }).catch(error => {
            return res.status(500).send({ error });
        });
    }).catch(error => {
        return res.status(500).send({ error });
    });
}


function create(req, res) {
    if (req.body.error) return res.status(500).send({ error });
    if (!req.body.car) return res.status(404).send({ message: 'Error, no existe el carro en la DB' });
    let rreparacion = new ReparationM(req.body);
    //guardo con el metodo save el nuevo usuario
    rreparacion.save().then(reparacion => {
        return res.status(201).send({ reparacion, message: "La reparacion fue creada exitosamente" });
    }).catch(error => res.status(422).send({ message: "Error al guardar reparacion", error }));
}

function find(req, res, next) {
    let query = {};
    query["_id"] = req.params.value;
    ReparationM.find(query).then(reparations => {
        //si no existen users
        if (!reparations.length) return next();
        // en caso de que si haya , se crea un user en el body (no existia)
        req.body.reparations = reparations;
        return next();
    }).catch(error => {
        req.body.error = error;
        next();
    });
}

function editReparation(req, res) {
    if (!req.body.reparations) return res.status(404).send({ message: 'Error, reparacion no encontrada en DB' });
    let query = {};
    query["_id"] = req.params.value;
    let rreparacion = req.body.reparations[0];
    if (req.body.placa == undefined || req.body.placa == "" || req.body.placa == null) {
        req.body.placa = rreparacion.placa;
    }
    if (req.body.estado == undefined || req.body.estado == "" || req.body.estado == null) {
        req.body.estado = rreparacion.estado;
    }
    if (req.body.detalles == undefined || req.body.detalles == "" || req.body.detalles == null) {
        req.body.detalles = rreparacion.detalles;
    }
    if (req.body.precio == undefined || req.body.precio == "" || req.body.precio == null) {
        req.body.precio = rreparacion.precio;
    }
    if (req.body.status == undefined || req.body.status == "" || req.body.status == null) {
        req.body.status = rreparacion.status;
    }

    if (req.body.estado == "En curso" || req.body.estado == "Finalizado") {
        /** se hizo este if para que funcione */
    } else {
        return res.status(500).send({ message: "Error al editar reparacion" })
    }

    let update = {
        placa: req.body.placa,
        estado: req.body.estado,
        detalles: req.body.detalles,
        precio: req.body.precio,
        status: req.body.status
    };
    //Verificamos si la reparacion ya finalizo
    if (req.body.estado === "Finalizado"  ) {
        let queryz = {};
        queryz["placa"] = req.body.placa;
        reparacionGlobal = req.body.placa;
        CarM.find(queryz).then(car => {
            if (!car.length) return res.status(404).send({ message: 'NO HAY CARRO CON ESA ID' });
            let query2 = {};        
            query2["id_owner"] = car[0].id_owner;
            owner.find(query2).then(ownerr => {
                if (!ownerr.length) return res.status(404).send({ message: 'NO HAY DUEÑO DE ESE CARRO' });
                //enviamos correo
                let emailerr = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'jdpautos24@gmail.com',
                        pass: 'arcangel27dejulio'
                    }
                });
                
                let mailOptionss = {
                    from: 'jdpautos24@gmail.com',
                    to: ownerr[0].email,
                    subject: 'JDPAUTOS - REPARACION FINALIZADA',
                    text: "Saludos, "+ ownerr[0].name +  " \n Le informamos que la reparación del carro con placa: " + reparacionGlobal + "\n ha finalizado, puede acercarse al local para hacer el pago y retirarlo"
                };
    
                emailerr.sendMail(mailOptionss, function (error, info) {
                    if (error) {
                        //console.log(error);
                    } else {
                        //console.log('Email sent: ' + info.response);
                    }
                });
    
            }).catch(error => {
                return res.status(500).send({ error });
            });


        }).catch(error => {
            return res.status(500).send({ error });
        });
    }
    ReparationM.updateOne(query, update, (err, reparacion) => {
        if (err) res.status(500).send({ message: `Error ${err}` })
        res.status(200).send({ message: "Actualizacion correcta" })
    });


}

function remove(req, res) {
    if (!req.body.reparations) return res.status(404).send({ message: 'Error, no existe reparacion en DB' });
    req.body.reparations[0].remove().then(reparacion => res.status(200).send({ message: "Reparacion eliminada", reparacion })).catch(error => res.status(500).send({ error }));
}
module.exports = {
    index,
    findPorPlaca,
    create,
    find,
    editReparation,
    findPorPlacaActivos,
    existePlaca,
    remove
};