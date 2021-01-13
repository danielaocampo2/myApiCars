const moongose = require('mongoose');
// creo un schema para saber como debe estar guardando mi base de datos

const ReparationSchema = new moongose.Schema({
    // en lugar de pasarle un tipo puedo pasarle mas detallado
    placa: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true,
        enum: ["En curso",
               "Finalizado"],
        default: "En curso"
    },
    detalles: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },status: {
        type: String,
        default: "1",
        required: true,
        enum: ["1",
               "0"]
    }
});

const Reparation = moongose.model('Reparation', ReparationSchema);

module.exports = Reparation;