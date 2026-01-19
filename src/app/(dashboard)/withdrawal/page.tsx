'use client';

import { useState, useEffect } from 'react';
import { Wallet, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function WithdrawalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('ERC20');

  // Fetch User Balance
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/user/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.balances) setBalance(data.balances.available);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBalance();
  }, []);

  // Handle Submit
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate Amount
    const numAmount = Number(amount);
    
    if (!amount || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // 2. THE FIX: Custom Toast instead of Browser Alert
    if (numAmount > balance) {
      toast.error("Insufficient funds in account", {
        icon: <AlertCircle className="text-red-500" />,
        style: {
          background: '#1a1f2e',
          color: '#ff4b4b',
          border: '1px solid rgba(255, 75, 75, 0.2)'
        }
      });
      return;
    }

    if (!address) {
      toast.error("Please enter a wallet address");
      return;
    }

    // Proceed with API call
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/transaction/withdraw', { // Make sure this API route exists
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: numAmount,
          address,
          network,
          asset: 'USDT' // Defaulting to USDT for now
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Withdrawal request submitted!");
        setAmount('');
        setAddress('');
        // Refresh balance after a delay
        setTimeout(() => window.location.reload(), 1500); 
      } else {
        toast.error(data.error || "Withdrawal failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1a1f2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }}/>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Withdraw Funds</h1>
        <p className="text-gray-400">Transfer crypto to your external wallet.</p>
      </div>

      <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-8 shadow-xl">
        
        {/* Balance Display */}
        <div className="flex justify-between items-center mb-8 p-4 bg-blue-600/10 border border-blue-600/20 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Wallet size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-200">Available Balance</p>
              <p className="text-xl font-bold font-mono">${balance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-6">
          
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#0b1220] border border-white/10 rounded-xl py-4 pl-8 pr-4 text-white text-lg focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Network Selection */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Network</label>
            <div className="grid grid-cols-3 gap-3">
              {['ERC20', 'TRC20', 'BEP20'].map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setNetwork(net)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                    network === net 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20' 
                      : 'bg-[#0b1220] border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          {/* Address Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Wallet Address</label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Paste your wallet address here"
              className="w-full bg-[#0b1220] border border-white/10 rounded-xl py-4 px-4 text-white focus:border-blue-500 outline-none transition-all font-mono text-sm"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Withdraw Now <ArrowRight size={20} /></>}
          </button>

        </form>
      </div>
    </div>
  );
}