const Booking = require('../../db/models/booking-model')
const HealthCenter = require('../../db/models/center-model')

isTimeSlotAvailable = async (body) => {
    let bookedSlotCount = 0;

    bookedSlotCount = await Booking.find({slot: body.slot, health_center_id: body.health_center_id}, ).clone();
    let healthCenter = await HealthCenter.findOne({_id : body.health_center_id}).clone();

    return bookedSlotCount.length < healthCenter.nurses.length;
}

isFullNameUnique = async (full_name) => {
    let bookedName = await Booking.find({full_name: full_name}).clone();

    return bookedName.length === 0;
}

module.exports = {
    isTimeSlotAvailable,
    isFullNameUnique
}