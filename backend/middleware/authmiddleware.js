// file1.js
import jwt from "jsonwebtoken";
import AsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import session from 'express-session';

// Use session middleware
const sessionMiddleware = session({
    secret: 'your-secret-key', // Replace with your secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000, // Session expiration time in milliseconds (1 hour in this example)
        httpOnly: true, // Helps mitigate XSS attacks
        secure: false, // Set it to true in production with HTTPS
    }
});

const protect = AsyncHandler(async (req, res, next) => {
    let token;
    // Check if req.cookies exists and has the 'token' property
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // Check for token in authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            req.session.user = req.user; // Store user in session
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    // If token is still undefined, handle the case
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

 
const admin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

export { protect, admin, sessionMiddleware };
