export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

// Helper to get auth header with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth endpoints
  async register(data) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Registration failed');
    if (result.token) localStorage.setItem('token', result.token);
    return result;
  },

  async login(data) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Login failed');
    if (result.token) localStorage.setItem('token', result.token);
    return result;
  },

  async demoLogin() {
    const res = await fetch(`${API_BASE_URL}/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Demo login failed');
    if (result.token) localStorage.setItem('token', result.token);
    return result;
  },

  async getMe() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      localStorage.removeItem('token');
      return null;
    }
    return await res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Profile update failed');
    return result;
  },

  // Analyses endpoints
  async getAnalyses() {
    const res = await fetch(`${API_BASE_URL}/analyses`, {
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch analyses');
    return result.data || [];
  },

  async createAnalysis(data) {
    const res = await fetch(`${API_BASE_URL}/analyses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to save analysis');
    return result.data;
  },

  async deleteAnalysis(id) {
    const res = await fetch(`${API_BASE_URL}/analyses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to delete analysis');
    return result;
  },

  // Scenarios
  async getScenario() {
    const res = await fetch(`${API_BASE_URL}/scenarios`, {
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch scenario');
    return result.data;
  },

  async saveScenario(data) {
    const res = await fetch(`${API_BASE_URL}/scenarios`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update scenario');
    return result.data;
  }
};
