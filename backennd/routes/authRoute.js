const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
    signup,
    login,
    checkAuth,
    logout
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/check-auth', requireAuth, checkAuth);
router.post('/logout', logout);

module.exports = router;