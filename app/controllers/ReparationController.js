const ReparationM = require('../models/Reparation');


function index(req, res) {
    ReparationM.find({}).then(reparations => {
        // si hay usuarios envio codigo de aceptacion y un cuerpo con los prdctos
        if (reparations.length) return res.status(200).send({ reparations });
        //en caso de que no hayan datos se manda un codigo y un mensaje xD
        return res.status(204).send({ message: 'NO CONTENT' });
    }).catch(error => res.status(500).send({ error }));
}

function findPlaca(req, res) {
    //se hara lo siguiente para entrar por ejemplo (categoria: 'Hogar')
    let query = {};
    query["placa"] = req.params.value;
    ReparationM.find(query).then(reparations => {
        if (reparations.length) return res.status(200).send({ reparations });
        return res.status(204).send({ message: 'NO CONTENT' });
    }).catch(error => {
        req.body.error = error;
        next();
    });
}


function create(req, res) {
    let rreparacion = new ReparationM(req.body);
    //guardo con el metodo save el nuevo usuario
    rreparacion.save().then(reparacion => {
        return res.status(201).send({ reparacion, message: "La reparacion fue creada exitosamente" });
    }).catch(error => res.status(422).send({ message: "La reparacion ya existe", error }));
}

function find(req,res,next){
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

function editReparation(req,res){
    if (req.body.error) return res.status(500).send({ error });
    if (!req.body.reparations) return res.status(404).send({ message: 'NOT FOUND' });
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

    let update = {
        placa: req.body.placa,
        estado: req.body.estado,
        detalles: req.body.detalles,
        precio: req.body.precio,
    };

    ReparationM.updateOne(query, update, (err, reparacion) => {
        if (err) res.status(500).send({ message: `Error ${err}` })
        res.status(200).send({ message: "Actualizacion correcta" })
    });

}

module.exports = {
    index,
    findPlaca,
    create,
    find,
    editReparation
};