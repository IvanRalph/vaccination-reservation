const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Booking = new Schema(
    {
        nric_number: { type: String, required: [true, 'NRIC Number is required'] },
        full_name: { type: String, required: [true, 'Name is required'] },
        health_center_id: { type: Schema.Types.ObjectId, ref: 'health_centers', required: [true, 'Vaccination center is required'] },
        slot : {type: String, required: [true, 'Time Slot is required']}
    },
    { timestamps: true },
)

module.exports = mongoose.model('booking', Booking)