'use client';

import { useState, useEffect } from 'react';
import StockChart from '@/components/StockChart';
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '@/utils/api';
import Link from 'next/link';


ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioPage() {

   const router = useRouter();

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

   const params = useParams();
   const id = params.id as string;

   const fetchPortfolio = async () => {
      try {
         const response = await api.post("api/portfolio/profile", { id: id });
         const { assets, name, totalBalance, previousBalance } = response.data;

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

         // const assetsValue = assets.reduce((total: number, asset: any) => total + asset.currentValue, 0);
         // const totalBalance = assetsValue + cashBalance;
         // const oldBalance = assets.reduce((total: number, asset: any) => total + asset.avgPrice * asset.quantity, 0);
         const changePercent = previousBalance > 0 ? ((totalBalance - previousBalance) / previousBalance * 100) : 0;
         setBalance({
            total: totalBalance,
            change: parseFloat(changePercent.toFixed(2)),
         });
      } catch (error) {
         console.error("Failed to fetch portfolio: ", error);
      }
   };

   useEffect(() => {
      fetchPortfolio();
   }, []);

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
                                 <p className="text-xs text-gray-400">{stock.shares} Share(s)</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="text-right">
                                 <p className="font-bold">${stock.price}</p>
                                 <p className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                                 </p>
                              </div>
                              <button
                                 className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-full text-red-500 transition-all flex items-center justify-center border border-transparent hover:border-red-500/30"
                                 title="Delete Asset"
                                 onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    await api.post("/api/portfolio/sell", {
                                       symbol: stock.symbol,
                                       quantity: stock.shares,
                                       id: id
                                    })
                                    fetchPortfolio();
                                 }
                                 }
                              >
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                 </svg>
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                     <Link href={`/add-asset?id=${id}`} className="w-full">
                        <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all font-semibold">
                           + Add
                        </button>
                     </Link>
                     <Link href={`/sell-asset?id=${id}`} className="w-full">
                        <button className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-500 rounded-xl transition-all font-semibold">
                           - Sell
                        </button>
                     </Link>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
}
