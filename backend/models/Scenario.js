import mongoose from 'mongoose';

const tierSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    discountPercent: { type: Number, required: true },
    volumeUpliftPercent: { type: Number, required: true },
    isBaseline: { type: Boolean, default: false }
  },
  { _id: false }
);

const scenarioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    name: {
      type: String,
      default: 'Everyday Backpack (Canvas Edition)'
    },
    sku: {
      type: String,
      default: 'EBP-CV-019'
    },
    horizon: {
      type: String,
      default: '7-Day Flash'
    },
    basePrice: {
      type: Number,
      default: 1000
    },
    cost: {
      type: Number,
      default: 600
    },
    baseVolume: {
      type: Number,
      default: 100
    },
    tiers: [tierSchema]
  },
  {
    timestamps: true
  }
);

const Scenario = mongoose.model('Scenario', scenarioSchema);
export default Scenario;
