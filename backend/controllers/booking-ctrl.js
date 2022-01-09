const Booking = require('../db/models/booking-model')
const {isTimeSlotAvailable, isFullNameUnique} = require('../services/booking/customValidation')

createBooking = async (req, res) => {
    const body = req.body;
    const booking = new Booking(body);

    if (booking.validateSync()) {
        return res.status(400).json({success: false, error: booking.validateSync().errors, message: 'Booking validation failed'})
    }

    if (!await isTimeSlotAvailable(body)) {
        console.log('HIT');
        return res.status(400).json({success: false, message: 'Time slot is fully booked, select another.'})
    }

    if (!await isFullNameUnique(body.full_name)) {
        return res.status(400).json({success: false, message: 'A schedule already exists under this name.'})
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
        });
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

    let booking = await Booking.findOne({_id: req.params.id}).exec();

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        })
    }

    if (body.full_name !== booking.full_name && !await isFullNameUnique(body.full_name)) {
        return res.status(400).json({success: false, message: 'A schedule already exists under this name.'})
    }

    if (body.slot !== booking.slot && !await isTimeSlotAvailable(body)) {
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