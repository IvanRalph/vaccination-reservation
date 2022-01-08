const Booking = require('../db/models/booking-model')
const HealthCenter = require('../db/models/center-model');

createBooking = async (req, res) => {
    const body = req.body;
    const booking = new Booking(body);
    let bookedSlotCount = 0;

    if (Object.keys(body).length === 0) {
        return res.status(400).json({success: false, message: 'You must provide your details for booking.'})
    }

    if (!booking) {
        return res.status(400).json({success: false, error: err})
    }

    if (booking.validateSync()) {
        return res.status(400).json({success: false, error: booking.validateSync().errors, message: 'Booking validation failed'})
    }

    bookedSlotCount = await Booking.find({slot: body.slot, health_center_id: body.health_center_id}, ).clone();

    let bookedName = await Booking.find({full_name: body.full_name}).clone();

    if (bookedName.length >= 1) {
        return res.status(400).json({
            success: false,
            message: 'Booking already exists under same name.'
        })
    }

    let healthCenter = await HealthCenter.findOne({_id : body.health_center_id}).clone();

    if (!healthCenter) {
        return res.status(400).json({success: false, message: 'Vaccine Center field is required'})
    }

    if (bookedSlotCount.length >= healthCenter.nurses.length) {
        return res.status(400).json({success: false, message: 'Time slot is fully booked, select another.'})
    }

    booking
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: booking._id,
                message: 'Schedule Booked'
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Booking not created'
            })
        })
};

updateBooking = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update'
            ,
        })
    }

    let booking = Booking.findOne({_id: req.params.id}).exec();

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        })
    }

    if (Object.keys(body).length === 0) {
        return res.status(400).json({success: false, message: 'You must provide your details for booking.'})
    }

    if (!booking) {
        return res.status(400).json({success: false, error: err})
    }

    bookedSlotCount = await Booking.find({slot: body.slot, health_center_id: body.health_center_id}, ).clone();

    let healthCenter = await HealthCenter.findOne({_id : body.health_center_id}).clone();

    if (!healthCenter) {
        return res.status(400).json({success: false, message: 'Vaccine Center field is required'})
    }

    if (bookedSlotCount.length >= healthCenter.nurses.length) {
        return res.status(400).json({success: false, message: 'Time slot is fully booked, select another.'})
    }


    let payload = {
        $set : {
            nric_number: body.nric_number,
            full_name: body.full_name,
            slot: body.slot,
            health_center_id: body.health_center_id
        }
    }


    Booking
        .updateOne({_id: req.params.id}, payload)
        .then(() => {
            return res.status(200).json({
                success: true,
                id: booking._id,
                message: 'Booking updated!'
            });
        })
        .catch(error => {
            return res.status(404).json({
                error,
                message: 'Booking not updated'
            })
        });
}

deleteBooking = async (req, res) => {
    await Booking.findOneAndDelete({_id: req.params.id}, (err, booking) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }

        return res.status(200).json({success: true, data: booking})
    }).clone()
        .catch(error => console.log(error))
}

getBookingById = async (req, res) => {
    await Booking.findOne({_id: req.params.id}, (err, booking) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }

        if (!booking) {
            return res
                .status(404)
                .json({success: false, error: 'Booking not found'});
        }

        return res.status(200).json({success: true, data: booking})
    }).clone()
}

getBookings = async (req, res) => {
    let bookings = await Booking.aggregate([{
        $lookup : {
            from: 'health_centers',
                localField: 'health_center_id',
                foreignField: '_id',
                as: 'health_center'
        }
    }]);

    if (!bookings.length) {
        return res
            .status(404)
            .json({success: false, error: 'Booking not found'});
    }

    return res.status(200).json({success: true, data: bookings});
}

module.exports = {
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingById,
    getBookings
}