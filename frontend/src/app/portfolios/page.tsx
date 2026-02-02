"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utils/api";

type Portfolio = {
   id: string;
   name: string;
   totalBalance: number;
};

export default function PortfoliosPage() {
   const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [newName, setNewName] = useState("");
   const [creating, setCreating] = useState(false);

   const fetchPortfolios = async () => {
      try {
         const response = await api.get("/api/portfolio/list");
         setPortfolios(response.data.allPortfolios || []);
      } catch (error) {
         console.error("Failed to fetch portfolios:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchPortfolios();
   }, []);

   const handleCreate = async () => {
      if (!newName.trim()) return;
      setCreating(true);
      try {
         await api.post("/api/portfolio/create", { name: newName });
         setNewName("");
         setShowModal(false);
         fetchPortfolios();
      } catch (error) {
         console.error("Failed to create portfolio:", error);
      } finally {
         setCreating(false);
      }
   };

   const handleDelete = async (id: string) => {
      if (!confirm(`Delete "${id}"? This cannot be undone.`)) return;
      try {
         await api.delete("/api/portfolio/delete", { params: { id } });
         fetchPortfolios();
      } catch (error) {
         console.error("Failed to delete portfolio:", error);
      }
   };

   return (
      <div className="min-h-screen bg-black text-white p-6 pt-24 font-sans">
         <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h1 className="text-4xl font-bold text-gradient">My Portfolios</h1>
                  <p className="text-gray-400 mt-2">Manage all your investment portfolios</p>
               </div>
               <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105"
               >
                  + New Portfolio
               </button>
            </div>

            {/* Loading State */}
            {loading && (
               <div className="text-center py-20 text-gray-400">Loading portfolios...</div>
            )}

            {/* Empty State */}
            {!loading && portfolios.length === 0 && (
               <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-2xl flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                     </svg>
                  </div>
                  <h2 className="text-xl font-bold mb-2">No portfolios yet</h2>
                  <p className="text-gray-400 mb-6">Create your first portfolio to start tracking investments</p>
                  <button
                     onClick={() => setShowModal(true)}
                     className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all"
                  >
                     Create Portfolio
                  </button>
               </div>
            )}

            {/* Portfolio Cards Grid */}
            {!loading && portfolios.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolios.map((portfolio, index) => (
                     <div
                        key={portfolio.id || index}
                        className="group relative rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                     >
                        {/* Delete Button */}
                        <button
                           onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(portfolio.id);
                           }}
                           className="absolute top-4 right-4 z-20 p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                           title="Delete Portfolio"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                           </svg>
                        </button>

                        <Link href={`/portfolio/${portfolio.id}`} className="block p-6 h-full">
                           {/* Portfolio Icon */}
                           <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                                 <path d="M3 3v18h18" />
                                 <path d="m19 9-5 5-4-4-3 3" />
                              </svg>
                           </div>

                           {/* Portfolio Info */}
                           <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                              {portfolio.name}
                           </h3>
                           <p className="text-2xl font-bold text-gradient">
                              ${portfolio.totalBalance?.toLocaleString() || "0"}
                           </p>
                           <p className="text-sm text-gray-400 mt-1">Total Balance</p>
                        </Link>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Create Modal Overlay */}
         {showModal && (
            <div
               className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-in"
               onClick={() => setShowModal(false)}
            >
               <div
                  className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 animate-slide-up"
                  onClick={(e) => e.stopPropagation()}
               >
                  <h2 className="text-2xl font-bold mb-6">Create New Portfolio</h2>
                  <input
                     type="text"
                     placeholder="Portfolio Name (e.g., Retirement)"
                     value={newName}
                     onChange={(e) => setNewName(e.target.value)}
                     className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none mb-6"
                     autoFocus
                  />
                  <div className="flex gap-4">
                     <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all font-medium"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleCreate}
                        disabled={creating || !newName.trim()}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-semibold transition-all disabled:opacity-50"
                     >
                        {creating ? "Creating..." : "Create"}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
