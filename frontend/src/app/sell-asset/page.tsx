"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import api from "@/utils/api";

export default function SellAssetPage() {
   const searchParams = useSearchParams();
   const id = searchParams.get("id");
   const router = useRouter();
   const [formData, setFormData] = useState({
      symbol: "",
      quantity: "",
   });
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [query, setQuery] = useState([]);
   const [showDropdown, setDropdown] = useState(false);

   useEffect(() => {
      if (!formData.symbol || formData.symbol.length < 1) {
         setQuery([]);
         return;
      }

      const getQuery = async () => {
         try {
            const response = await api.get("api/portfolio/query", { params: { symbol: formData.symbol } });
            setQuery(response.data.results || []);
         } catch (error) {
            console.error("Query did not work");
         }
      }

      const timer = setTimeout(() => {
         getQuery();
      }, 500);

      return () => clearTimeout(timer);
   }, [formData.symbol]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
         await api.post("/api/portfolio/sell", {
            symbol: formData.symbol.toUpperCase(),
            quantity: Number(formData.quantity),
            id: id
         });
         router.push(`/portfolio/${id}`);
      } catch (err: any) {
         setError(err.response?.data?.message || "Failed to sell asset");
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen p-6 pt-24 font-sans bg-black/5 dark:bg-black text-foreground">
         <div className="max-w-md mx-auto animate-slide-up">
            <div className="glass-card p-8 rounded-2xl border-red-500/10">
               <header className="mb-8 text-center">
                  <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Sell Asset</h1>
                  <p className="text-secondary">Reduce your position or exit a trade</p>
               </header>

               <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                     <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                        {error}
                     </div>
                  )}

                  <div className="space-y-2 relative">
                     <label className="text-sm font-medium text-secondary">Stock Symbol</label>
                     <input
                        type="text"
                        required
                        placeholder="e.g., AAPL"
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                        value={formData.symbol}
                        onChange={(e) => {
                           setFormData({ ...formData, symbol: e.target.value });
                           setDropdown(true);
                        }}
                        onFocus={() => setDropdown(true)}
                     />
                     {showDropdown && query.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                           {query.map((q: any, index: number) => (
                              <li
                                 key={index}
                                 className="p-3 hover:bg-red-600/20 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                 onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFormData(prev => ({ ...prev, symbol: q.qSymbol }));
                                    setDropdown(false);
                                    setQuery([]);
                                 }}
                              >
                                 <div className="font-bold text-red-400">{q.qSymbol}</div>
                                 <div className="text-xs text-secondary truncate">{q.qName}</div>
                              </li>
                           ))}
                        </ul>
                     )}
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium text-secondary">Quantity</label>
                     <input
                        type="number"
                        required
                        min="0.0001"
                        step="any"
                        placeholder="0.00"
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full py-4 mt-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {loading ? "Selling..." : "Sell from Portfolio"}
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}
