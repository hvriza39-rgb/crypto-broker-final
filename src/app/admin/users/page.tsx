'use client';

import { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for the Balance Modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  // Fetch Users
  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      const userList = Array.isArray(data) ? data : (data.users || []);
      setUsers(userList);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Balance Update (Add or Subtract)
  async function handleBalanceUpdate(operation: 'add' | 'subtract') {
    if (!selectedUser || !amount) return;
    setProcessing(true);

    try {
      // 👇 Calling YOUR specific backend route
      const res = await fetch(`/api/admin/users/${selectedUser.id}/balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          operation, 
          amount: parseFloat(amount) 
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Update failed');

      // Success! Refresh the list to show new balance
      alert(`Successfully ${operation === 'add' ? 'added' : 'deducted'} $${amount}`);
      setAmount('');
      setSelectedUser(null);
      fetchUsers();

    } catch (error: any) {
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  }

  if (loading) return <div className="p-6 text-white">Loading users...</div>;

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>
      
      <div className="grid gap-4">
        {users.length > 0 ? (
          users.map((user) => (
            <Card key={user.id || user._id} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-lg">{user.name || 'Unnamed'}</p>
                  {user.role === 'admin' && (
                    <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded">Admin</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{user.email}</p>
                <div className="mt-2 flex items-center gap-4">
                  <p className="text-green-400 font-mono">
                    Bal: ${user.portfolioBalance?.toLocaleString() || '0.00'}
                  </p>
                </div>
              </div>
              
              {/* Manage Balance Button */}
              <Button 
                onClick={() => setSelectedUser(user)} 
                className="bg-blue-600 hover:bg-blue-500 text-sm"
              >
                Manage Balance
              </Button>
            </Card>
          ))
        ) : (
          <p className="text-gray-400">No users found.</p>
        )}
      </div>

      {/* BALANCE MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1f2e] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Manage Funds</h2>
            <p className="text-gray-400 text-sm mb-6">
              Updating balance for <span className="text-white">{selectedUser.email}</span>
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Amount ($)</label>
                <Input 
                  type="number"
                  placeholder="0.00"
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button 
                  onClick={() => handleBalanceUpdate('add')} 
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-500"
                >
                  + Deposit
                </Button>
                <Button 
                  onClick={() => handleBalanceUpdate('subtract')}
                  disabled={processing} 
                  className="bg-red-600 hover:bg-red-500"
                >
                  - Withdraw
                </Button>
              </div>

              <Button 
                onClick={() => { setSelectedUser(null); setAmount(''); }} 
                className="w-full mt-2 bg-transparent hover:bg-white/5 text-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}