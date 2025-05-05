const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { postFav, getFav, removeFav, isFav } = require('../controllers/favouritesController');


router.post('/addFav', requireAuth, postFav);
router.get('/getFav', requireAuth, getFav);
router.delete('/removeFav/:countryCode', requireAuth, removeFav);
router.get('/isFav/:countryCode', requireAuth, isFav);

module.exports = router;