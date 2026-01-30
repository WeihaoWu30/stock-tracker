"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
   children: React.ReactNode;
   defaultTheme?: Theme;
   storageKey?: string;
};

type ThemeProviderState = {
   theme: Theme;
   setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
   theme: "dark",
   setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
   children,
   defaultTheme = "dark",
   storageKey = "vite-ui-theme",
   ...props
}: ThemeProviderProps) {
   const [theme, setTheme] = useState<Theme>(defaultTheme);

   useEffect(() => {
      // Access localStorage only on client mount
      const storedTheme = window.localStorage.getItem(storageKey) as Theme;
      if (storedTheme) {
         setTheme(storedTheme);
      }
   }, [storageKey]);

   useEffect(() => {
      const root = window.document.documentElement;

      root.classList.remove("light", "dark");
      root.classList.add(theme);

      // Add data-attribute for consistency with some libraries
      root.setAttribute("data-theme", theme);

      window.localStorage.setItem(storageKey, theme);
   }, [theme, storageKey]);

   const value = {
      theme,
      setTheme: (theme: Theme) => {
         setTheme(theme);
      },
   };

   return (
      <ThemeProviderContext.Provider value={value} {...props}>
         {children}
      </ThemeProviderContext.Provider>
   );
}

// Add ...props to allow passing extra props but extract defaultTheme and storageKey
function ThemeProviderWrapper(props: ThemeProviderProps) {
   return <ThemeProvider {...props} />;
}


export const useTheme = () => {
   const context = useContext(ThemeProviderContext);

   if (context === undefined)
      throw new Error("useTheme must be used within a ThemeProvider");

   return context;
};
