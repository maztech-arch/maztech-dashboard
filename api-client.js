// API Client for Maztech Dashboard
// Replace hardcoded mock data with real API calls

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : process.env.REACT_APP_API_URL || '/api';

// Transactions API
export const transactionsAPI = {
  list: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);

    const res = await fetch(`${API_BASE}/transactions?${params}`);
    return res.json();
  },

  create: async (txn, slipFile = null) => {
    const formData = new FormData();
    formData.append('type', txn.type);
    formData.append('label', txn.label);
    formData.append('amount', txn.amount);
    formData.append('category', txn.category);
    formData.append('payment_method', txn.payment_method);
    formData.append('service_note', txn.service_note);
    if (slipFile) formData.append('slip', slipFile);

    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
    return res.json();
  }
};

// Finance API
export const financeAPI = {
  summary: async () => {
    const res = await fetch(`${API_BASE}/finance/summary`);
    return res.json();
  },

  pl: async () => {
    const res = await fetch(`${API_BASE}/finance/pl`);
    return res.json();
  },

  bankAccounts: async () => {
    const res = await fetch(`${API_BASE}/finance/bank-accounts`);
    return res.json();
  },

  fixedCosts: async () => {
    const res = await fetch(`${API_BASE}/finance/fixed-costs`);
    return res.json();
  }
};

// Repair Jobs API
export const repairJobsAPI = {
  list: async (status = null) => {
    const url = status && status !== 'all'
      ? `${API_BASE}/repair-jobs?status=${status}`
      : `${API_BASE}/repair-jobs`;
    const res = await fetch(url);
    return res.json();
  },

  create: async (job) => {
    const res = await fetch(`${API_BASE}/repair-jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    return res.json();
  },

  update: async (id, updates) => {
    const res = await fetch(`${API_BASE}/repair-jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  }
};

// Customers API
export const customersAPI = {
  list: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.tag) params.append('tag', filters.tag);

    const res = await fetch(`${API_BASE}/customers?${params}`);
    return res.json();
  },

  create: async (customer) => {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    return res.json();
  },

  get: async (id) => {
    const res = await fetch(`${API_BASE}/customers/${id}`);
    return res.json();
  }
};

// Appointments API
export const appointmentsAPI = {
  week: async () => {
    const res = await fetch(`${API_BASE}/appointments/week`);
    return res.json();
  },

  today: async () => {
    const res = await fetch(`${API_BASE}/appointments/today`);
    return res.json();
  },

  create: async (apt) => {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apt)
    });
    return res.json();
  }
};

// Inventory API
export const inventoryAPI = {
  parts: async () => {
    const res = await fetch(`${API_BASE}/inventory/parts`);
    return res.json();
  },

  alerts: async () => {
    const res = await fetch(`${API_BASE}/inventory/alerts`);
    return res.json();
  },

  updateQuantity: async (sku, quantity) => {
    const res = await fetch(`${API_BASE}/inventory/parts/${sku}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity_on_hand: quantity })
    });
    return res.json();
  }
};

// Partners API
export const partnersAPI = {
  list: async () => {
    const res = await fetch(`${API_BASE}/partners`);
    return res.json();
  },

  calculateDividend: async (dividend_percentage = 60) => {
    const res = await fetch(`${API_BASE}/partners/dividend/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dividend_percentage })
    });
    return res.json();
  },

  recordPayout: async (payout) => {
    const res = await fetch(`${API_BASE}/partners/dividend/payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payout)
    });
    return res.json();
  }
};
