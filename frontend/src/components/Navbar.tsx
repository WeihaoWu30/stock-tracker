"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import api from "@/utils/api";

export default function Navbar() {
   const router = useRouter();
   const [settingsOpen, setSettingsOpen] = useState(false);
   const [isLoggedIn, setIsLoggedIn] = useState(false);

   // Check auth state on mount
   useEffect(() => {
      const checkAuth = async () => {
         try {
            await api.get("/auth/user");
            setIsLoggedIn(true);
         } catch {
            setIsLoggedIn(false);
         }
      };
      checkAuth();
   }, []);

   const handleLogout = async () => {
      try {
         await api.post("/auth/logout");
         setIsLoggedIn(false);
         router.push("/Login");
      } catch (error) {
         console.error("Logout failed:", error);
         router.push("/Login");
      }
   };

   return (
      <>
         {/* Navbar */}
         <nav className="fixed top-0 left-0 right-0 z-40 h-16 px-6 flex items-center justify-between bg-black/60 backdrop-blur-2xl border-b border-white/5">
            {/* Logo / Home */}
            <Link href="/" className="flex items-center gap-3 group">
               <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-105 transition-all duration-300">
                     ST
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
               </div>
               <span className="font-bold text-lg bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">StockTracker</span>
            </Link>

            {/* Right Side Buttons */}
            <div className="flex items-center gap-2">
               {/* Portfolio Button - only show when logged in */}
               {isLoggedIn && (
                  <Link
                     href="/portfolios"
                     className="p-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                     title="Portfolios"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors">
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                     </svg>
                  </Link>
               )}

               {/* Profile Button - only show when logged in */}
               {isLoggedIn && (
                  <Link
                     href="/profile"
                     className="p-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                     title="Profile"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                     </svg>
                  </Link>
               )}

               {/* Settings Button */}
               <button
                  onClick={() => setSettingsOpen(true)}
                  className="p-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                  title="Settings"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors">
                     <circle cx="12" cy="12" r="3" />
                     <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
               </button>

               {/* Divider */}
               <div className="w-px h-6 bg-white/10 mx-1" />

               {/* Login / Logout Button */}
               {isLoggedIn ? (
                  <button
                     onClick={handleLogout}
                     className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-200 border border-white/10 hover:border-white/20"
                  >
                     Logout
                  </button>
               ) : (
                  <Link
                     href="/Login"
                     className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                  >
                     Login
                  </Link>
               )}
            </div>
         </nav>

         {/* Settings Panel Overlay */}
         {settingsOpen && (
            <div
               className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
               onClick={() => setSettingsOpen(false)}
            />
         )}

         {/* Settings Panel */}
         <div className={`fixed top-0 right-0 z-50 h-full w-80 bg-black/90 backdrop-blur-2xl border-l border-white/10 p-6 transform transition-transform duration-300 ease-out ${settingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Settings</h2>
               <button
                  onClick={() => setSettingsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M18 6 6 18" />
                     <path d="m6 6 12 12" />
                  </svg>
               </button>
            </div>

            {/* Theme Toggle */}
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <span className="font-medium text-gray-300">Theme</span>
                  <ThemeToggle />
               </div>

               {/* More settings placeholder */}
               <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-500">More settings coming soon...</p>
               </div>
            </div>
         </div>
      </>
   );
}
