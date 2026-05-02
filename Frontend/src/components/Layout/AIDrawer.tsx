import React, { useState } from 'react';
import { Sparkles, X, Send, Lock, Zap, Brain, ListChecks } from 'lucide-react'; 
import { useAIStore } from '../../store/useAIStore';
import api from '../../api/axios';

interface AIDrawerProps {
  darkMode: boolean;
  isPro: boolean;
  onUpgrade: () => void;
  tasks: any[]; 
}

const AIDrawer = ({ darkMode, isPro, onUpgrade, tasks }: AIDrawerProps) => {
  const { isChatOpen, toggleChat, messages, setMessages } = useAIStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick Action Buttons Data
  const quickActions = [
    { label: "Analyze Workload", icon: <Brain size={12}/>, prompt: "Give me a one-sentence insight about my current tasks." },
    { label: "Prioritize Now", icon: <Zap size={12}/>, prompt: "Which of my tasks is the most critical right now?" },
    { label: "Daily Summary", icon: <ListChecks size={12}/>, prompt: "Summarize my task matrix briefly." }
  ];

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim() || !isPro || loading) return;

    if (tasks.length === 0 && messageToSend.toLowerCase().includes('task')) {
      const warning = { role: 'ai' as const, content: "Neural sensors detect 0 active tasks. Please 'Initialize Task' in the Workstream first." };
      setMessages([...messages, { role: 'user', content: messageToSend }, warning]);
      setInput('');
      return;
    }

    const userMessage = { role: 'user' as const, content: messageToSend };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", { 
        message: messageToSend, 
        tasks 
      });
      setMessages([...updatedMessages, { role: 'ai', content: res.data.reply }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'ai', content: "Neural Link Unstable. System status: Nominal." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-full w-full sm:w-[450px] z-[130] flex flex-col transition-transform duration-500 ${
      isChatOpen ? 'translate-x-0' : 'translate-x-full'
    } ${darkMode ? 'bg-slate-900 border-l border-slate-800' : 'bg-white border-l border-slate-100'} shadow-2xl`}>
      
      {/* Header */}
      <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <span className="font-black text-lg flex items-center gap-2 uppercase tracking-tighter">
          <Sparkles className="text-indigo-500" size={20}/> Neural Brain
        </span>
        <button onClick={() => toggleChat()} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <X size={20}/>
        </button>
      </div>

      {isPro ? (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-bold shadow-sm ${
                  m.role === 'ai' ? (darkMode ? 'bg-slate-800 text-white border border-slate-700' : 'bg-slate-100 text-slate-900 border border-slate-200') : 'bg-indigo-600 text-white'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-[10px] text-indigo-500 animate-pulse font-bold p-4 uppercase tracking-widest">Synthesizing Logic...</div>}
          </div>

          {/* Quick Action Chips & Input */}
          <div className="p-6 border-t border-slate-800/10 dark:border-slate-800">
            {/* Quick Actions List */}
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  disabled={loading}
                  onClick={() => handleSend(action.prompt)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all border ${
                    darkMode ? 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-400'
                  }`}
                >
                  {action.icon} {action.label}
                </button>
              ))}
            </div>

            <div className="relative flex items-center">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                placeholder="Command the AI..." 
                className={`w-full p-4 pr-14 rounded-xl border outline-none font-bold transition-all text-xs ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-400'
                }`} 
              />
              <button onClick={() => handleSend()} className="absolute right-2 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Upgrade View (remains same) */
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <Lock size={40} className="text-amber-500 mb-6" />
          <h3 className="text-2xl font-black italic uppercase mb-4">Pro Feature Locked</h3>
          <button onClick={() => { onUpgrade(); toggleChat(); }} className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black uppercase text-[11px] hover:shadow-lg transition-all">
            Unlock AI Potential
          </button>
        </div>
      )}
    </div>
  );
};

export default AIDrawer;