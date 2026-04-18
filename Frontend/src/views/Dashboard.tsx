import React, { useState } from 'react';
import { LayoutGrid, List, Plus, Clock, Zap, Activity, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '../components/TaskCard';

interface DashboardProps {
  darkMode: boolean;
  config: any;
  tasks: any[];
  onOpenModal: () => void;
  onEditTask: (task: any) => void;
  onDeleteTask?: (id: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode, config, tasks = [], onOpenModal, onEditTask, onDeleteTask }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const initiateDelete = (id: number) => setTaskToDelete(id);
  const cancelDelete = () => setTaskToDelete(null);
  const confirmDelete = () => {
    if (taskToDelete && onDeleteTask) {
      onDeleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const graphData = [{ label: 'JAN', value: 30 }, { label: 'FEB', value: 45 }, { label: 'MAR', value: 35 }, { label: 'APR', value: 60 }, { label: 'MAY', value: 55 }, { label: 'JUN', value: 85 }, { label: 'JUL', value: 78 }];
  const padding = 20; const width = 400; const height = 100; const maxValue = 100;
  const points = graphData.map((d, i) => {
    const x = (i / (graphData.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((d.value / maxValue) * (height - padding * 2) + padding);
    return { x, y, value: d.value, label: d.label };
  });
  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaData = `${pathData} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  return (
    <div className="space-y-6 md:space-y-10">
      {/* 1. ANALYTICS SECTION - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className={`lg:col-span-2 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'} shadow-sm relative overflow-hidden`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Projected Velocity</h4>
              <div className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">Neural Output</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black ${config?.theme || 'bg-indigo-600'} text-white`}>+24% Growth</div>
          </div>
          <div className="h-32 md:h-48 w-full mt-2 relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="graphGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config?.hex || '#6366f1'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={config?.hex || '#6366f1'} stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path d={areaData} fill="url(#graphGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
              <motion.path d={pathData} fill="none" stroke={config?.hex || '#6366f1'} strokeWidth="2" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
              {points.map((p, i) => (
                <g key={i} className="hidden sm:block">
                  <circle cx={p.x} cy={p.y} r="3" fill={config?.hex || '#6366f1'} />
                  <text x={p.x} y={p.y - 6} textAnchor="middle" fontSize="6" fontWeight="black" fill={darkMode ? '#fff' : '#1e293b'}>{p.value}</text>
                  <text x={p.x} y={height + 10} textAnchor="middle" fontSize="6" fontWeight="bold" fill="#64748b">{p.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
        
        <div className={`p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'} flex flex-row lg:flex-col items-center justify-between lg:justify-center text-center shadow-sm`}>
          <div className="relative w-20 h-20 md:w-24 md:h-24 lg:mb-4">
            <div className="absolute inset-0 flex items-center justify-center font-black text-lg md:text-xl italic">78%</div>
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-200 dark:text-slate-800" />
              <motion.circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="276" initial={{ strokeDashoffset: 276 }} animate={{ strokeDashoffset: 60 }} className={config?.text || 'text-indigo-500'} />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-right lg:text-center">System Efficiency</span>
        </div>
      </div>

      {/* 2. STAT CARDS - Scrollable on mobile or Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[{ label: 'Active Tasks', value: tasks.length, icon: Clock, color: 'text-indigo-500' }, { label: 'Node Load', value: '42%', icon: Activity, color: 'text-emerald-500' }, { label: 'AI Assists', value: '12', icon: Zap, color: 'text-orange-500' }].map((stat, i) => (
          <div key={i} className={`p-6 rounded-[1.5rem] md:rounded-[2rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={stat.color} size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
            </div>
            <div className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 3. WORKSTREAM HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Workstream</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Status: Operational</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/5 dark:bg-white/5 p-2 rounded-2xl w-full sm:w-auto justify-center">
          <button onClick={() => setViewMode('grid')} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition-all flex justify-center ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}><LayoutGrid size={20} /></button>
          <button onClick={() => setViewMode('list')} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition-all flex justify-center ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}><List size={20} /></button>
        </div>
      </div>

      {/* 4. TASK DISPLAY - Responsive Columns */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
        {tasks.map((task) => (
          <div key={task.id} className="h-full">
            <TaskCard 
              task={task} 
              darkMode={darkMode} 
              config={config} 
              viewMode={viewMode} 
              onEdit={() => onEditTask(task)}
              onDelete={() => initiateDelete(task.id)}
            />
          </div>
        ))}
        <button onClick={onOpenModal} className={`w-full min-h-[180px] md:min-h-[220px] border-2 border-dashed rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all ${darkMode ? 'border-slate-800 hover:border-indigo-500/50' : 'border-slate-200 hover:bg-indigo-50/30'}`}>
          <Plus size={24} className="text-indigo-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initialize Task</span>
        </button>
      </div>

      {/* 5. DELETE CONFIRMATION MODAL - Full width on small mobile */}
      <AnimatePresence>
        {taskToDelete !== null && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'} shadow-2xl`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-2">Confirm Deletion</h3>
                <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest mb-8 leading-relaxed">
                  This action will permanently terminate the selected data node.
                </p>
                <div className="flex w-full gap-4">
                  <button onClick={cancelDelete} className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest bg-slate-100 dark:bg-slate-800 hover:opacity-80 transition-all">Cancel</button>
                  <button onClick={confirmDelete} className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20">Delete</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;