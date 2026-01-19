'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Watchlist() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Free CoinGecko API
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano,ripple&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await res.json();
        
        // Format data into an array
        const formatted = [
          { name: 'Bitcoin', symbol: 'BTC', ...data.bitcoin },
          { name: 'Ethereum', symbol: 'ETH', ...data.ethereum },
          { name: 'Solana', symbol: 'SOL', ...data.solana },
          { name: 'Ripple', symbol: 'XRP', ...data.ripple },
          { name: 'Cardano', symbol: 'ADA', ...data.cardano },
        ];
        setPrices(formatted);
      } catch (err) {
        console.error("Failed to fetch prices", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every 60s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-gray-500 text-sm p-4">Loading market data...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b border-white/10 text-xs uppercase">
            <th className="pb-3 pl-2">Asset</th>
            <th className="pb-3">Price</th>
            <th className="pb-3 text-right pr-2">24h Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {prices.map((coin) => {
            const isPositive = coin.usd_24h_change >= 0;
            return (
              <tr key={coin.symbol} className="hover:bg-white/5 transition-colors text-sm">
                <td className="py-3 pl-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                    {coin.symbol[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white">{coin.name}</div>
                    <div className="text-xs text-gray-500">{coin.symbol}</div>
                  </div>
                </td>
                <td className="py-3 font-mono text-white">
                  ${coin.usd.toLocaleString()}
                </td>
                <td className={`py-3 text-right pr-2 font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  <div className="flex items-center justify-end gap-1">
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {coin.usd_24h_change.toFixed(2)}%
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}