const express = require('express');

const BookingCtrl = require('../controllers/booking-ctrl');

const router = express.Router();

router.post('/booking', BookingCtrl.createBooking);
router.put('/booking/:id', BookingCtrl.updateBooking);
router.delete('/booking/:id', BookingCtrl.deleteBooking);
router.get('/booking/:id', BookingCtrl.getBookingById);
router.get('/bookings', BookingCtrl.getBookings);

module.exports = router;