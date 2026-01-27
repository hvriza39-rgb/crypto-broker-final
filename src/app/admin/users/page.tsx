'use client';

import { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card'; // Adjust path if needed

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();

        // 🛡️ SECURITY FIX: Handle different API formats safely
        // If data is just an array: use it.
        // If data is { users: [...] }: extract the array.
        // If data is null/undefined: use empty array [].
        const userList = Array.isArray(data) 
          ? data 
          : (data.users || data.data || []);

        setUsers(userList);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading users...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>
      
      <div className="grid gap-4">
        {/* SAFE CHECK: Only map if we actually have users */}
        {users.length > 0 ? (
          users.map((user) => (
            <Card key={user.id || user._id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">{user.name || 'Unnamed User'}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                 <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                   {user.role || 'User'}
                 </span>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-400">No users found.</p>
        )}
      </div>
    </div>
  );
}