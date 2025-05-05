const User = require('../models/User');
const {
    hashPassword,
    comparePassword,
    createToken
} = require('../middleware/auth');

//signup
exports.signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const exists = await User.findOne({ email });
        if(exists) return res.status(400).json({ error: 'User already exists' });

        const hashed = await hashPassword(password);
        const newUser = new User({ email, password: hashed });
        await newUser.save();
        res.json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ error: 'Signup failed' });
    }
};

//login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email });
        if(!user || !(await comparePassword(password, user.password)))
            return res.status(401).json({ error: 'Invalid credentials' });

        const token = createToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 86400000
        })//.json({ message: 'Login successful' });
        res.status(200).json({ message: 'Login successful',email: user.email })
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    } 
};


//check session
exports.checkAuth = (req, res) => {
    res.json({ loggedIn: true, user: req.user });
};


//loguout
exports.logout = (req, res) => {
    res.clearCookie('token', {
        sameSite: 'lax',
        secure: false,
        httpOnly: true
    }).json({ message: 'Logged out' });
};