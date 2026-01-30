"use client";

import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   // Avoid hydration mismatch by only rendering after mount
   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return <div className="w-10 h-10" />; // Placeholder
   }

   return (
      <button
         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
         className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10 backdrop-blur-sm"
         aria-label="Toggle Theme"
      >
         {theme === "dark" ? (
            // Moon Icon
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="20"
               height="20"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               className="text-blue-400"
            >
               <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
         ) : (
            // Sun Icon
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="20"
               height="20"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               className="text-yellow-500"
            >
               <circle cx="12" cy="12" r="4" />
               <path d="M12 2v2" />
               <path d="M12 20v2" />
               <path d="m4.93 4.93 1.41 1.41" />
               <path d="m17.66 17.66 1.41 1.41" />
               <path d="M2 12h2" />
               <path d="M20 12h2" />
               <path d="m6.34 17.66-1.41 1.41" />
               <path d="m19.07 4.93-1.41 1.41" />
            </svg>
         )}
      </button>
   );
}
