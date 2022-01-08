const Booking = require('../../db/models/booking-model')

class CreateBooking {
    execute(request) {
        this.validate(request);

        return this.createBooking(request);
    }

    validate(request) {
        if (!request) {
            throw {
                status: 400,
                success: false,
                message: 'You must provide your details for booking.'
            }
        }
    }

    async createBooking(request) {
        const booking = new Booking(request);

        if (!booking) {
            return {
                status: 400,
                success: false,
                error: booking
            }
        }

        await booking
            .save()
            .then(() => {
                return {
                    status: 201,
                    success: true,
                    id: booking._id,
                    message: 'Schedule Booked'
                }
            })
            .catch(error => {
                return {
                    status: 400,
                    error,
                    message: 'Booking not created'
                }
            })
    }
}

module.exports = {CreateBooking}