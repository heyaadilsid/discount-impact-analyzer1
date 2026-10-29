import mongoose from 'mongoose';
import Analysis from '../models/Analysis.js';
import { localStore } from '../services/localStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

const DEFAULT_ANALYSES = [
  {
    id: 'RUN-2024-001',
    campaign: 'Festive Clearance — Everyday Backpack',
    edition: 'Canvas Edition',
    category: 'Travel Gear',
    sku: 'BP-102',
    horizon: '7-Day Flash',
    basePrice: 1000,
    cost: 600,
    baseVolume: 100,
    discountPercent: 10,
    volumeUpliftPercent: 35,
    status: 'Sustainable',
    updated: 'Today, 14:20'
  },
  {
    id: 'RUN-2024-002',
    campaign: 'End of Season — Merino Wool Overshirt',
    edition: 'Charcoal Grey (L/XL)',
    category: 'Apparel',
    sku: 'AP-409',
    horizon: '30-Day',
    basePrice: 2400,
    cost: 1500,
    baseVolume: 67,
    discountPercent: 20,
    volumeUpliftPercent: 25,
    status: 'Margin Dilution Alert',
    updated: 'Yesterday'
  },
  {
    id: 'RUN-2024-003',
    campaign: 'Weekend Flash — Minimalist Ceramic Mug',
    edition: 'Set of 2 (Matte Clay)',
    category: 'Home Goods',
    sku: 'HG-882',
    horizon: 'Weekend',
    basePrice: 800,
    cost: 320,
    baseVolume: 100,
    discountPercent: 15,
    volumeUpliftPercent: 35,
    status: 'Sustainable',
    updated: '3 days ago'
  },
  {
    id: 'RUN-2024-004',
    campaign: 'VIP Loyalty Drop — Leather Desk Mat',
    edition: 'Saddle Brown (XL)',
    category: 'Workspace',
    sku: 'WS-330',
    horizon: 'Quarterly',
    basePrice: 1500,
    cost: 1100,
    baseVolume: 200,
    discountPercent: 12,
    volumeUpliftPercent: 25,
    status: 'Sustainable',
    updated: 'Oct 12'
  }
];

// @desc    Get all analyses for logged-in user
// @route   GET /api/analyses
export const getAnalyses = async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    if (isDbConnected()) {
      try {
        let analyses = await Analysis.find({ user: userId }).sort({ createdAt: -1 });

        if (analyses.length === 0) {
          const seeded = DEFAULT_ANALYSES.map((item) => ({
            ...item,
            user: userId
          }));
          analyses = await Analysis.insertMany(seeded);
        }

        return res.json({
          success: true,
          count: analyses.length,
          data: analyses
        });
      } catch (dbErr) {
        console.warn('[Get Analyses] MongoDB error, checking local store:', dbErr.message);
      }
    }

    const localList = localStore.getAnalyses(userId);
    return res.json({
      success: true,
      count: localList.length,
      data: localList
    });
  } catch (error) {
    console.error('[Get Analyses Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve analyses'
    });
  }
};

// @desc    Create a new analysis
// @route   POST /api/analyses
export const createAnalysis = async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    const {
      id,
      campaign,
      edition,
      category,
      sku,
      horizon,
      basePrice,
      cost,
      baseVolume,
      discountPercent,
      volumeUpliftPercent,
      status
    } = req.body;

    const generatedId = id || `RUN-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

    if (isDbConnected()) {
      try {
        const newAnalysis = await Analysis.create({
          user: userId,
          id: generatedId,
          campaign: campaign || 'Untitled Campaign',
          edition: edition || 'Standard Run',
          category: category || 'General Merchandising',
          sku: sku || 'SKU-NEW',
          horizon: horizon || '7-Day Flash',
          basePrice: Number(basePrice) || 1000,
          cost: Number(cost) || 600,
          baseVolume: Number(baseVolume) || 100,
          discountPercent: Number(discountPercent) || 10,
          volumeUpliftPercent: Number(volumeUpliftPercent) || 35,
          status: status || 'Sustainable',
          updated: 'Just now'
        });

        return res.status(201).json({
          success: true,
          data: newAnalysis
        });
      } catch (dbErr) {
        console.warn('[Create Analysis] MongoDB error, saving to local store:', dbErr.message);
      }
    }

    const localNew = localStore.createAnalysis(userId, {
      id: generatedId,
      campaign: campaign || 'Untitled Campaign',
      edition: edition || 'Standard Run',
      category: category || 'General Merchandising',
      sku: sku || 'SKU-NEW',
      horizon: horizon || '7-Day Flash',
      basePrice: Number(basePrice) || 1000,
      cost: Number(cost) || 600,
      baseVolume: Number(baseVolume) || 100,
      discountPercent: Number(discountPercent) || 10,
      volumeUpliftPercent: Number(volumeUpliftPercent) || 35,
      status: status || 'Sustainable',
      updated: 'Just now'
    });

    res.status(201).json({
      success: true,
      data: localNew
    });
  } catch (error) {
    console.error('[Create Analysis Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create analysis'
    });
  }
};

// @desc    Update an analysis
// @route   PUT /api/analyses/:id
export const updateAnalysis = async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    if (isDbConnected()) {
      try {
        const analysis = await Analysis.findOne({
          user: userId,
          $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
        });

        if (analysis) {
          Object.assign(analysis, req.body);
          analysis.updated = 'Just now';
          await analysis.save();

          return res.json({
            success: true,
            data: analysis
          });
        }
      } catch (dbErr) {
        console.warn('[Update Analysis] MongoDB error:', dbErr.message);
      }
    }

    res.json({
      success: true,
      data: { id: req.params.id, ...req.body, updated: 'Just now' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update analysis'
    });
  }
};

// @desc    Delete an analysis
// @route   DELETE /api/analyses/:id
export const deleteAnalysis = async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    if (isDbConnected()) {
      try {
        await Analysis.findOneAndDelete({
          user: userId,
          $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
        });
      } catch (dbErr) {
        console.warn('[Delete Analysis] MongoDB error:', dbErr.message);
      }
    }

    localStore.deleteAnalysis(userId, req.params.id);

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete analysis'
    });
  }
};

// @desc    Reset analyses to system defaults
// @route   POST /api/analyses/reset
export const resetDefaultAnalyses = async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    if (isDbConnected()) {
      try {
        await Analysis.deleteMany({ user: userId });
        const seeded = DEFAULT_ANALYSES.map((item) => ({
          ...item,
          user: userId
        }));
        const newAnalyses = await Analysis.insertMany(seeded);
        return res.json({
          success: true,
          count: newAnalyses.length,
          data: newAnalyses
        });
      } catch (dbErr) {
        console.warn('[Reset Analyses] MongoDB error, resetting local store:', dbErr.message);
      }
    }

    const data = localStore.getAnalyses(userId);
    return res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset analyses'
    });
  }
};
