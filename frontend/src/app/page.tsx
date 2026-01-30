import Link from "next/link";
import Image from "next/image";

export default function Home() {
   return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
         {/* Background Gradients */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

         {/* Hero Section */}
         <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center z-10 relative">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8 animate-fade-in">
               <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
               <span className="text-sm font-medium text-gray-300">Live Market Data</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
               Track Your Wealth <br />
               <span className="text-gradient">In Real Time</span>
            </h1>

            <p className="max-w-2xl text-lg text-gray-400 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
               Monitor your portfolio, analyze trends, and make data-driven decisions with our powerful stock tracking platform.
            </p>

            <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
               <Link
                  href="/Login"
                  className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
               >
                  Get Started
               </Link>
               <a
                  href="https://github.com/WeihaoWu30/stock-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 border border-white/20 hover:bg-white/10 rounded-full transition-all"
               >
                  View Code
               </a>
            </div>
         </main>

         {/* Features Grid */}
         <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-6 z-10 relative">
            {[
               { title: "Real-time Data", desc: "Live price updates from major exchanges worldwide.", icon: "ShowChart" },
               { title: "Portfolio Analytics", desc: "Deep dive into your asset allocation and performance.", icon: "PieChart" },
               { title: "Smart Alerts", desc: "Get notified when stocks hit your target price.", icon: "Notifications" }
            ].map((feature, i) => (
               <div key={i} className="glass-card p-6 rounded-xl hover:bg-white/15 transition-all cursor-default">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center text-xl font-bold">
                     {i + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
               </div>
            ))}
         </section>

         <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/10">
            <p>© {new Date().getFullYear()} Stock Tracker. Built with Next.js & Tailwind.</p>
         </footer>
      </div>
   );
}
