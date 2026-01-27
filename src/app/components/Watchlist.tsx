'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

const COINS = [
  { name: 'Bitcoin', symbol: 'BTC', price: 42350.20, change: 2.4 },
  { name: 'Ethereum', symbol: 'ETH', price: 2240.15, change: -1.2 },
  { name: 'Solana', symbol: 'SOL', price: 95.50, change: 5.8 },
  { name: 'Cardano', symbol: 'ADA', price: 0.52, change: 0.8 },
];

export default function Watchlist() {
  return (
    <div className="space-y-4">
      {COINS.map((coin) => (
        <div key={coin.symbol} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
              {coin.symbol[0]}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{coin.name}</p>
              <p className="text-gray-500 text-xs">{coin.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-mono text-sm">${coin.price.toLocaleString()}</p>
            <p className={`text-xs flex items-center justify-end gap-1 ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {coin.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(coin.change)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}