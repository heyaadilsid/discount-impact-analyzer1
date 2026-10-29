import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import mongoose from 'mongoose';
import { localStore } from '../services/localStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let foundUser = null;
      if (mongoose.connection.readyState === 1) {
        try {
          foundUser = await User.findById(decoded.id).select('-password');
        } catch {
          // If DB query fails, fallback to localStore
        }
      }

      if (!foundUser) {
        foundUser = localStore.findUserById(decoded.id);
      }

      if (!foundUser) {
        return res.status(401).json({
          success: false,
          message: 'User associated with this token was not found'
        });
      }

      req.user = foundUser;
      next();
    } catch (error) {
      console.error('[Auth Middleware] Token error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authorization token'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No authorization token provided, access denied'
    });
  }
};
