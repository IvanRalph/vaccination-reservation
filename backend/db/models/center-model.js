const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VaccinationCenter = new Schema(
    {
        name : { type: String, required: true},
        address: { type: String, required: true},
        nurses: { type: Array, required: false},
        work_hours: { type: String, required: true}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('health_centers', VaccinationCenter);