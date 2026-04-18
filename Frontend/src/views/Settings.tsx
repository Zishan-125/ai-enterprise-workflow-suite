import React, { useRef } from 'react';
import { 
  Moon, Sun, Bell, Shield, Database, 
  User, Camera, Fingerprint, RefreshCw, 
  Lock, Globe, HardDrive 
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsView = ({ settings, setSettings, profile, setProfile }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      
      {/* 1. PROFILE SECTION */}
      <section>
        <div className="flex items-center gap-2 mb-8">
          <User className="text-indigo-600" size={20} />
          <h3 className="text-2xl font-black italic uppercase tracking-tighter">Identity Core</h3>
        </div>
        
        <div className={`p-8 rounded-[2.5rem] border ${settings.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} shadow-xl`}>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar Upload */}
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-indigo-600/20">
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-indigo-600/60 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl outline-none mt-1 ${settings.darkMode ? 'bg-slate-800 focus:bg-slate-750' : 'bg-slate-50 focus:bg-slate-100'}`} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Neural ID</label>
                  <div className={`w-full px-4 py-3 rounded-xl mt-1 font-mono text-xs flex justify-between items-center ${settings.darkMode ? 'bg-slate-950 text-indigo-400' : 'bg-slate-100 text-indigo-600'}`}>
                    {profile.neuralId}
                    <Fingerprint size={14} />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Bio / Directive</label>
                <textarea 
                  rows={2}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl outline-none mt-1 resize-none ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SYSTEM CONFIGURATION */}
      <section>
        <div className="flex items-center gap-2 mb-8">
          <HardDrive className="text-indigo-600" size={20} />
          <h3 className="text-2xl font-black italic uppercase tracking-tighter">System Protocols</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: 'darkMode', label: 'Dark Mode', icon: settings.darkMode ? Moon : Sun, desc: 'Optimized neural interface' },
            { id: 'notifications', label: 'Push Sync', icon: Bell, desc: 'Real-time update alerts' },
            { id: 'aiPersonalization', label: 'Neural Learning', icon: Database, desc: 'Adaptive AI workflows' },
            { id: 'biometricLock', label: 'Biometric Security', icon: Shield, desc: 'Hardware-level protection' }
          ].map((item) => (
            <motion.div 
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleSetting(item.id)}
              className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${
                settings[item.id] 
                  ? 'border-indigo-600 bg-indigo-600/5' 
                  : settings.darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-white'
              }`}
            >
              <div className="flex gap-4 items-center">
                <div className={`p-3 rounded-2xl ${settings[item.id] ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="font-black uppercase text-xs italic tracking-tight">{item.label}</p>
                  <p className="text-[10px] text-slate-500 font-bold">{item.desc}</p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings[item.id] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${settings[item.id] ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. DANGER ZONE / UTILITIES */}
      <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border ${settings.darkMode ? 'border-slate-800 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}>
            <RefreshCw size={14} /> Sync All Nodes
          </button>
          <button className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border ${settings.darkMode ? 'border-slate-800 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}>
            <Lock size={14} /> Clear Cache
          </button>
          <button className="flex items-center justify-center gap-2 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-rose-600/10 text-rose-600 border border-rose-600/20 hover:bg-rose-600 hover:text-white transition-all">
            Deactivate Node
          </button>
        </div>
      </section>

    </div>
  );
};

export default SettingsView;