const Carc = require('../models/Car');
const owner = require('../models/Owner');
const CONFIG = require('../config/config');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

function index(req, res) {
    Carc.find({}).then(cars => {
        if (cars.length) return res.status(200).send({ cars });
        return res.status(204).send({ message: 'NO CONTENT' });
    }).catch(error => res.status(500).send({ error }));
}



function show(req, res) {
    if (req.body.error) return res.status(500).send({ error });
    if (!req.body.cars) return res.status(404).send({ message: 'NOT FOUND' });
    let cars = req.body.cars;
    return res.status(200).send({ cars });
}

function update(req, res) {
    if (req.body.error) return res.status(500).send({ error });
    if (!req.body.cars) return res.status(404).send({ message: 'NOT FOUND' });
    let query = {};
    query[req.params.key] = req.params.value;
    let car = req.body.cars[0];

    if (req.body.id_owner == undefined || req.body.id_owner == "" || req.body.id_owner == null) {
        req.body.id_owner = car.id_owner;
    }
    if (req.body.marca == undefined || req.body.marca == "" || req.body.marca == null) {
        req.body.marca = car.marca;
    }
    if (req.body.model == undefined || req.body.model == "" || req.body.model == null) {
        req.body.model = car.model;
    }
    if (req.body.color == undefined || req.body.color == "" || req.body.color == null) {
        req.body.color = car.color;
    }
    if (req.body.date_in == undefined || req.body.date_in == "" || req.body.date_in == null) {
        req.body.date_in = car.date_in;
    }
    if (req.body.status == undefined || req.body.status == "" || req.body.status == null) {
        req.body.status = car.status;
    }
    owner.find({ "id_owner": req.body.id_owner }, (err, car) => {
        if (err) res.status(500).send({ message: `Error ${err}` })
        if (!car.length) return res.status(404).send({ message: `Error propietario no existe en BD` });
        let update = {
            id_owner: req.body.id_owner,
            marca: req.body.marca,
            model: req.body.model,
            color: req.body.color,
            date_in: req.body.date_in,
            status: req.body.status
        };
        Carc.updateOne(query, update, (err, car) => {
            if (err) res.status(500).send({ message: `Error ${err}` })
            res.status(200).send({ message: "Actualizacion correcta" })
        });


    });






}

function find(req, res, next) {
    let query = {};
    query[req.params.key] = req.params.value;
    Carc.find(query).then(cars => {
        if (!cars.length) return next();
        req.body.cars = cars;
        return next();
    }).catch(error => {
        req.body.error = error;
        next();
    });
}

function create(req, res) {
    if (req.body.error) return res.status(500).send({ error });
    if (!req.body.cars) return res.status(404).send({ message: 'Error propietario no existe en BD' });
    let car = new Carc(req.body);
    car.save().then(car => {
        return res.status(201).send({ car, message: "El vehiculo fue registrado exitosamente" });
    }).catch(error => res.status(422).send({ message: "El vehiculo ya existe", error }));
}

function existsOwner(req, res, next) {

    owner.find({ "id_owner": req.body.id_owner }).then(cars => {
        if (!cars.length) return next();
        req.body.cars = cars;
        return next();
    }).catch(error => {
        req.body.error = error;
        next();
    });
}

module.exports = {
    index,
    show,
    create,
    update,
    find,
    existsOwner,

};