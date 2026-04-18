import React from 'react';
import { Plus, Mail, Settings, Users } from 'lucide-react';

const teamMembers = [
  { id: 1, name: 'Alex Rivera', role: 'Lead Architect', online: true, img: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Jordan Sykes', role: 'Product Manager', online: true, img: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Sam Chen', role: 'DevOps Engineer', online: false, img: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Sarah Blake', role: 'UX Designer', online: true, img: 'https://i.pravatar.cc/150?u=4' },
];

const TeamView = ({ darkMode }: { darkMode: boolean }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-4xl font-black italic uppercase tracking-tighter">Team Hub</h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Active Neural Collaborators</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
          <Plus size={16}/> Invite Node
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map(member => (
          <div key={member.id} className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-8 rounded-[2rem] border shadow-sm flex items-center justify-between`}>
            <div className="flex items-center gap-5">
              <div className="relative">
                <img src={member.img} className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/20" alt={member.name} />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${darkMode ? 'border-slate-900' : 'border-white'} ${member.online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </div>
              <div>
                <h4 className="font-black text-lg leading-tight">{member.name}</h4>
                <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider mb-1">{member.role}</p>
                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${member.online ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                  {member.online ? 'Online' : 'Away'}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
               <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"><Mail size={16}/></button>
               <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"><Settings size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamView;