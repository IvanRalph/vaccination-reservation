import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

export const getAllCenters = () => api.get('/vaccination-centers');
export const insertBooking = payload => api.post('/booking', payload);
export const getAllBookings = () => api.get('/bookings');
export const getBookingById = id => api.get('/booking/' + id)
export const updateBooking = (id, payload) => api.put('/booking/' + id, payload)
export const deleteBooking = id => api.delete('/booking/' + id)

const apis = {
    getAllCenters,
    insertBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking
}

export default apis