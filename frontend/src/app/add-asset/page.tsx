"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import api from "@/utils/api";

function AddAssetContent() {
   const searchParams = useSearchParams();
   const id = searchParams.get("id");
   const router = useRouter();
   const [formData, setFormData] = useState({
      symbol: "",
      quantity: "",
      price: "",
   });
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [query, setQuery] = useState([]);
   const [showDropdown, setDropdown] = useState(false);

   interface QueryMatch {
      qSymbol: string;
      qName: string;
   }

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
         // const response = await api.get("api/portfolio/price", { params: { symbol: formData.symbol } });
         // const { price } = response.data;
         await api.post("/api/portfolio/buy", {
            symbol: formData.symbol.toUpperCase(),
            quantity: formData.quantity,
            id: id
         });
         router.push(`/portfolio/${id}`);
      } catch (error) {
         console.log(error);
         setError("Failed to add asset");
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen p-6 pt-24 font-sans bg-black/5 dark:bg-black text-foreground">
         <div className="max-w-md mx-auto animate-slide-up">
            <div className="glass-card p-8 rounded-2xl">
               <header className="mb-8 text-center">
                  <h1 className="text-3xl font-bold mb-2 text-gradient">Add New Asset</h1>
                  <p className="text-secondary">Track a new stock in your portfolio</p>
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
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                        value={formData.symbol}
                        onChange={(e) => {
                           setFormData({ ...formData, symbol: e.target.value });
                           setDropdown(true);
                        }}
                        onFocus={() => setDropdown(true)}
                     />
                     {showDropdown && query.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                           {query.map((q: QueryMatch, index: number) => (
                              <li
                                 key={index}
                                 className="p-3 hover:bg-blue-600/20 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFormData(prev => ({ ...prev, symbol: q.qSymbol }));
                                    setDropdown(false);
                                    setQuery([]);
                                 }}
                              >
                                 <div className="font-bold text-blue-400">{q.qSymbol}</div>
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
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                     />
                  </div>

                  {/* <div className="space-y-2">
                     <label className="text-sm font-medium text-secondary">Buy Price ($)</label>
                     <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                     />
                  </div> */}

                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {loading ? "Adding..." : "Add to Portfolio"}
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}

export default function AddAssetPage() {
   return (
      <Suspense fallback={<div className="min-h-screen pt-24 text-center text-white">Loading...</div>}>
         <AddAssetContent />
      </Suspense>
   );
}
