import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateAnalysis } from '../utils/calculations';
import { api, API_BASE_URL } from '../services/api';

const AppContext = createContext();

export const INITIAL_SAVED_ANALYSES = [
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

export const INITIAL_FORM = {
  title: 'Q4 Festive Flash — Canvas Backpack',
  sku: 'BP-102',
  horizon: '7-Day Flash',
  basePrice: 1000,
  cost: 600,
  baseVolume: 100,
  discountPercent: 10,
  volumeUpliftPercent: 35
};

export const INITIAL_SCENARIO_BASELINE = {
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

export function AppProvider({ children }) {
  // Navigation: 'landing' | 'overview' | 'new-analysis' | 'scenario-comparison' | 'saved-analyses' | 'settings'
  const [currentPage, setCurrentPage] = useState('landing');
  const [currency, setCurrency] = useState('INR');
  const [savedAnalyses, setSavedAnalyses] = useState(INITIAL_SAVED_ANALYSES);
  const [currentForm, setCurrentForm] = useState(INITIAL_FORM);
  const [scenarioState, setScenarioState] = useState(INITIAL_SCENARIO_BASELINE);
  const [globalSearch, setGlobalSearch] = useState('');
  const [toasts, setToasts] = useState([]);
  const [storeName, setStoreName] = useState("Arjun's Store");
  const [workspaceName, setWorkspaceName] = useState('Retail Workspace');
  const [backendConnected, setBackendConnected] = useState(false);

  // Authentication State: User profile and Auth modal state
  const [currentUser, setCurrentUser] = useState({
    name: 'Arjun Verma',
    email: 'arjun@retailstore.com',
    role: 'Store Manager',
    isLoggedIn: false
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [importSheetModalOpen, setImportSheetModalOpen] = useState(false);

  const openImportModal = () => setImportSheetModalOpen(true);
  const closeImportModal = () => setImportSheetModalOpen(false);

  // Trigger toast
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch initial data from backend if token or logged in
  useEffect(() => {
    async function initSession() {
      try {
        const healthRes = await fetch(`${API_BASE_URL}/health`);
        if (healthRes.ok) {
          setBackendConnected(true);
        }
      } catch {
        setBackendConnected(false);
      }

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.getMe();
          if (res && res.user) {
            setCurrentUser({
              ...res.user,
              isLoggedIn: true
            });
            if (res.user.storeName) setStoreName(res.user.storeName);
            if (res.user.workspaceName) setWorkspaceName(res.user.workspaceName);
            if (res.user.currency) setCurrency(res.user.currency);

            // Fetch stored analyses from MongoDB
            const items = await api.getAnalyses();
            if (items && items.length > 0) {
              setSavedAnalyses(items);
            }
          }
        } catch (e) {
          console.warn('Initial session restore error:', e);
        }
      }
    }

    initSession();
  }, []);

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const loginUser = async ({ email, password }) => {
    try {
      const res = await api.login({ email, password });

      if (res && res.user) {
        setCurrentUser({
          ...res.user,
          isLoggedIn: true
        });
        if (res.user.storeName) setStoreName(res.user.storeName);
        if (res.user.workspaceName) setWorkspaceName(res.user.workspaceName);
        if (res.user.currency) setCurrency(res.user.currency);

        const items = await api.getAnalyses();
        if (items && items.length > 0) {
          setSavedAnalyses(items);
        }

        setAuthModalOpen(false);
        addToast(`Signed in successfully as ${res.user.name}!`, 'success');
        navigate('overview');
        return { success: true };
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.message || 'Wrong email or password';
      addToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const demoLoginUser = async () => {
    try {
      const res = await api.demoLogin();
      if (res && res.user) {
        setCurrentUser({
          ...res.user,
          isLoggedIn: true
        });
        if (res.user.storeName) setStoreName(res.user.storeName);
        if (res.user.workspaceName) setWorkspaceName(res.user.workspaceName);

        const items = await api.getAnalyses();
        if (items && items.length > 0) {
          setSavedAnalyses(items);
        }

        setAuthModalOpen(false);
        addToast('Signed in with Demo Manager account!', 'success');
        navigate('overview');
      }
    } catch (err) {
      console.error('Demo login error:', err);
      addToast(err.message || 'Demo login failed', 'error');
      throw err;
    }
  };

  const signupUser = async ({ name, email, password, storeName: newStore }) => {
    try {
      const res = await api.register({
        name,
        email,
        password: password || 'Password123!',
        storeName: newStore
      });

      if (res && res.user) {
        setCurrentUser({
          ...res.user,
          isLoggedIn: true
        });
        if (newStore) setStoreName(newStore);

        const items = await api.getAnalyses();
        if (items && items.length > 0) {
          setSavedAnalyses(items);
        }

        setAuthModalOpen(false);
        addToast(`Account created! Welcome, ${name}!`, 'success');
        navigate('overview');
        return { success: true };
      }
    } catch (err) {
      console.error('Signup error:', err);
      const msg = err.message || 'Registration failed';
      addToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setCurrentUser({
      name: 'Guest',
      email: '',
      role: 'Viewer',
      isLoggedIn: false
    });
    addToast('Signed out of workspace', 'info');
    navigate('landing');
  };

  // Navigate with scroll to top
  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load a saved item or sample SKU into the New Analysis form
  const loadAnalysisIntoForm = (analysisItem, navigateToPage = true) => {
    setCurrentForm({
      id: analysisItem.id || `RUN-${Date.now().toString().slice(-4)}`,
      title: analysisItem.campaign || analysisItem.title || 'Custom Campaign',
      sku: analysisItem.sku || 'SKU-001',
      horizon: analysisItem.horizon || '7-Day Flash',
      basePrice: analysisItem.basePrice || 1000,
      cost: analysisItem.cost || 600,
      baseVolume: analysisItem.baseVolume || 100,
      discountPercent: analysisItem.discountPercent || 10,
      volumeUpliftPercent: analysisItem.volumeUpliftPercent || 35
    });

    if (navigateToPage) {
      navigate('new-analysis');
    }
    addToast(`Loaded "${analysisItem.campaign || analysisItem.title || 'Campaign'}" into simulator`, 'info');
  };

  // Compare an item in Scenario Comparison
  const loadIntoScenarioComparison = (item) => {
    setScenarioState({
      name: item.campaign || item.title || 'Everyday Backpack (Canvas Edition)',
      horizon: item.horizon || '7-Day Flash',
      sku: item.sku || 'EBP-CV-019',
      basePrice: item.basePrice || 1000,
      cost: item.cost || 600,
      baseVolume: item.baseVolume || 100,
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
          name: `Tier B: ${item.discountPercent || 10}% Standard`,
          discountPercent: item.discountPercent || 10,
          volumeUpliftPercent: item.volumeUpliftPercent || 35,
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
    });
    navigate('scenario-comparison');
    addToast(`Opened Scenario Comparison for ${item.campaign || item.title || 'Campaign'}`, 'info');
  };

  // Save current analysis to MongoDB
  const saveCurrentAnalysis = async () => {
    const calc = calculateAnalysis(currentForm);
    const newEntry = {
      id: `RUN-${new Date().getFullYear()}-${String(savedAnalyses.length + 1).padStart(3, '0')}`,
      campaign: currentForm.title || 'Untitled Campaign',
      edition: 'Standard Run',
      category: 'General Merchandising',
      sku: currentForm.sku || 'SKU-NEW',
      horizon: currentForm.horizon || '7-Day Flash',
      basePrice: currentForm.basePrice,
      cost: currentForm.cost,
      baseVolume: currentForm.baseVolume,
      discountPercent: currentForm.discountPercent,
      volumeUpliftPercent: currentForm.volumeUpliftPercent,
      status: calc.riskClassification,
      updated: 'Just now'
    };

    try {
      const saved = await api.createAnalysis(newEntry);
      setSavedAnalyses(prev => [saved || newEntry, ...prev]);
      addToast(`Saved analysis "${newEntry.campaign}" to MongoDB Atlas!`, 'success');
    } catch {
      setSavedAnalyses(prev => [newEntry, ...prev]);
      addToast(`Saved analysis "${newEntry.campaign}" to ledger!`, 'success');
    }
  };

  // Delete saved analysis
  const deleteAnalysis = async (id) => {
    try {
      await api.deleteAnalysis(id);
    } catch (e) {
      console.warn('API delete error:', e);
    }
    setSavedAnalyses(prev => prev.filter(item => item.id !== id && item._id !== id));
    addToast('Analysis removed from archive', 'info');
  };

  // Export data as CSV
  const exportLedgerCSV = (itemsToExport = savedAnalyses) => {
    const headers = ['ID', 'Campaign', 'SKU', 'Horizon', 'Base Price', 'Cost (COGS)', 'Base Volume', 'Discount %', 'Modeled Lift %', 'Status', 'Updated'];
    const rows = itemsToExport.map(item => [
      `"${item.id}"`,
      `"${item.campaign}"`,
      `"${item.sku}"`,
      `"${item.horizon}"`,
      item.basePrice,
      item.cost,
      item.baseVolume,
      `${item.discountPercent}%`,
      `${item.volumeUpliftPercent}%`,
      `"${item.status}"`,
      `"${item.updated}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial-ledger-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Financial ledger exported to CSV successfully', 'success');
  };

  // Import analyses batch from parsed sheet data
  const importAnalysesFromSheet = async (items) => {
    if (!items || items.length === 0) return;

    const imported = [];
    for (const item of items) {
      const calc = calculateAnalysis(item);
      const newEntry = {
        id: item.id || `RUN-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`,
        campaign: item.campaign || item.title || 'Imported Campaign',
        edition: item.edition || 'Standard Run',
        category: item.category || 'General Merchandising',
        sku: item.sku || 'SKU-IMP',
        horizon: item.horizon || '7-Day Flash',
        basePrice: Number(item.basePrice) || 1000,
        cost: Number(item.cost) || 600,
        baseVolume: Number(item.baseVolume) || 100,
        discountPercent: Number(item.discountPercent) || 10,
        volumeUpliftPercent: Number(item.volumeUpliftPercent) || 25,
        status: item.status || calc.riskClassification || 'Sustainable',
        updated: 'Imported just now'
      };

      try {
        const saved = await api.createAnalysis(newEntry);
        imported.push(saved || newEntry);
      } catch {
        imported.push(newEntry);
      }
    }

    setSavedAnalyses(prev => [...imported, ...prev]);
    addToast(`Successfully imported ${imported.length} ${imported.length === 1 ? 'campaign' : 'campaigns'} from sheet!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        currency,
        setCurrency,
        savedAnalyses,
        setSavedAnalyses,
        currentForm,
        setCurrentForm,
        scenarioState,
        setScenarioState,
        loadAnalysisIntoForm,
        loadIntoScenarioComparison,
        saveCurrentAnalysis,
        deleteAnalysis,
        exportLedgerCSV,
        importAnalysesFromSheet,
        importSheetModalOpen,
        openImportModal,
        closeImportModal,
        globalSearch,
        setGlobalSearch,
        toasts,
        addToast,
        removeToast,
        storeName,
        setStoreName,
        workspaceName,
        setWorkspaceName,
        currentUser,
        setCurrentUser,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        authMode,
        setAuthMode,
        loginUser,
        demoLoginUser,
        signupUser,
        logoutUser,
        backendConnected
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
