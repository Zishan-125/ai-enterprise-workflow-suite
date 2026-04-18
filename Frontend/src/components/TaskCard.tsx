import React from 'react';
import { Edit3, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: any;
  darkMode: boolean;
  config: any;
  viewMode: 'grid' | 'list';
  onEdit: (task: any) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, darkMode, config, viewMode, onEdit, onDelete }) => {
  const isGrid = viewMode === 'grid';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => onEdit(task)}
      className={`relative p-7 rounded-[2.5rem] border transition-all cursor-pointer group ${
        darkMode 
          ? 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/30' 
          : 'bg-white border-slate-100 hover:border-indigo-500/30 shadow-sm'
      } ${!isGrid ? 'flex items-center justify-between gap-6' : 'h-full flex flex-col'}`}
    >
      {/* 1. PERMANENTLY VISIBLE ACTION BUTTONS */}
      <div className="absolute top-6 right-6 flex flex-row gap-2 z-30">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onEdit(task); 
          }}
          className={`p-2.5 rounded-xl transition-all shadow-lg ${
            darkMode 
              ? 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white border border-slate-700' 
              : 'bg-white text-slate-500 hover:bg-indigo-600 hover:text-white border border-slate-100'
          }`}
        >
          <Edit3 size={14} />
        </button>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onDelete(task.id); 
          }}
          className={`p-2.5 rounded-xl transition-all shadow-lg ${
            darkMode 
              ? 'bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white border border-slate-700' 
              : 'bg-white text-slate-500 hover:bg-rose-600 hover:text-white border border-slate-100'
          }`}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* 2. TASK CONTENT */}
      <div className={`${isGrid ? 'flex-1 space-y-5' : 'flex items-center gap-8 flex-1'}`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.lightBg} ${config.text}`}>
          <config.icon size={24} />
        </div>

        <div className="flex-1 pr-20"> {/* Increased padding to avoid overlapping icons */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg ${
              task.risk === 'High' 
                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            }`}>
              {task.risk} Risk
            </span>
          </div>
          <h4 className={`font-black italic uppercase tracking-tight text-lg leading-tight line-clamp-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {task.title}
          </h4>
        </div>

        <div className={isGrid ? 'w-full py-2' : 'w-48'}>
          <div className="flex justify-between text-[10px] font-black uppercase mb-2 opacity-40 italic">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Progress</span>
            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{task.progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${task.progress}%` }}
              className={`h-full shadow-[0_0_10px_rgba(99,102,241,0.4)] ${config.theme}`}
            />
          </div>
        </div>

        <div className={`flex items-center justify-between ${isGrid ? 'pt-5 mt-auto border-t border-slate-100 dark:border-slate-800' : 'w-40'}`}>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <Clock size={12} className="text-indigo-500" />
            {task.deadline}
          </div>
          {task.status === 'Done' ? (
            <CheckCircle2 size={18} className="text-emerald-500" />
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;