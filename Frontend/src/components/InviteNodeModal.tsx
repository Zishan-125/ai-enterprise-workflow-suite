import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, ShieldAlert } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: { name: string; email: string; role: string }) => void;
  darkMode: boolean;
}

const InviteNodeModal = ({ isOpen, onClose, onInvite, darkMode }: InviteModalProps) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(formData);
    setFormData({ name: '', email: '', role: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[201] p-8 rounded-[2.5rem] border ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            } shadow-2xl`}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Initialize Node</h2>
                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Team Expansion Protocol</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Name Input */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="COLLABORATOR NAME"
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none font-bold text-xs transition-all ${
                      darkMode ? 'bg-slate-950 border-slate-800 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-400'
                    }`}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    required
                    type="email"
                    placeholder="NEURAL ADDRESS (EMAIL)"
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none font-bold text-xs transition-all ${
                      darkMode ? 'bg-slate-950 border-slate-800 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-400'
                    }`}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Role Input */}
                <div className="relative">
                  <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="SECTOR ROLE"
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none font-bold text-xs transition-all ${
                      darkMode ? 'bg-slate-950 border-slate-800 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-400'
                    }`}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Send size={16} /> Sync New Node
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InviteNodeModal;