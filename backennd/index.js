const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/authRoute");
const favouriteRoutes = require('./routes/favouriteRoutes');
//express app
const app = express()

//middleware
app.use(express.json());
app.use(cookieParser());

//enable cors with credentials (cookies)
app.use(cors({
    origin:`http://localhost:5173`,
    credentials: true
}))

app.use('/api', authRoutes);
app.use('/api', favouriteRoutes);
//connect to mongodb
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT, () => {
            console.log(`Server running at http://localhost:${process.env.PORT}`);
        });
    })
    .catch(error => console.error('MongoDB connection error:', error))

