import React from 'react';
import { Search, Download, Sparkles, Menu, Lock } from 'lucide-react';
import { useAIStore } from '../../store/useAIStore';

interface HeaderProps {
  config: any;
  currentView: string;
  darkMode: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuClick: () => void;
  activityCount: number;
  onLogClick: () => void;
  onDownloadReport: () => void;
  isPro: boolean; // Added to handle conditional styling
}

const Header: React.FC<HeaderProps> = ({ 
  config, 
  currentView, 
  darkMode, 
  searchQuery, 
  setSearchQuery, 
  onMenuClick,
  activityCount,
  onLogClick,
  onDownloadReport,
  isPro // Destructured
}) => {
  const toggleChat = useAIStore((state) => state.toggleChat);

  return (
    <header className={`h-24 flex items-center justify-between px-10 border-b shrink-0 z-20 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
      <div className="flex items-center gap-8">
        <button onClick={onMenuClick} className="lg:hidden p-2">
          <Menu size={20} />
        </button>
        <div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${config?.text || 'text-indigo-500'}`}>Portal Node</span>
          <h2 className="text-3xl font-black tracking-tight">
            {currentView === 'dashboard' ? (config?.greeting || 'DASHBOARD') : currentView.toUpperCase()}
          </h2>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="hidden md:flex flex-1 max-w-md mx-10 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search protocols..."
          className={`w-full pl-12 pr-4 py-3 rounded-2xl text-xs font-bold outline-none transition-all ${
            darkMode 
              ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 text-white' 
              : 'bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 text-slate-900'
          } border-2`}
        />
      </div>

      <div className="flex items-center gap-4">
        {/* PRO-RESTRICTED EXPORT REPORT BUTTON */}
        <button 
          onClick={onDownloadReport}
          title={isPro ? "Export System Report" : "Upgrade to Pro to Export"}
          className={`p-3 rounded-xl transition-all flex items-center gap-2 group relative ${
            darkMode 
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          } ${!isPro && 'opacity-80'}`}
        >
          {isPro ? (
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
          ) : (
            <Lock size={16} className="text-amber-500" />
          )}
          
          <span className="hidden xl:inline text-[10px] font-black uppercase tracking-widest">
            Report
          </span>

          {!isPro && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-[8px] text-black px-1.5 py-0.5 rounded-md font-black">
              PRO
            </span>
          )}
        </button>

        <button 
          onClick={onLogClick}
          className={`relative p-3 rounded-xl font-black text-[10px] uppercase transition-all ${
            darkMode ? 'text-slate-400 bg-slate-800 hover:bg-slate-700' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          Activity {activityCount > 0 && <span className="ml-1 text-indigo-500">{activityCount}</span>}
        </button>
        
        <button onClick={() => toggleChat()} className={`${config?.theme || 'bg-indigo-600'} text-white px-6 py-3 rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-lg hover:opacity-90 transition-all`}>
          <Sparkles size={16} /> Neural Brain
        </button>
      </div>
    </header>
  );
};

export default Header;