'use client';
import { useState, useEffect } from 'react';
import api from '@/utils/api';



export default function ProfilePage() {
   // Mock user for now - will connect to real API later
   type User = {
      name: string,
      email: string,
      settings: {
         theme: string,
         notifications: string
      }
   };

   const [user, setUser] = useState<User>();



   useEffect(() => {
      const fetchUser = async () => {
         try {
            const response = await api.get("/auth/user");
            const user = response.data;
            setUser({ name: user.username, email: user.email, settings: { theme: "Dark", notifications: "Enabled" } });
         } catch (error) {
            console.error("Could not load user", error);
         }
      };
      fetchUser();
   }, [])

   if (!user) return <div className="p-24 text-white">Loading...</div>;

   return (
      <div className="min-h-screen bg-black text-white p-6 pt-24">
         <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-4xl font-bold mb-8 text-gradient">My Profile</h1>

            <div className="glass-card p-8 rounded-2xl space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
                     {user.name.charAt(0)}
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold">{user.name}</h2>
                     <p className="text-gray-400">{user.email}</p>
                  </div>
               </div>

               <hr className="border-white/10" />

               <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors">
                     <span className="text-gray-300">Theme Preference</span>
                     <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{user.settings.theme}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors">
                     <span className="text-gray-300">Notifications</span>
                     <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">{user.settings.notifications}</span>
                  </div>
               </div>

               <button className="w-full py-3 mt-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl transition-all font-semibold">
                  Log Out
               </button>
            </div>
         </div>
      </div>
   );
}
