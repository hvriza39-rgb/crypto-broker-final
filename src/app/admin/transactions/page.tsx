'use client';

import { useState, useEffect } from 'react';
import { Check, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function AdminTransactionsPage() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  // Fetch Pending Deposits
  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/deposits');
      const data = await res.json();
      setDeposits(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load deposits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // 1. Open the Confirmation Modal
  const initiateAction = (id: string, action: 'approve' | 'reject') => {
    setSelectedTx(id);
    setActionType(action);
    setShowModal(true);
  };

  // 2. Execute the Action (Called when clicking "Confirm" in modal)
  const executeAction = async () => {
    if (!selectedTx || !actionType) return;

    setProcessing(selectedTx);
    const loadingToast = toast.loading(`Processing ${actionType}...`);
    setShowModal(false); // Close modal immediately

    try {
      const res = await fetch('/api/admin/deposits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: selectedTx, action: actionType })
      });
      
      const data = await res.json();

      if (res.ok) {
        toast.success(`Deposit ${actionType}d successfully!`, { id: loadingToast });
        fetchDeposits(); // Refresh list
      } else {
        toast.error(data.error || 'Action failed', { id: loadingToast });
      }
    } catch (err) {
      toast.error("Connection error", { id: loadingToast });
    } finally {
      setProcessing(null);
      setSelectedTx(null);
      setActionType(null);
    }
  };

  return (
    <div className="p-6 relative">
      {/* Toast Notification Provider */}
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#1a1f2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }}/>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Transaction Management</h1>
        <button onClick={fetchDeposits} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white transition-colors">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading requests...</div>
        ) : deposits.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No pending deposits found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs uppercase">
                  <th className="p-4">User</th>
                  <th className="p-4">Asset</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Proof / TxID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {deposits.map((tx: any) => (
                  <tr key={tx._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold">{tx.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{tx.user?.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-bold">
                        {tx.asset}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">{tx.network}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-lg text-green-400">
                      ${tx.amount.toLocaleString()}
                    </td>
                    <td className="p-4 max-w-[150px] truncate text-xs text-gray-400 font-mono" title={tx.proof}>
                      {tx.proof || 'N/A'}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {tx.date}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => initiateAction(tx._id, 'approve')}
                          disabled={!!processing}
                          className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => initiateAction(tx._id, 'reject')}
                          disabled={!!processing}
                          className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50"
                        >
                          <X size={18} />
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

      {/* --- CUSTOM CONFIRMATION MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1f2e] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full transform scale-100 transition-all">
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-full mb-4 ${actionType === 'approve' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {actionType === 'approve' ? <Check size={32} /> : <AlertTriangle size={32} />}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 capitalize">
                {actionType} Transaction?
              </h3>
              
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to <strong>{actionType}</strong> this deposit? 
                {actionType === 'approve' ? ' This will add funds to the user\'s balance.' : ' This will mark the transaction as rejected.'}
              </p>

              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeAction}
                  className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                    actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20' 
                    : 'bg-red-600 hover:bg-red-500 shadow-red-900/20'
                  }`}
                >
                  Confirm {actionType === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}