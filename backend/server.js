const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));


// Log MongoDB URL
console.log('Connecting to MongoDB at:', process.env.MONGO_URL);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 10000, // Wait 10 seconds for connection
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
});




// Constants
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

// Test Route
app.get("/test", (req, res) => {
    res.json("test ok");
});

// Profile Route
app.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        res.json(userData);
    });
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (!passOk) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw err;

            res.cookie('token', token, {
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production', // Set true in production
                httpOnly: true, // Prevent access by JavaScript
            }).json({
                id: foundUser._id,
                username,
            });
        });
    } catch (err) {
        console.error('Login failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Register Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await User.create({
            username,
            password: hashedPassword,
        });

        jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw err;

            res.cookie('token', token, {
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
            }).status(201).json({
                id: createdUser._id,
                username,
            });
        });
    } catch (err) {
        console.error('Registration failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start Server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});

