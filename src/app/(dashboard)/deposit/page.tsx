'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Bitcoin, Hexagon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function DepositPage() {
  const [wallets, setWallets] = useState({ btc: '', evm: '' });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Selection State: 'BTC' or 'EVM'
  const [selectedNetwork, setSelectedNetwork] = useState<'BTC' | 'EVM'>('BTC');

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        
        // Save both addresses from the API
        setWallets({
          btc: data.btcAddress || '',
          evm: data.evmAddress || ''
        });
      } catch (err) {
        toast.error('Failed to load wallet addresses');
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  // Determine which address to show based on the toggle
  const currentAddress = selectedNetwork === 'BTC' ? wallets.btc : wallets.evm;

  const handleCopy = () => {
    if (!currentAddress) return;
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    toast.success('Address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <Toaster position="bottom-center" />
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Deposit Funds</h1>
        <p className="text-gray-400">Select a network and send funds to the address below.</p>
      </div>

      <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Network Selector Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setSelectedNetwork('BTC')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              selectedNetwork === 'BTC' 
                ? 'bg-orange-500/10 border-orange-500 text-orange-500 shadow-lg shadow-orange-900/20' 
                : 'bg-[#0b1220] border-white/5 text-gray-400 hover:bg-white/5'
            }`}
          >
            <Bitcoin size={28} />
            <span className="font-bold">Bitcoin</span>
          </button>

          <button 
            onClick={() => setSelectedNetwork('EVM')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              selectedNetwork === 'EVM' 
                ? 'bg-purple-500/10 border-purple-500 text-purple-500 shadow-lg shadow-purple-900/20' 
                : 'bg-[#0b1220] border-white/5 text-gray-400 hover:bg-white/5'
            }`}
          >
            <Hexagon size={28} />
            <span className="font-bold">USDT / ETH</span>
          </button>
        </div>

        {/* Address Display Section */}
        <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
          <div className="w-full">
            <label className="block text-sm text-gray-400 mb-2 text-center">
              Official {selectedNetwork === 'BTC' ? 'Bitcoin' : 'EVM'} Deposit Address
            </label>
            
            {loading ? (
              <div className="h-14 bg-white/5 rounded-xl animate-pulse w-full"></div>
            ) : (
              <div className="relative group">
                <div className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 text-center font-mono text-lg text-white break-all">
                  {currentAddress || 'Contact Support for Address'}
                </div>
                
                <button 
                  onClick={handleCopy}
                  disabled={!currentAddress}
                  className="absolute right-2 top-2 p-2 bg-[#1a1f2e] hover:bg-blue-600 rounded-lg border border-white/10 transition-all text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Copy Address"
                >
                  {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </button>
              </div>
            )}
          </div>

          <div className={`border rounded-xl p-4 text-sm text-center w-full ${
            selectedNetwork === 'BTC' 
              ? 'bg-orange-500/10 border-orange-500/20 text-orange-200' 
              : 'bg-purple-500/10 border-purple-500/20 text-purple-200'
          }`}>
            ⚠️ Send only <strong>{selectedNetwork === 'BTC' ? 'BTC (Bitcoin Network)' : 'USDT/ETH (ERC20/BEP20)'}</strong> to this address.
          </div>
        </div>
      </div>
    </div>
  );
}