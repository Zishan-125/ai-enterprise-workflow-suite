import React from 'react';
import { LogOut, Users, Settings, Crown, Zap, X } from 'lucide-react';
import { portalConfig } from '../../config/portalConfig';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  currentView: string;
  setCurrentView: (view: any) => void;
  isPro: boolean;
  onLogout: () => void;
  isSidebarOpen: boolean; // Added
  setIsSidebarOpen: (open: boolean) => void; // Added
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, setActiveCategory, currentView, setCurrentView, isPro, onLogout, isSidebarOpen, setIsSidebarOpen 
}) => {
  const sidebarContent = (
    <aside className={`w-72 bg-slate-950 text-white p-6 flex flex-col h-full border-r border-white/5 shadow-2xl lg:shadow-none`}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setCurrentView('dashboard'); setActiveCategory('All'); setIsSidebarOpen(false);}}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><Zap size={20} /></div>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">SMARTDO {isPro && <span className="text-indigo-400 text-[10px]">PRO</span>}</h1>
        </div>
        {/* Mobile Close Button */}
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        {Object.keys(portalConfig).map(cat => (
          <button 
            key={cat} 
            onClick={() => { setActiveCategory(cat); setCurrentView('dashboard'); setIsSidebarOpen(false); }} 
            className={`flex items-center gap-3 w-full p-3 rounded-xl text-xs font-bold transition-all ${activeCategory === cat && currentView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {React.createElement(portalConfig[cat].icon, { size: 16 })} {cat}
          </button>
        ))}
        <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
          <button onClick={() => {setCurrentView('team'); setIsSidebarOpen(false);}} className={`flex items-center gap-3 w-full p-3 text-xs font-bold ${currentView === 'team' ? 'text-white' : 'text-slate-500'}`}><Users size={16} /> Team</button>
        </div>
      </nav>

      <div className="pt-6 border-t border-white/10 space-y-2">
        {!isPro && <button onClick={() => {setCurrentView('billing'); setIsSidebarOpen(false);}} className="flex items-center gap-3 w-full p-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-600 text-white"><Crown size={16} /> Upgrade PRO</button>}
        <button onClick={() => {setCurrentView('settings'); setIsSidebarOpen(false);}} className={`flex items-center gap-3 w-full p-3 rounded-xl text-xs font-bold ${currentView === 'settings' ? 'text-white bg-white/10' : 'text-slate-500'}`}><Settings size={16} /> Settings</button>
        <button onClick={onLogout} className="flex items-center gap-3 w-full p-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10"><LogOut size={16} /> Logout</button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar with Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;