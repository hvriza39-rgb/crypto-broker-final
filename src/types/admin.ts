export interface AdminProfile {
  id: string;
  email: string;
  role: 'superadmin' | 'admin' | 'auditor';
  name?: string;
}

export interface BrokerSettings {
  depositWallet: string;
  updatedAt: string;
  updatedBy: string;
}
