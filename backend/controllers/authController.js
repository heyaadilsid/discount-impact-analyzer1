import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { localStore } from '../services/localStore.js';

// Helper to sign JWT
export const generateToken = (id) => {
  return jwt.sign({ id: String(id) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, storeName, workspaceName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      try {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'An account with this email already exists'
          });
        }

        const user = await User.create({
          name,
          email: normalizedEmail,
          password,
          storeName: storeName || `${name}'s Store`,
          workspaceName: workspaceName || 'Retail Workspace',
          role: 'Store Manager'
        });

        const token = generateToken(user._id);

        return res.status(201).json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            storeName: user.storeName,
            workspaceName: user.workspaceName,
            role: user.role,
            currency: user.currency
          }
        });
      } catch (dbErr) {
        console.warn('[Auth Register] MongoDB error, falling back to local store:', dbErr.message);
      }
    }

    // Local fallback
    const user = await localStore.createUser({
      name,
      email: normalizedEmail,
      password,
      storeName: storeName || `${name}'s Store`,
      workspaceName: workspaceName || 'Retail Workspace'
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        storeName: user.storeName,
        workspaceName: user.workspaceName,
        role: user.role,
        currency: user.currency
      }
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      try {
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (user) {
          const isMatch = await user.matchPassword(password);
          if (isMatch) {
            const token = generateToken(user._id);
            return res.json({
              success: true,
              token,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                storeName: user.storeName,
                workspaceName: user.workspaceName,
                role: user.role,
                currency: user.currency
              }
            });
          } else {
            return res.status(401).json({
              success: false,
              message: 'Invalid email or password'
            });
          }
        }
      } catch (dbErr) {
        console.warn('[Auth Login] MongoDB error, checking local store:', dbErr.message);
      }
    }

    // Check local fallback
    const localUser = localStore.findUserByEmail(normalizedEmail);
    if (!localUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await localStore.verifyPassword(localUser, password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(localUser._id);
    return res.json({
      success: true,
      token,
      user: {
        id: localUser._id,
        name: localUser.name,
        email: localUser.email,
        storeName: localUser.storeName,
        workspaceName: localUser.workspaceName,
        role: localUser.role,
        currency: localUser.currency
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        storeName: user.storeName,
        workspaceName: user.workspaceName,
        role: user.role,
        currency: user.currency
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user profile'
    });
  }
};

// @desc    Update user profile & preferences
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, storeName, workspaceName, currency } = req.body;
    const userId = req.user._id || req.user.id;

    if (isDbConnected()) {
      try {
        const user = await User.findById(userId);
        if (user) {
          if (name) user.name = name;
          if (storeName) user.storeName = storeName;
          if (workspaceName) user.workspaceName = workspaceName;
          if (currency) user.currency = currency;
          await user.save();

          return res.json({
            success: true,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              storeName: user.storeName,
              workspaceName: user.workspaceName,
              role: user.role,
              currency: user.currency
            }
          });
        }
      } catch (dbErr) {
        console.warn('[Profile Update] MongoDB error, updating local store:', dbErr.message);
      }
    }

    // Update local store
    const updated = localStore.updateUser(userId, { name, storeName, workspaceName, currency });
    return res.json({
      success: true,
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        storeName: updated.storeName,
        workspaceName: updated.workspaceName,
        role: updated.role,
        currency: updated.currency
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};

// @desc    Quick demo login (finds or creates default demo user)
// @route   POST /api/auth/demo
export const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'arjun@retailstore.com';

    if (isDbConnected()) {
      try {
        let user = await User.findOne({ email: demoEmail });
        if (!user) {
          user = await User.create({
            name: 'Arjun Verma',
            email: demoEmail,
            password: 'Password123!',
            storeName: "Arjun's Store",
            workspaceName: 'Retail Workspace',
            role: 'Store Manager',
            currency: 'INR'
          });
        }

        const token = generateToken(user._id);
        return res.json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            storeName: user.storeName,
            workspaceName: user.workspaceName,
            role: user.role,
            currency: user.currency
          }
        });
      } catch (dbErr) {
        console.warn('[Demo Login] MongoDB error, using local demo user:', dbErr.message);
      }
    }

    // Local demo login
    let localDemo = localStore.findUserByEmail(demoEmail);
    if (!localDemo) {
      localDemo = await localStore.createUser({
        name: 'Arjun Verma',
        email: demoEmail,
        password: 'Password123!',
        storeName: "Arjun's Store",
        workspaceName: 'Retail Workspace'
      });
    }

    const token = generateToken(localDemo._id);
    return res.json({
      success: true,
      token,
      user: {
        id: localDemo._id,
        name: localDemo.name,
        email: localDemo.email,
        storeName: localDemo.storeName,
        workspaceName: localDemo.workspaceName,
        role: localDemo.role,
        currency: localDemo.currency
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Demo login failed'
    });
  }
};
