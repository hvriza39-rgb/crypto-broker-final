'use client';

import { useState, useEffect } from 'react';
import { Save, Wallet, Bitcoin, Hexagon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [btcAddress, setBtcAddress] = useState('');
  const [evmAddress, setEvmAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.btcAddress) setBtcAddress(data.btcAddress);
        if (data.evmAddress) setEvmAddress(data.evmAddress);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  // 2. Save settings
  const handleSave = async () => {
    setLoading(true);
    const loadingToast = toast.loading('Saving...');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ btcAddress, evmAddress })
      });

      if (res.ok) {
        toast.success('Wallet addresses updated!', { id: loadingToast });
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      toast.error('Error saving settings', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white min-h-screen">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1a1f2e', color: '#fff' } }}/>

      <h1 className="text-2xl font-bold mb-6">Platform Settings</h1>

      <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-8 max-w-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600/20 rounded-lg text-blue-500">
            <Wallet size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Deposit Configuration</h2>
            <p className="text-gray-400 text-sm">Set the master wallet addresses for user deposits.</p>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* BTC Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Bitcoin size={16} className="text-orange-500"/> Bitcoin Address (BTC)
            </label>
            <input 
              type="text" 
              value={btcAddress}
              onChange={(e) => setBtcAddress(e.target.value)}
              placeholder="bc1q..."
              className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-mono text-sm"
            />
          </div>

          {/* EVM Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Hexagon size={16} className="text-purple-500"/> EVM Address (ETH, USDT, BNB)
            </label>
            <input 
              type="text" 
              value={evmAddress}
              onChange={(e) => setEvmAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-mono text-sm"
            />
          </div>
          
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 shadow-lg shadow-blue-900/20"
          >
            <Save size={18} /> {loading ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}