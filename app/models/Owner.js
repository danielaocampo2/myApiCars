const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const OwnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id_owner: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    sign_up_date: {
        type: Date,
        default: Date.now()
    },
    last_login_date: {
        type: Date,
        default: Date.now()
    },
    token: {
        type: String,
        required: true
    }
});
// este metodo ejecuta un hook antes de un metodo
/*OwnerSchema.pre('save', function(next) {
    next();
});*/

const Owner = mongoose.model('Owner', OwnerSchema);

module.exports = Owner;