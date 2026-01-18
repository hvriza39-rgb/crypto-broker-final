'use client'; 

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Initial Data
const INITIAL_COINS = [
  { id: 'btc', sym: 'BTC / USD', price: 67250.12, change: 1.24 },
  { id: 'eth', sym: 'ETH / USD', price: 3450.87, change: -0.84 },
  { id: 'sol', sym: 'SOL / USD', price: 145.22, change: 3.12 },
  { id: 'xrp', sym: 'XRP / USD', price: 0.62, change: 0.45 },
];

export default function LandingPage() {
  const [coins, setCoins] = useState(INITIAL_COINS);

  // The "Heartbeat" Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(currentCoins => 
        currentCoins.map(coin => {
          const move = (Math.random() - 0.5) * 0.5; 
          const newPrice = coin.price * (1 + move / 100);
          const newChange = coin.change + move;

          return {
            ...coin,
            price: newPrice,
            change: newChange
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1220] relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Hero Text */}
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Trade crypto with <br className="hidden lg:block" />
            <span className="text-blue-500">confidence</span> on BrokerX
          </h1>
          
          <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
            A professional-grade platform with institutional security, low fees, 
            and advanced tools—built for serious traders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              {/* Replaced <Button> with standard <button> to fix import error */}
              <button className="w-full sm:w-auto h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20">
                Create Account
              </button>
            </Link>
            
            <Link href="/login" className="w-full sm:w-auto">
              {/* Replaced <Button> with standard <button> to fix import error */}
              <button className="w-full sm:w-auto h-14 px-8 rounded-xl border border-white/10 hover:bg-white/5 text-white font-medium transition-all">
                Login
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side: LIVE Market Card */}
        <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur-sm mt-8 lg:mt-0">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-400 font-medium">Live Market Snapshot</h3>
            <span className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full animate-pulse">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Live Updates
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {coins.map((coin) => {
              const isPositive = coin.change >= 0;
              const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
              const bgClass = isPositive ? 'bg-green-500/20' : 'bg-red-500/20';

              return (
                <div key={coin.id} className="flex items-center justify-between bg-[#0b1220] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all duration-500">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgClass} text-xs font-bold text-white transition-colors duration-500`}>
                      {coin.sym.substring(0, 3)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{coin.sym}</div>
                      <div className="text-xs text-gray-500">Perpetual</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-mono font-medium transition-all duration-300">
                      ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs ${colorClass} transition-colors duration-500`}>
                      {isPositive ? '+' : ''}{coin.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 h-1 w-full bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 rounded-full opacity-50"></div>
        </div>

      </main>
    </div>
  );
}