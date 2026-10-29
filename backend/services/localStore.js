import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'db_fallback.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

const DEFAULT_SCENARIO = {
  name: 'Everyday Backpack (Canvas Edition)',
  horizon: '7-Day Flash',
  sku: 'EBP-CV-019',
  basePrice: 1000,
  cost: 600,
  baseVolume: 100,
  tiers: [
    { id: 'tier-0', name: 'Baseline (Status Quo)', discountPercent: 0, volumeUpliftPercent: 0, isBaseline: true },
    { id: 'tier-a', name: 'Tier A: 5% Flash', discountPercent: 5, volumeUpliftPercent: 15, isBaseline: false },
    { id: 'tier-b', name: 'Tier B: 10% Standard', discountPercent: 10, volumeUpliftPercent: 35, isBaseline: false },
    { id: 'tier-c', name: 'Tier C: 20% Aggressive', discountPercent: 20, volumeUpliftPercent: 60, isBaseline: false }
  ]
};

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[localStore] Error reading file:', err);
  }

  // Initial state with demo user
  const demoSalt = bcrypt.genSaltSync(10);
  const demoPasswordHash = bcrypt.hashSync('Password123!', demoSalt);

  const initialData = {
    users: [
      {
        _id: 'demo_user_001',
        name: 'Arjun Verma',
        email: 'arjun@retailstore.com',
        password: demoPasswordHash,
        storeName: "Arjun's Store",
        workspaceName: 'Retail Workspace',
        role: 'Store Manager',
        currency: 'INR',
        createdAt: new Date().toISOString()
      }
    ],
    analyses: {
      'demo_user_001': [...DEFAULT_ANALYSES]
    },
    scenarios: {
      'demo_user_001': { ...DEFAULT_SCENARIO }
    }
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  } catch (e) {
    console.error('[localStore] Error writing initial data:', e);
  }

  return initialData;
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[localStore] Error persisting data:', err);
  }
}

export const localStore = {
  // Users
  findUserByEmail(email) {
    const data = readData();
    const normalized = email.toLowerCase().trim();
    return data.users.find(u => u.email.toLowerCase().trim() === normalized) || null;
  },

  findUserById(id) {
    const data = readData();
    const strId = String(id);
    return data.users.find(u => String(u._id) === strId) || null;
  },

  async createUser({ name, email, password, storeName, workspaceName, role, currency }) {
    const data = readData();
    const normalized = email.toLowerCase().trim();

    const existing = data.users.find(u => u.email.toLowerCase().trim() === normalized);
    if (existing) {
      throw new Error('An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      _id: 'local_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      email: normalized,
      password: passwordHash,
      storeName: storeName || `${name}'s Store`,
      workspaceName: workspaceName || 'Retail Workspace',
      role: role || 'Store Manager',
      currency: currency || 'INR',
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);

    // Seed default analyses for new user
    if (!data.analyses) data.analyses = {};
    data.analyses[newUser._id] = DEFAULT_ANALYSES.map(a => ({ ...a, id: `RUN-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*100)}` }));

    // Seed default scenario for new user
    if (!data.scenarios) data.scenarios = {};
    data.scenarios[newUser._id] = { ...DEFAULT_SCENARIO };

    writeData(data);
    return newUser;
  },

  updateUser(id, updates) {
    const data = readData();
    const strId = String(id);
    const idx = data.users.findIndex(u => String(u._id) === strId);
    if (idx === -1) return null;

    data.users[idx] = {
      ...data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.users[idx];
  },

  async verifyPassword(user, enteredPassword) {
    if (!user || !user.password) return false;
    return await bcrypt.compare(enteredPassword, user.password);
  },

  // Analyses
  getAnalyses(userId) {
    const data = readData();
    const strId = String(userId);
    if (!data.analyses) data.analyses = {};
    if (!data.analyses[strId] || data.analyses[strId].length === 0) {
      data.analyses[strId] = [...DEFAULT_ANALYSES];
      writeData(data);
    }
    return data.analyses[strId];
  },

  createAnalysis(userId, analysisData) {
    const data = readData();
    const strId = String(userId);
    if (!data.analyses) data.analyses = {};
    if (!data.analyses[strId]) data.analyses[strId] = [];

    const newAnalysis = {
      _id: 'analysis_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ...analysisData,
      id: analysisData.id || `RUN-${Date.now().toString().slice(-4)}`,
      user: strId,
      createdAt: new Date().toISOString()
    };

    data.analyses[strId].unshift(newAnalysis);
    writeData(data);
    return newAnalysis;
  },

  deleteAnalysis(userId, analysisId) {
    const data = readData();
    const strId = String(userId);
    if (!data.analyses || !data.analyses[strId]) return false;

    data.analyses[strId] = data.analyses[strId].filter(
      a => String(a._id) !== String(analysisId) && String(a.id) !== String(analysisId)
    );
    writeData(data);
    return true;
  },

  // Scenarios
  getScenario(userId) {
    const data = readData();
    const strId = String(userId);
    if (!data.scenarios) data.scenarios = {};
    if (!data.scenarios[strId]) {
      data.scenarios[strId] = { ...DEFAULT_SCENARIO };
      writeData(data);
    }
    return data.scenarios[strId];
  },

  saveScenario(userId, scenarioData) {
    const data = readData();
    const strId = String(userId);
    if (!data.scenarios) data.scenarios = {};
    data.scenarios[strId] = {
      ...scenarioData,
      user: strId,
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.scenarios[strId];
  }
};
