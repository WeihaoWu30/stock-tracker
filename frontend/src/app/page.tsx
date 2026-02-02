"use client";

import Link from "next/link";

export default function Home() {
   return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
         {/* Animated Background Orbs */}
         <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[150px] pointer-events-none animate-float" />
         <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-600/25 rounded-full blur-[120px] pointer-events-none animate-float-delayed" />
         <div className="absolute bottom-20 left-1/3 w-[350px] h-[350px] bg-pink-600/20 rounded-full blur-[100px] pointer-events-none animate-float-slow" />

         {/* Subtle Grid Pattern */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

         {/* Hero Section */}
         <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center z-10 relative pt-16">
            {/* Live Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 animate-fade-in hover:border-white/20 transition-colors">
               <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
               <span className="text-sm font-medium text-gray-300">Live Market Data</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
               <span className="block">Track Your Wealth</span>
               <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  In Real Time
               </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-lg text-gray-400 mb-12 animate-slide-up opacity-0" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
               Monitor your portfolio, analyze market trends, and make smarter investment decisions with our powerful tracking platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
               <Link
                  href="/Login"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 font-semibold rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
               >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
               </Link>
               <a
                  href="https://github.com/WeihaoWu30/stock-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border border-white/20 hover:bg-white/10 hover:border-white/30 rounded-2xl transition-all duration-300 font-medium hover:scale-105"
               >
                  View on GitHub
               </a>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
               </svg>
            </div>
         </main>

         {/* Features Section */}
         <section className="max-w-6xl mx-auto px-4 py-24 z-10 relative">
            <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in">Powerful Features</h2>
            <p className="text-gray-400 text-center mb-16 animate-fade-in">Everything you need to track your investments</p>

            <div className="grid md:grid-cols-3 gap-6">
               {[
                  { title: "Real-time Data", desc: "Live price updates from major exchanges worldwide.", icon: "📈" },
                  { title: "Portfolio Analytics", desc: "Deep insights into your asset allocation and performance.", icon: "📊" },
                  { title: "Smart Alerts", desc: "Get notified when stocks hit your target price.", icon: "🔔" }
               ].map((feature, i) => (
                  <div
                     key={i}
                     className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-default hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
                     style={{ animationDelay: `${i * 0.1}s` }}
                  >
                     <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                     </div>
                     <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">{feature.title}</h3>
                     <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* Footer */}
         <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5">
            <p>© {new Date().getFullYear()} StockTracker. Built with Next.js & Tailwind CSS.</p>
         </footer>
      </div>
   );
}
