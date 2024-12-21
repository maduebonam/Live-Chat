const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const http = require('http');
const multer = require('multer');``


dotenv.config();
const app = express();


// CORS middleware to allow cross-origin requests
const allowedOrigins = [
    'http://localhost:5173', // Local development frontend
    'https://maduchat.vercel.app' // Deployed frontend on Vercel
];


// Handle preflight requests (CORS)
app.use(cors({
    origin: allowedOrigins, 
      credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

//other Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());


app.get('/server', (req, res) => {
    res.send("Welcome to MaduChat API!");
});

app.get('/server/profile', (req, res) => {
    res.json({ userId: "123", username: "testuser" }); // Example response
});


// Multer setup for handling file uploads (store files in 'uploads' directory)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    },
});
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 30000, // Wait 10 seconds for connection
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
});

// Constants
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

async function getUserDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        
        const token = req.cookies?.token;
        if (!token) return reject('No token provided');
        
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) {
                console.error('JWT verification error:', err);
                return; 
            }
            connection.userId = userData.userId;
            connection.username = userData.username;
        });
    });
}

// Test Route
app.get("/test", (req, res) =>  res.json("test ok"));

app.get('/messages/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userData = await getUserDataFromRequest(req);
        const ourUserId = userData.userId;
        const messages = await Message.find({
            sender: { $in: [userId, ourUserId] },
            recipient: { $in: [userId, ourUserId] },
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/people', async (req,res) => {
    const users = await User.find({}, {'_id':1,username:1});
    res.json(users);
});

// Profile Route
app.get('/profile', async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, jwtSecret); // Assuming you're using JWT for custom tokens
        const userId = decoded.userId;
       
        const userDoc = await firestore.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = userDoc.data();
        res.json({ userId: userId, username: user.username });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) return res.status(404).json({ error: 'User not found' });
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (!passOk) return res.status(401).json({ error: 'Invalid credentials' });

        jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
           
            if (err) {
                console.error('JWT signing error:', err);
                return res.status(500).json({ error: 'Failed to generate token' });
            }

            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction, 
            sameSite: isProduction ? 'None' : 'Lax', 
            maxAge: 60 * 60 * 1000
        })
            .json({ id: foundUser._id, username });
       
        });
    } catch (err) {
        console.error('Login failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/logout', (req, res) => {
res.cookie('token', '', {sameSite:'none', secure:true}).json('ok');
});

// Register Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(409).json({ error: 'Username already taken' });
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

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ filePath: `/uploads/${req.file.filename}` });
});
 
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({
    server, 
    path: '/ws'  
});


wss.on('connection', (connection, req) => {
    console.log('New client connected');
    
    function notifyAboutOnlinePeople() {
        const onlineUsers = [...wss.clients]
        .filter((client) => client.userId && client.readyState === WebSocket.OPEN)
        .map((client) => ({
            userId: client.userId,
            username: client.username,
        }));
    [...wss.clients].forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ online: onlineUsers }));
        }
    });
}
   
  
        //     [...wss.clients].forEach((client) => {
    //         client.send(
    //             JSON.stringify({
    //                 online: [...wss.clients].map((c) => ({
    //                     userId: c.userId,
    //                     username: c.username,
    //                 })),
    //             })
    //         );
    //     });
    // }


    connection.isAlive = true;

    // Ping to keep connection alive
    connection.timer = setInterval(() => {
        connection.ping();

        if (connection.deathTimer) {
            clearTimeout(connection.deathTimer);
        }

        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false;
            clearInterval(connection.timer);
            connection.terminate();
            console.log(`Connection terminated for userId: ${connection.userId}`);
            notifyAboutOnlinePeople();
        }, 1000);
    }, 5000);

     // Process cookies for user identification
     const cookies = req.headers.cookie;
     if (cookies) {
         const tokenCookieString = cookies
             .split(';')
             .find((str) => str.trim().startsWith('token'));
         if (tokenCookieString) {
             const token = tokenCookieString.split('=')[1];
             if (token) {
                 jwt.verify(token, jwtSecret, {}, (err, userData) => {
                     if (err) {
                        console.error('JWT verification failed:', err);
                        return;
                    }
                     connection.userId = userData.userId;
                     connection.username = userData.username;
                     console.log(`User authenticated: ${userData.username}`);
                     notifyAboutOnlinePeople();
                    });
             }
         }
     }

// WebSocket message handler
     connection.on('message', async (message) => {
        try {
            const messageData = JSON.parse(message.toString()); 
            if (messageData.action === 'delete' && messageData.messageId) {
                await Message.findByIdAndDelete(messageData.messageId);
                [...wss.clients]
                    .filter((c) => c.userId === messageData.recipient && c.readyState === WebSocket.OPEN)
                    .forEach((c) => {
                        c.send(
                            JSON.stringify({
                                action: 'delete',
                                messageId: messageData.messageId,
                            })
                        );
                    });
    
                console.log('Message deleted:', messageData.messageId);
            } else if (messageData.recipient && (messageData.text || messageData.file)) {
                // Send new message to the recipient
                let filename = null;
                if (messageData.file && messageData.file.data) {
                    const parts = messageData.file.name.split('.');
                    const ext = parts[parts.length - 1];
                    filename = `${Date.now()}.${ext}`;
                    const uploadPath = path.join(__dirname, 'uploads', filename);
                    const bufferData = Buffer.from(messageData.file.data.split(',')[1], 'base64');
                    fs.writeFileSync(uploadPath, bufferData);
                    console.log('File saved:', uploadPath);
                }
    
                const messageDoc = await Message.create({
                    sender: connection.userId,
                    recipient: messageData.recipient,
                    text: messageData.text,
                    file: messageData.file ? filename : null,
                });
    
                [...wss.clients]
                    .filter((c) => c.userId === messageData.recipient && c.readyState === WebSocket.OPEN)
                    .forEach((c) => {
                        c.send(
                            JSON.stringify({
                                text: messageData.text,
                                sender: connection.userId,
                                recipient: messageData.recipient,
                                file: messageData.file ? filename : null,
                                _id: messageDoc._id,
                            })
                        );
                    }); 
                console.log('Message sent and stored in DB');
            }
        } catch (err) {
            console.error('Error handling message:', err);
        }    
        notifyAboutOnlinePeople();
    });
    
 
    // Handle connection close
    connection.on('close', () => {
        clearInterval(connection.timer);
        if (connection.deathTimer) {
            clearTimeout(connection.deathTimer);
        }
        console.log(`Connection closed for userId: ${connection.userId}`);
        notifyAboutOnlinePeople();
    });

    connection.on('error', (err) => {
    console.error('WebSocket error:', err);
    
  });
 });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
