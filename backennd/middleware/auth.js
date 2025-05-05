const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

//hash password
const hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, 10);
}

//compare passwords
const comparePassword = async (plain, hashed) => {
    return await bcrypt.compare(plain,hashed);
};


//create JWT
const createToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

//middleware to protect routes
const requireAuth = (req, res ,next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(err){
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = {
    hashPassword,
    comparePassword,
    createToken,
    requireAuth
};