const express = require('express');

const CenterCtrl = require('../controllers/center-ctrl');

const router = express.Router();

router.get('/vaccination-centers', CenterCtrl.getCenters);

module.exports = router;