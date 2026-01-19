'use client';

import { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, ShieldCheck, ShieldAlert, User, X, Check, Save } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// Define User Type
interface User {
  _id: string;
  name: string;
  email: string;
  balance: number;
  country: string;
  phone: string;
  verified: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Search
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = users.filter((u) => 
      (u.name?.toLowerCase() || '').includes(lower) || 
      (u.email?.toLowerCase() || '').includes(lower)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Open Edit Modal
  const openEditModal = (user: User) => {
    setCurrentUser({ ...user }); // Copy user data
    setIsEditOpen(true);
  };

  // Handle Save Changes
  const handleSave = async () => {
    const loadingToast = toast.loading('Saving changes...');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id, ...currentUser })
      });

      if (res.ok) {
        toast.success('User updated successfully!', { id: loadingToast });
        setIsEditOpen(false);
        fetchUsers();
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      toast.error('Update failed', { id: loadingToast });
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    
    const loadingToast = toast.loading('Deleting user...');
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('User deleted', { id: loadingToast });
        fetchUsers();
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      toast.error('Delete failed', { id: loadingToast });
    }
  };

  return (
    <div className="p-6 text-white min-h-screen relative">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#1a1f2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }}/>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-400 text-sm">Total Users: {users.length}</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        {loading ? <div className="p-10 text-center text-gray-500">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs uppercase font-medium">
                  <th className="p-5 pl-6">User</th>
                  <th className="p-5">Country</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Balance</th>
                  <th className="p-5 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-5 pl-6 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{user.name || 'No Name'}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-5 text-sm text-gray-400">{user.country || '-'}</td>
                    <td className="p-5">
                      {user.verified ? (
                        <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded w-fit">
                          <ShieldCheck size={12} /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded w-fit">
                          <ShieldAlert size={12} /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="p-5 font-mono font-medium">${user.balance.toLocaleString()}</td>
                    <td className="p-5 text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(user)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- EDIT USER MODAL --- */}
      {isEditOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#1a1f2e] border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-lg relative">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit User Details</h2>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Full Name</label>
                  <input type="text" value={currentUser.name} onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Balance ($)</label>
                  <input type="number" value={currentUser.balance} onChange={(e) => setCurrentUser({...currentUser, balance: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400">Email Address</label>
                <input type="text" value={currentUser.email} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Phone</label>
                  <input type="text" value={currentUser.phone} onChange={(e) => setCurrentUser({...currentUser, phone: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Country</label>
                  <input type="text" value={currentUser.country} onChange={(e) => setCurrentUser({...currentUser, country: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${currentUser.verified ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                    {currentUser.verified && <Check size={14} className="text-black" />}
                  </div>
                  <input type="checkbox" checked={currentUser.verified} onChange={(e) => setCurrentUser({...currentUser, verified: e.target.checked})} className="hidden" />
                  <span className="text-sm text-gray-300">Mark Account as Verified</span>
                </label>
              </div>

              <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2">
                <Save size={18} /> Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}