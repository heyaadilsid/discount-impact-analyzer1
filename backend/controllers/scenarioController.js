import mongoose from 'mongoose';
import Scenario from '../models/Scenario.js';
import { localStore } from '../services/localStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

const DEFAULT_SCENARIO = {
  name: 'Everyday Backpack (Canvas Edition)',
  horizon: '7-Day Flash',
  sku: 'EBP-CV-019',
  basePrice: 1000,
  cost: 600,
  baseVolume: 100,
  tiers: [
    {
      id: 'tier-0',
      name: 'Baseline (Status Quo)',
      discountPercent: 0,
      volumeUpliftPercent: 0,
      isBaseline: true
    },
    {
      id: 'tier-a',
      name: 'Tier A: 5% Flash',
      discountPercent: 5,
      volumeUpliftPercent: 15,
      isBaseline: false
    },
    {
      id: 'tier-b',
      name: 'Tier B: 10% Standard',
      discountPercent: 10,
      volumeUpliftPercent: 35,
      isBaseline: false
    },
    {
      id: 'tier-c',
      name: 'Tier C: 20% Aggressive',
      discountPercent: 20,
      volumeUpliftPercent: 60,
      isBaseline: false
    }
  ]
};

// @desc    Get user scenario comparison state
// @route   GET /api/scenarios
export const getScenario = async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    if (isDbConnected()) {
      try {
        let scenario = await Scenario.findOne({ user: userId });

        if (!scenario) {
          scenario = await Scenario.create({
            ...DEFAULT_SCENARIO,
            user: userId
          });
        }

        return res.json({
          success: true,
          data: scenario
        });
      } catch (dbErr) {
        console.warn('[Get Scenario] MongoDB error, checking local store:', dbErr.message);
      }
    }

    const localScen = localStore.getScenario(userId);
    return res.json({
      success: true,
      data: localScen
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get scenario'
    });
  }
};

// @desc    Save/update user scenario
// @route   PUT /api/scenarios
export const saveScenario = async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    const { name, sku, horizon, basePrice, cost, baseVolume, tiers } = req.body;

    if (isDbConnected()) {
      try {
        let scenario = await Scenario.findOne({ user: userId });

        if (!scenario) {
          scenario = new Scenario({ user: userId });
        }

        if (name !== undefined) scenario.name = name;
        if (sku !== undefined) scenario.sku = sku;
        if (horizon !== undefined) scenario.horizon = horizon;
        if (basePrice !== undefined) scenario.basePrice = Number(basePrice);
        if (cost !== undefined) scenario.cost = Number(cost);
        if (baseVolume !== undefined) scenario.baseVolume = Number(baseVolume);
        if (tiers !== undefined) scenario.tiers = tiers;

        await scenario.save();

        return res.json({
          success: true,
          data: scenario
        });
      } catch (dbErr) {
        console.warn('[Save Scenario] MongoDB error, saving to local store:', dbErr.message);
      }
    }

    const saved = localStore.saveScenario(userId, req.body);
    return res.json({
      success: true,
      data: saved
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save scenario'
    });
  }
};
