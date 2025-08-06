import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import { isTokenBlacklisted } from '../controllers/authController.js';

export const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({
                success: false,
                message: 'Not authorized login again'
            });
        }
        if (isTokenBlacklisted(token)) {
            return res.status(401).json({ success: false, message: 'Token is blacklisted. Please login again.' });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!req.body) {
            req.body = {};
        }
        req.body.userId = token_decode.id;
        // Attach user role for role-based access
        const user = await userModel.findById(token_decode.id);
        req.body.userRole = user ? user.role : undefined;
        next();
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}