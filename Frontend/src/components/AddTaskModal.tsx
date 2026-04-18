import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  darkMode: boolean;
  onClose: () => void;
  onAddTask: (task: { 
    title: string; 
    deadline: string; 
    risk: string; 
    status: string; 
    category: string 
  }) => void;
  editingTask?: any; // Added to match App.tsx logic
}

const AddTaskModal = ({ isOpen, darkMode, onClose, onAddTask, editingTask }: ModalProps) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('Personal');

  // Effect to handle editing (if needed)
  React.useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDeadline(editingTask.deadline);
      setPriority(editingTask.risk);
      setCategory(editingTask.category);
    } else {
      setTitle('');
      setDeadline('');
      setPriority('Low');
      setCategory('Personal');
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onAddTask({
      title,
      deadline: deadline || "No deadline",
      risk: priority,
      status: editingTask?.status || "To Do",
      category: category 
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300">
      <div className={`${
        darkMode ? 'bg-slate-900 border-t sm:border border-slate-800 shadow-2xl' : 'bg-white shadow-2xl'
      } rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar`}>
        
        {/* HEADER */}
        <div className={`sticky top-0 z-10 p-6 md:p-8 border-b flex justify-between items-center ${
          darkMode ? 'border-slate-800 bg-slate-900/90 backdrop-blur-md' : 'border-slate-100 bg-white/90 backdrop-blur-md'
        }`}>
          <div>
            <h3 className={`font-black italic uppercase tracking-tighter text-xl ${
              darkMode ? 'text-white' : 'text-slate-800'
            }`}>{editingTask ? 'Update Protocol' : 'Initialize Task'}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Neural stream categorization.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-xl transition-all ${
              darkMode ? 'text-slate-500 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X size={20}/>
          </button>
        </div>

        <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
          {/* TASK TITLE */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Task Title</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text" 
              placeholder="e.g. Audit Export Licenses" 
              className={`w-full p-4 rounded-2xl outline-none border-2 transition-all font-medium ${
                darkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500/50' 
                  : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-indigo-500'
              }`} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* INDUSTRY SECTION */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Industry Section</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-4 rounded-2xl text-sm outline-none border-2 transition-all cursor-pointer font-medium appearance-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500/50' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-indigo-500'
                }`}
              >
                <option value="Personal">Personal User</option>
                <option value="Startups">Startups</option>
                <option value="IT companies">IT Companies</option>
                <option value="MNCs">MNCs</option>
                <option value="FMCG">FMCG</option>
                <option value="SMEs">SMEs</option>
                <option value="Import/Export">Import/Export</option>
                <option value="Government">Government</option>
              </select>
            </div>

            {/* RISK LEVEL */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Risk Factor</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full p-4 rounded-2xl text-sm outline-none border-2 transition-all cursor-pointer font-medium appearance-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500/50' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-indigo-500'
                }`}
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
          </div>

          {/* DEADLINE */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Deadline</label>
            <input 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              type="text" 
              placeholder="e.g. Today or 2024-12-31"
              className={`w-full p-4 rounded-2xl text-sm outline-none border-2 transition-all font-medium ${
                darkMode 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500/50' 
                  : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-indigo-500'
              }`} 
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 pb-4 md:pb-0">
            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black italic uppercase tracking-widest text-[11px] hover:bg-indigo-500 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
            >
              {editingTask ? 'Commit Changes' : 'Deploy to AI Stream'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;