export const userProfile = {
  fullName: 'Emmanuel Okoro',
  email: 'emmanuel@example.com',
  phone: '+2348012345678',
  country: 'Nigeria',
  dob: '1994-06-12',
  kycStatus: 'Verified',
  avatarUrl: ''
};

export const balances = {
  portfolio: 25430.12,
  available: 18340.55,
  pnl: 1240.77,
  currency: 'USD'
};

export const watchlist = [
  { symbol: 'BTC', price: 67250.12, change: 1.24 },
  { symbol: 'ETH', price: 3450.87, change: -0.84 },
  { symbol: 'SOL', price: 145.22, change: 3.12 },
  { symbol: 'BNB', price: 598.44, change: 0.56 },
  { symbol: 'XRP', price: 0.92, change: -1.12 }
];

export const transactions = [
  { id: 'tx_001', type: 'Deposit', asset: 'USDT', amount: 1000, status: 'Completed', date: '2026-01-10' },
  { id: 'tx_002', type: 'Trade', asset: 'BTC', amount: 0.02, status: 'Filled', date: '2026-01-11' },
  { id: 'tx_003', type: 'Withdrawal', asset: 'ETH', amount: 0.5, status: 'Pending', date: '2026-01-12' },
  { id: 'tx_004', type: 'Deposit', asset: 'USDT', amount: 2500, status: 'Completed', date: '2026-01-13' }
];

export const deposits = [
  { id: 'dep_001', network: 'ERC20', asset: 'USDT', amount: 500, status: 'Completed', date: '2026-01-09' },
  { id: 'dep_002', network: 'TRC20', asset: 'USDT', amount: 1500, status: 'Completed', date: '2026-01-12' }
];

export const withdrawals = [
  { id: 'wd_001', network: 'BTC', asset: 'BTC', amount: 0.01, status: 'Completed', date: '2026-01-08' },
  { id: 'wd_002', network: 'ERC20', asset: 'USDT', amount: 300, status: 'Pending', date: '2026-01-13' }
];

export const orders = {
  open: [
    { id: 'ord_001', pair: 'BTC/USDT', side: 'Buy', type: 'Limit', price: 67000, amount: 0.02, status: 'Open', date: '2026-01-13' }
  ],
  history: [
    { id: 'ord_002', pair: 'ETH/USDT', side: 'Sell', type: 'Market', price: 3440, amount: 0.5, status: 'Filled', date: '2026-01-12' }
  ]
};

export const devices = [
  { id: 'dev_001', device: 'Android 13', location: 'Owerri, Nigeria', lastActive: '2026-01-13 11:20' },
  { id: 'dev_002', device: 'Windows 11', location: 'Owerri, Nigeria', lastActive: '2026-01-12 19:05' }
];

export const loginActivity = [
  { id: 'log_001', time: '2026-01-13 11:20', ip: '102.89.12.45', status: 'Success' },
  { id: 'log_002', time: '2026-01-12 19:05', ip: '102.89.12.45', status: 'Success' }
];
