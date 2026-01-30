'use client';

import { useState, useEffect } from 'react';
import StockChart from '@/components/StockChart';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '@/utils/api';
import Link from 'next/link';


ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioPage() {

   type Holding = {
      symbol: string,
      name: string,
      shares: number,
      price: number,
      change: number
   };

   // Mock Data (simulating API response)
   const [balance, setBalance] = useState({ total: 0, change: 0 });

   const [holdings, setHoldings] = useState<Holding[]>([]);

   useEffect(() => {
      const fetchPortfolio = async () => {
         try {
            const response = await api.get("api/portfolio/profile");
            const { assets, cashBalance } = response.data;

            const reformatHoldings = assets.map((asset: any) => {
               const changePercent = asset.avgPrice > 0 ? ((asset.currentPrice - asset.avgPrice) / asset.avgPrice * 100) : 0;
               return {
                  symbol: asset.symbol,
                  name: asset.symbol,
                  shares: asset.quantity,
                  price: asset.currentPrice,
                  change: parseFloat(changePercent.toFixed(2)),
               };
            });
            setHoldings(reformatHoldings);

            const assetsValue = assets.reduce((total: number, asset: any) => total + asset.currentValue, 0);
            const totalBalance = assetsValue + cashBalance;
            const oldBalance = assets.reduce((total: number, asset: any) => total + asset.avgPrice * asset.quantity, 0);
            const changePercent = oldBalance > 0 ? ((totalBalance - oldBalance) / oldBalance * 100) : 0;
            setBalance({
               total: totalBalance,
               change: parseFloat(changePercent.toFixed(2)),
            });
         } catch (error) {
            console.error("Failed to fetch portfolio: ", error);
         }
      };
      fetchPortfolio();
   }, [])

   // Chart Data Preparation
   const chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
         {
            label: 'Portfolio Value',
            data: [10000, 10500, 10200, 11000, 11800, 12500],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.4
         },
      ],
   };

   const allocationData = {
      labels: holdings.map(h => h.symbol),
      datasets: [
         {
            label: '# of Shares',
            data: holdings.map(h => h.shares),
            backgroundColor: [
               'rgba(255, 99, 132, 0.6)',
               'rgba(54, 162, 235, 0.6)',
               'rgba(255, 206, 86, 0.6)',
            ],
            borderColor: [
               'rgba(255, 99, 132, 1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
         },
      ],
   };

   return (
      <div className="min-h-screen bg-black text-white p-6 pt-24 font-sans">
         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">

            {/* Left Column: Summary & Chart */}
            <div className="lg:col-span-2 space-y-8">
               <header>
                  <h1 className="text-4xl font-bold mb-2 text-gradient">My Portfolio</h1>
                  <p className="text-gray-400">Welcome back!</p>
               </header>

               {/* Balance Card */}
               <div className="glass-card p-6 rounded-2xl flex justify-between items-center">
                  <div>
                     <p className="text-sm text-gray-400">Total Balance</p>
                     <h2 className="text-3xl font-bold">${balance.total.toLocaleString()}</h2>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${balance.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                     {balance.change >= 0 ? '+' : ''}{balance.change}%
                  </div>
               </div>

               {/* Main Chart */}
               <div className="h-[400px]">
                  <StockChart type="line" data={chartData} title="Performance History" />
               </div>
            </div>

            {/* Right Column: Holdings & Allocation */}
            <div className="space-y-8">
               {/* Allocation Chart */}
               <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Asset Allocation</h3>
                  <div className="h-[250px] flex justify-center">
                     <StockChart type="doughnut" data={allocationData} />
                  </div>
               </div>

               {/* Holdings List */}
               <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Your Assets</h3>
                  <div className="space-y-4">
                     {holdings.map((stock) => (
                        <div key={stock.symbol} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-sm">
                                 {stock.symbol[0]}
                              </div>
                              <div>
                                 <p className="font-bold group-hover:text-blue-400 transition-colors">{stock.symbol}</p>
                                 <p className="text-xs text-gray-400">{stock.shares} Shares</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-bold">${stock.price}</p>
                              <p className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                 {stock.change >= 0 ? '+' : ''}{stock.change}%
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
                  <Link href="/add-asset">
                     <button className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all font-semibold">
                        + Add Asset
                     </button>
                  </Link>
               </div>
            </div>

         </div>
      </div>
   );
}
