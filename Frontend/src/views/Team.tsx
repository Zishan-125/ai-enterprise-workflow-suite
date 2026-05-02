import React, { useEffect, useState } from 'react';
import { Plus, Mail, Settings, Loader2 } from 'lucide-react';
import api from '../api/axios';
import InviteNodeModal from '../components/InviteNodeModal'; // Import the new modal

const TeamView = ({ darkMode }: { darkMode: boolean }) => {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const fetchTeam = async () => {
    try {
      const res = await api.get('/team');
      setTeam(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleInviteSubmit = async (data: { name: string; email: string; role: string }) => {
    try {
      await api.post('/team/invite', data);
      await fetchTeam(); // Refresh the list
      setIsInviteModalOpen(false); // Close modal on success
    } catch (err) {
      alert("Node synchronization failed. Protocol interrupted.");
    }
  };

  // ... (Keep the rest of your JSX, but update the button to open the modal)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-4xl font-black italic uppercase tracking-tighter">Team Hub</h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">{team.length} Active Neural Collaborators</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)} // Opens the custom modal
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={16}/> Invite Node
        </button>
      </div>

      {/* Grid rendering (same as before) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ... member mapping ... */}
      </div>

      {/* Integration of the Modal */}
      <InviteNodeModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onInvite={handleInviteSubmit}
        darkMode={darkMode}
      />
    </div>
  );
};


export default TeamView;