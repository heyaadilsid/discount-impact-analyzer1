import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    id: {
      type: String,
      required: true
    },
    campaign: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true
    },
    edition: {
      type: String,
      default: 'Standard Edition',
      trim: true
    },
    category: {
      type: String,
      default: 'General Merchandising',
      trim: true
    },
    sku: {
      type: String,
      default: 'SKU-001',
      trim: true
    },
    horizon: {
      type: String,
      default: '7-Day Flash',
      trim: true
    },
    basePrice: {
      type: Number,
      required: true,
      default: 1000
    },
    cost: {
      type: Number,
      required: true,
      default: 600
    },
    baseVolume: {
      type: Number,
      required: true,
      default: 100
    },
    discountPercent: {
      type: Number,
      required: true,
      default: 10
    },
    volumeUpliftPercent: {
      type: Number,
      required: true,
      default: 35
    },
    status: {
      type: String,
      default: 'Sustainable'
    },
    updated: {
      type: String,
      default: 'Just now'
    }
  },
  {
    timestamps: true
  }
);

// Compound index for user and id
analysisSchema.index({ user: 1, id: 1 });

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
