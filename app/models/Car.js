const moongose = require('mongoose');
// creo un schema para saber como debe estar guardando mi base de datos

const CarSchema = new moongose.Schema({
    // en lugar de pasarle un tipo puedo pasarle mas detallado
    placa: {
        type: String,
        unique: true,
        required: true
    },
    id_owner: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String
    },
    date_in: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: "1"
    }
});

const Car = moongose.model('Car', CarSchema);

module.exports = Car;