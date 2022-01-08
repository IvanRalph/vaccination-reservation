const VaccinationCenter = require('../db/models/center-model');

getCenters = async (req, res) => {
    await VaccinationCenter.find({}, (err, centers) => {
        if (err) {
            return res
                .status(400)
                .json({success: false, error: err})
        }

        if (!centers.length) {
            return res
                .status(404)
                .json({success: false, error: 'Vaccination Center not found'})
        }

        return res.status(200).json({success: true, data: centers})
    }).clone()
        .catch(err => console.log(err))
}

module.exports = {
    getCenters
}