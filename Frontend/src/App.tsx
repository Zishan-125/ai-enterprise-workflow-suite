import React, { useState, useMemo, useEffect, useCallback } from 'react'; 
import { AnimatePresence, motion } from 'framer-motion';
import api from './api/axios';

// PDF Export Libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Config & Components
import { portalConfig } from './config/portalConfig';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import AIDrawer from './components/Layout/AIDrawer';
import AddTaskModal from './components/AddTaskModal';

// Views
import Dashboard from './views/Dashboard';
import TeamView from './views/Team';
import BillingView from './views/Billing';
import SettingsView from './views/Settings';
import AuthView from './views/Auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ai-enterprise-workflow-suite.onrender.com";

const App = () => {
  // --- 1. AUTH & NAVIGATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings' | 'billing' | 'team'>('dashboard');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // --- 2. UI STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- 3. BILLING STATE ---
  const [isPro, setIsPro] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  // --- 4. USER PROFILE ---
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    role: 'Lead Systems Architect',
    email: 'alex.rivera@neural.io',
    location: 'San Francisco, CA',
    bio: 'Pioneer in neural-linked interfaces and decentralized OS architecture.',
    avatar: 'https://i.pravatar.cc/150?u=1',
    neuralId: 'ND-882-99-ALPHA',
    nodeStatus: 'Stable'
  });

  // --- 5. SYSTEM SETTINGS ---
  const [settings, setSettings] = useState({ 
    darkMode: true, 
    notifications: true, 
    aiPersonalization: true, 
    autoSave: true, 
    biometricLock: false 
  });
  const [searchQuery, setSearchQuery] = useState('');

  // --- 6. SESSION DATA ---
  const sessionAuth = useMemo(() => ({
    certId: `SMART-PRO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    timestamp: new Date().toLocaleString().toUpperCase()
  }), []);

  // --- 7. FULL-STACK DATA MANAGEMENT ---
  const [tasks, setTasks] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [neuralInsight, setNeuralInsight] = useState("Neural link idling...");

  // FETCH TASKS FROM MYSQL
const fetchTasks = useCallback(async () => {
  try {
    const res = await api.get('/tasks');
    setTasks(res.data);
  } catch (err) {
    console.error("Task fetch failed:", err);
  }
}, []);

  // FETCH AI INSIGHT FROM GEMINI (Dashboard Header)
  const fetchAIInsight = useCallback(async (currentTasks: any[]) => {
  if (currentTasks.length === 0) return;

  try {
    const res = await api.post('/ai/advisor', {
      tasks: currentTasks,
    });

    setNeuralInsight(res.data.insight);
  } catch (err) {
    setNeuralInsight("Neural link unstable. System status: Nominal.");
    console.error("AI advisor error:", err);
  }
}, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  // Update AI Insight whenever tasks change
  useEffect(() => {
    fetchAIInsight(tasks);
  }, [tasks, fetchAIInsight]);

  // --- 8. ADVISOR LOGIC (RETAINED FOR UI TRENDS) ---
  const advisorTrend = useMemo(() => {
    const hasStartups = tasks.some(t => t.category === 'Startups');
    const highRiskCount = tasks.filter(t => t.risk === 'High').length;
    let trend = "System efficiency is stable. ";
    if (hasStartups) trend += "Neural throughput optimized for Startup sectors. ";
    if (highRiskCount > 0) trend += `Alert: ${highRiskCount} High-Risk nodes detected.`;
    return trend;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || task.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tasks, searchQuery, activeCategory]);

  // --- 9. TASK OPERATIONS (PERSISTED TO DB) ---
  const handleAddTask = async (task: any) => {
  try {
    if (editingTask) {
      await api.put(`/tasks/${editingTask.id}`, task);
    } else {
      await api.post('/tasks', { ...task, progress: 0 });
    }

    fetchTasks();
    setIsModalOpen(false);
    setEditingTask(null);
  } catch (err) {
    alert("Deployment Failure: Database write error.");
    console.error(err);
  }
};


const deleteTask = async (id: number) => {
  try {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter(t => t.id !== id));
  } catch (err) {
    console.error("Delete error:", err);
  }
};

  // --- 10. PDF EXPORT LOGIC ---
  const handleExportRequest = () => {
    if (!isPro) { setCurrentView('billing'); return; }
    exportToPDF();
  };

  const exportToPDF = async () => {
    const element = document.getElementById('printable-report');
    if (!element) return;
    element.style.display = 'block';
    element.style.position = 'fixed';
    element.style.left = '-9999px';
    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#020617', useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SMARTDO_PRO_AUDIT_${sessionAuth.certId}.pdf`);
    } finally {
      element.style.display = 'none';
    }
  };

  const config = portalConfig[activeCategory] || portalConfig.All;

const handleLoginSuccess = (token: string) => {
  localStorage.setItem("token", token);
  setIsAuthenticated(true);
};

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined") {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    return;
  }

  try {
    // optional: basic JWT structure check
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  } catch (err) {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }
}, []);

// 🔒 protect app
if (!isAuthenticated) {
  return (
   <AuthView
  onLogin={handleLoginSuccess}
  darkMode={settings.darkMode}
  authMode={authMode}
  setAuthMode={setAuthMode}
/>
  );
}
  return (
    <div className={`flex h-screen ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-[#f8fafc] text-slate-900'} overflow-hidden`}>
      
      {/* --- PROFESSIONAL PRINTABLE TEMPLATE --- */}
      <div id="printable-report" style={{ display: 'none', width: '1200px', padding: '60px', background: '#020617', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '30px', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: '900', fontStyle: 'italic', margin: 0, textTransform: 'uppercase', letterSpacing: '-2px' }}>NEURAL OUTPUT</h1>
            <p style={{ color: '#6366f1', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '4px', marginTop: '5px' }}>Projected Velocity Audit</p>
          </div>
          <div style={{ textAlign: 'right', maxWidth: '400px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '10px', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase' }}>AI Advisor Insight</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.6' }}>"{neuralInsight}"</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <div style={{ flex: 2, background: '#0f172a', borderRadius: '32px', padding: '40px', border: '1px solid #1e293b', height: '320px', position: 'relative' }}>
             <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                <path d="M 50 120 L 150 90 L 250 110 L 350 60 L 450 70 L 550 20 L 650 35" fill="none" stroke="#6366f1" strokeWidth="4" />
             </svg>
             <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', padding: '0 20px', position: 'relative', zIndex: 2 }}>
                {[30, 45, 35, 60, 55, 85, 78].map((val, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '900', color: '#6366f1' }}>{val}</span>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6366f1', border: '2px solid white' }} />
                    <span style={{ fontSize: '10px', fontWeight: '900', opacity: 0.3 }}>{['JAN','FEB','MAR','APR','MAY','JUN','JUL'][i]}</span>
                  </div>
                ))}
             </div>
          </div>
          <div style={{ flex: 1, background: '#0f172a', borderRadius: '32px', padding: '40px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="75" cy="75" r="65" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                  <circle cx="75" cy="75" r="65" stroke="#6366f1" strokeWidth="12" fill="transparent" strokeDasharray="408.4" strokeDashoffset={408.4 - (408.4 * 0.78)} />
                </svg>
                <div style={{ position: 'absolute', fontSize: '36px', fontWeight: '900' }}>78%</div>
             </div>
          </div>
        </div>

        <div style={{ background: '#0f172a', borderRadius: '32px', padding: '40px', border: '1px solid #1e293b' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#475569', fontSize: '10px', textTransform: 'uppercase', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '20px' }}>Protocol Identifier</th>
                <th style={{ padding: '20px' }}>Neural Sector</th>
                <th style={{ padding: '20px' }}>Risk Factor</th>
                <th style={{ padding: '20px' }}>Deployment</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '20px', fontWeight: '900', fontSize: '18px' }}>{task.title}</td>
                  <td style={{ padding: '20px', fontSize: '14px', color: '#94a3b8' }}>{task.category}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ color: task.risk === 'High' ? '#ef4444' : '#10b981', fontWeight: '900' }}>{task.risk.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '20px' }}>{task.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} currentView={currentView} setCurrentView={setCurrentView} isPro={isPro} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} onLogout={() => setIsAuthenticated(false)} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Header config={config} currentView={currentView} darkMode={settings.darkMode} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onMenuClick={() => setIsSidebarOpen(true)} activityCount={activityLog.length} onLogClick={() => setIsLogOpen(!isLogOpen)} onDownloadReport={handleExportRequest} isPro={isPro} />

        <section className="p-6 md:p-10 overflow-y-auto flex-1 no-scrollbar">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Dashboard darkMode={settings.darkMode} config={config} tasks={filteredTasks} onEditTask={(task) => { setEditingTask(task); setIsModalOpen(true); }} onDeleteTask={deleteTask} onOpenModal={() => { setEditingTask(null); setIsModalOpen(true); }} />
              </motion.div>
            )}
            {currentView === 'settings' && <SettingsView profile={profile} setProfile={setProfile} settings={settings} setSettings={setSettings} />}
            {currentView === 'billing' && <BillingView isPro={isPro} setIsPro={setIsPro} darkMode={settings.darkMode} setCurrentView={setCurrentView} isProcessing={isProcessingPayment} setIsProcessing={setIsProcessingPayment} showSuccess={showSuccessAnim} setShowSuccess={setShowSuccessAnim} />}
            {currentView === 'team' && <TeamView darkMode={settings.darkMode} />}
          </AnimatePresence>
        </section>

        {/* --- CRITICAL UPDATE: PASSING TASKS TO AIDRAWER --- */}
        <AIDrawer 
            darkMode={settings.darkMode} 
            isPro={isPro} 
            onUpgrade={() => setCurrentView('billing')} 
            tasks={tasks} 
        />

        <AddTaskModal isOpen={isModalOpen} darkMode={settings.darkMode} onClose={() => { setIsModalOpen(false); setEditingTask(null); }} editingTask={editingTask} onAddTask={handleAddTask} />

        {/* --- ACTIVITY LOG SIDEBAR --- */}
        <AnimatePresence>
          {isLogOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLogOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-40" />
              <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className={`fixed right-0 top-0 h-full w-full max-w-sm z-50 p-10 border-l ${settings.darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <h3 className="font-black italic uppercase tracking-tighter text-3xl mb-12">Activity Log</h3>
                <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600">
                    <p className="text-[10px] font-bold text-white/60 uppercase">Certificate Identifier</p>
                    <p className="text-sm font-black text-white font-mono">{sessionAuth.certId}</p>
                </div>
                <div className="space-y-8">
                  {activityLog.map(log => (
                    <div key={log.id} className="flex gap-5 border-l-4 border-indigo-500/20 pl-6 py-2">
                      <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase mb-1">{log.time}</p>
                        <p className="text-sm font-bold">{log.user} <span className="font-normal opacity-50 italic">{log.action}</span> {log.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;

/*import React, { useState, useMemo } from 'react'; 
import { AnimatePresence, motion } from 'framer-motion';

// PDF Export Libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Config & Components
import { portalConfig } from './config/portalConfig';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import AIDrawer from './components/Layout/AIDrawer';
import AddTaskModal from './components/AddTaskModal';

// Views
import Dashboard from './views/Dashboard';
import TeamView from './views/Team';
import BillingView from './views/Billing';
import SettingsView from './views/Settings';
import AuthView from './views/Auth';

const App = () => {
  // --- 1. AUTH & NAVIGATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings' | 'billing' | 'team'>('dashboard');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // --- 2. UI STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- 3. BILLING STATE (AI & EXPORT GATEWAY) ---
  const [isPro, setIsPro] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  // --- 4. USER PROFILE ---
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    role: 'Lead Systems Architect',
    email: 'alex.rivera@neural.io',
    location: 'San Francisco, CA',
    bio: 'Pioneer in neural-linked interfaces and decentralized OS architecture.',
    avatar: 'https://i.pravatar.cc/150?u=1',
    neuralId: 'ND-882-99-ALPHA',
    nodeStatus: 'Stable'
  });

  // --- 5. SYSTEM SETTINGS ---
  const [settings, setSettings] = useState({ 
    darkMode: true, 
    notifications: true, 
    aiPersonalization: true, 
    autoSave: true, 
    biometricLock: false 
  });
  const [searchQuery, setSearchQuery] = useState('');

  // --- 6. PERSISTENT CERTIFICATION ID & TIMESTAMP (SESSION-BASED) ---
  const sessionAuth = useMemo(() => {
    return {
      certId: `SMART-PRO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toLocaleString().toUpperCase()
    };
  }, []);

  // --- 7. DATA: TASKS & LOGS ---
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review Seed Funding Pitch", deadline: "Today", risk: "High", status: "To Do", category: "Startups", progress: 20 },
    { id: 2, title: "Patch Server Vulnerability", deadline: "ASAP", risk: "High", status: "Done", category: "IT companies", progress: 100 }
  ]);
  const [editingTask, setEditingTask] = useState<any>(null);

  const [activityLog, setActivityLog] = useState([
    { id: 1, user: 'Jordan', action: 'completed', task: 'Patch Server', time: '2m ago' },
    { id: 2, user: 'Alex', action: 'added', task: 'Review Funding', time: '10m ago' },
  ]);

  // --- 8. ADVISOR LOGIC (DYNAMIC TRENDS) ---
  const advisorInsight = useMemo(() => {
    const hasStartups = tasks.some(t => t.category === 'Startups');
    const hasIT = tasks.some(t => t.category === 'IT companies');
    const highRiskCount = tasks.filter(t => t.risk === 'High').length;

    let trend = "System efficiency is stable at 78%. ";
    if (hasStartups) trend += "VC sentiment in 'Startups' is shifting toward AI-first lean models. ";
    if (hasIT) trend += "Cybersecurity protocols in 'IT Sector' show 40% increased threat detection requirements. ";
    if (highRiskCount > 0) trend += `Critical: ${highRiskCount} High-Risk nodes require immediate neural override.`;
    
    return trend;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || task.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tasks, searchQuery, activeCategory]);

  // --- 9. PRO-ONLY PDF EXPORT LOGIC WITH NEURAL STAMP ---
  const handleExportRequest = () => {
    if (!isPro) {
        setCurrentView('billing');
        return;
    }
    exportToPDF();
  };

  const exportToPDF = async () => {
    const element = document.getElementById('printable-report');
    if (!element) return;

    element.style.display = 'block';
    element.style.position = 'fixed';
    element.style.left = '-9999px';

    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        backgroundColor: '#020617', 
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SMARTDO_PRO_AUDIT_${sessionAuth.certId}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
    } finally {
      element.style.display = 'none';
    }

    setActivityLog([{ 
      id: Date.now(), 
      user: profile.name.split(' ')[0], 
      action: 'exported', 
      task: `Pro_Audit_${sessionAuth.certId}`, 
      time: 'Just now' 
    }, ...activityLog]);
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    setActivityLog([{ 
      id: Date.now(), user: profile.name.split(' ')[0], action: 'deleted', task: taskToDelete?.title || 'task', time: 'Just now' 
    }, ...activityLog]);
  };

  const config = portalConfig[activeCategory] || portalConfig.All;

  if (!isAuthenticated) return <AuthView onLogin={() => setIsAuthenticated(true)} darkMode={settings.darkMode} authMode={authMode} setAuthMode={setAuthMode} />;

  return (
    <div className={`flex h-screen ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-[#f8fafc] text-slate-900'} overflow-hidden`}>
      
      {/* --- PROFESSIONAL PRINTABLE TEMPLATE (FULL SCALE BRANDING RESTORED) --- */
 /*     <div id="printable-report" style={{ display: 'none', width: '1200px', padding: '60px', background: '#020617', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '30px', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: '900', fontStyle: 'italic', margin: 0, textTransform: 'uppercase', letterSpacing: '-2px' }}>NEURAL OUTPUT</h1>
            <p style={{ color: '#6366f1', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '4px', marginTop: '5px' }}>Projected Velocity Audit</p>
          </div>
          <div style={{ textAlign: 'right', maxWidth: '400px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '10px', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase' }}>AI Advisor Insight</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.6' }}>"{advisorInsight}"</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <div style={{ flex: 2, background: '#0f172a', borderRadius: '32px', padding: '40px', border: '1px solid #1e293b', height: '320px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
              <span style={{ fontSize: '10px', fontWeight: '900', opacity: 0.5 }}>VELOCITY INDEX</span>
              <span style={{ background: '#6366f1', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold' }}>SMARTDO PRO SYSTEM ACTIVE</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', padding: '0 20px', position: 'relative' }}>
               <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                <path d="M 50 120 L 150 90 L 250 110 L 350 60 L 450 70 L 550 20 L 650 35" fill="none" stroke="#6366f1" strokeWidth="4" />
              </svg>
              {[30, 45, 35, 60, 55, 85, 78].map((val, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', zIndex: 2 }}>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: '#6366f1' }}>{val}</span>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6366f1', border: '2px solid white', boxShadow: '0 0 10px #6366f1' }} />
                  <span style={{ fontSize: '10px', fontWeight: '900', opacity: 0.3 }}>{['JAN','FEB','MAR','APR','MAY','JUN','JUL'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, background: '#0f172a', borderRadius: '32px', padding: '40px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="75" cy="75" r="65" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                  <circle cx="75" cy="75" r="65" stroke="#6366f1" strokeWidth="12" fill="transparent" 
                    strokeDasharray="408.4" strokeDashoffset={408.4 - (408.4 * 0.78)} />
                </svg>
                <div style={{ position: 'absolute', fontSize: '36px', fontWeight: '900' }}>78%</div>
            </div>
            <p style={{ margin: '20px 0 0 0', fontSize: '10px', fontWeight: '900', color: '#475569', letterSpacing: '2px' }}>CORE INTEGRITY</p>
          </div>
        </div>

        <div style={{ background: '#0f172a', borderRadius: '32px', padding: '40px', border: '1px solid #1e293b', marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#475569', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '20px' }}>Protocol Identifier</th>
                <th style={{ padding: '20px' }}>Neural Sector</th>
                <th style={{ padding: '20px' }}>Risk Factor</th>
                <th style={{ padding: '20px' }}>Deployment</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '20px', fontWeight: '900', fontSize: '18px' }}>{task.title}</td>
                  <td style={{ padding: '20px', fontSize: '14px', color: '#94a3b8' }}>{task.category}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ color: task.risk === 'High' ? '#ef4444' : '#10b981', fontWeight: '900', fontSize: '10px' }}>{task.risk.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden', minWidth: '100px' }}>
                        <div style={{ width: `${task.progress}%`, height: '100%', background: '#6366f1' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{task.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DYNAMIC NEURAL STAMP FOOTER */
 /*       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #1e293b', paddingTop: '30px' }}>
          <div>
            <p style={{ margin: '0 0 5px 0', fontSize: '10px', fontWeight: '900', color: '#475569', letterSpacing: '2px' }}>VERIFICATION TIMESTAMP</p>
            <p style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold', color: '#6366f1' }}>{sessionAuth.timestamp}</p>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#475569', letterSpacing: '1px' }}>CERT ID: <span style={{ color: '#fff', background: '#1e293b', padding: '2px 8px', borderRadius: '4px' }}>{sessionAuth.certId}</span></p>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '25px 45px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: '900', color: 'white', opacity: 0.9, letterSpacing: '2px' }}>SECURITY CLEARANCE GRANTED</p>
            <p style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '-1px' }}>Authenticated by SMARTDO PRO</p>
          </div>
        </div>
      </div>

      <Sidebar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isPro={isPro} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        onLogout={() => setIsAuthenticated(false)} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Header 
          config={config} 
          currentView={currentView} 
          darkMode={settings.darkMode} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onMenuClick={() => setIsSidebarOpen(true)} 
          activityCount={activityLog.length} 
          onLogClick={() => setIsLogOpen(!isLogOpen)} 
          onDownloadReport={handleExportRequest} 
          isPro={isPro}
        />

        <section className="p-6 md:p-10 overflow-y-auto flex-1 no-scrollbar">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Dashboard darkMode={settings.darkMode} config={config} tasks={filteredTasks} onEditTask={(task) => { setEditingTask(task); setIsModalOpen(true); }} onDeleteTask={deleteTask} onOpenModal={() => { setEditingTask(null); setIsModalOpen(true); }} />
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SettingsView profile={profile} setProfile={setProfile} settings={settings} setSettings={setSettings} />
              </motion.div>
            )}

            {currentView === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                <BillingView isPro={isPro} setIsPro={setIsPro} darkMode={settings.darkMode} setCurrentView={setCurrentView} isProcessing={isProcessingPayment} setIsProcessing={setIsProcessingPayment} showSuccess={showSuccessAnim} setShowSuccess={setShowSuccessAnim} />
              </motion.div>
            )}

            {currentView === 'team' && (
              <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <TeamView darkMode={settings.darkMode} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <AIDrawer 
          darkMode={settings.darkMode} 
          isPro={isPro} 
          onUpgrade={() => setCurrentView('billing')} 
        />

        <AddTaskModal 
          isOpen={isModalOpen} 
          darkMode={settings.darkMode} 
          onClose={() => { setIsModalOpen(false); setEditingTask(null); }} 
          editingTask={editingTask}
          onAddTask={(task) => {
            if(editingTask) {
                setTasks(tasks.map(t => t.id === editingTask.id ? { ...task, id: t.id, progress: t.progress } : t));
                setActivityLog([{ id: Date.now(), user: profile.name.split(' ')[0], action: 'updated', task: task.title, time: 'Just now' }, ...activityLog]);
            } else {
                setTasks([{ ...task, id: Date.now(), progress: 0 }, ...tasks]);
                setActivityLog([{ id: Date.now(), user: profile.name.split(' ')[0], action: 'initialized', task: task.title, time: 'Just now' }, ...activityLog]);
            }
          }}
        />

        {/* --- UI BRANDING: ACTIVITY LOG AUTHENTICATION --- */
   /*     <AnimatePresence>
          {isLogOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLogOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-40" />
              <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className={`fixed right-0 top-0 h-full w-full max-w-sm z-50 p-10 border-l ${settings.darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'}`}>
                <div className="flex justify-between items-center mb-12">
                  <h3 className="font-black italic uppercase tracking-tighter text-3xl">Activity Log</h3>
                  <button onClick={() => setIsLogOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-500 hover:text-white transition-all">✕</button>
                </div>
                
                {/* SMARTDO PRO UI BRANDING BLOCK */
       /*         <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20 shadow-xl shadow-indigo-500/20">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                        <p className="text-[11px] font-black text-white/90 uppercase tracking-[0.2em]">Neural Verification</p>
                    </div>
                    <div className="space-y-1 mb-5">
                      <p className="text-[10px] font-bold text-white/60 uppercase">Certificate Identifier</p>
                      <p className="text-sm font-black text-white font-mono tracking-tight">{sessionAuth.certId}</p>
                    </div>
                    <div className="space-y-1 mb-6">
                      <p className="text-[10px] font-bold text-white/60 uppercase">Auth Timestamp</p>
                      <p className="text-xs font-black text-white">{sessionAuth.timestamp}</p>
                    </div>
                    <div className="pt-4 border-t border-white/20">
                        <p className="text-[13px] font-black italic uppercase text-white">
                          Authenticated by SMARTDO PRO
                        </p>
                    </div>
                </div>

                <div className="space-y-8 overflow-y-auto max-h-[45vh] no-scrollbar">
                  {activityLog.map(log => (
                    <div key={log.id} className="flex gap-5 border-l-4 border-indigo-500/20 pl-6 py-2">
                      <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{log.time}</p>
                        <p className="text-sm font-bold leading-relaxed">{log.user} <span className="font-normal opacity-50 italic">{log.action}</span> {log.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;










full


/*import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  Zap, Rocket, Laptop, Building2, Factory, Store, Globe, 
  Landmark, User, Trash2, Edit3, Send, Plus, Search,
  Settings, Bell, Sun, Download, Command, Sparkles, X, ChevronRight, Inbox, LogIn, Key, Mail, UserCircle, Crown, CreditCard, ShieldCheck, CheckCircle2, Clock, Activity, Menu, Users, Share2, MessageSquare, History, Smartphone, Landmark as BankIcon, Loader2, LogOut, Github, Chrome, Camera, MapPin, Briefcase, Link as LinkIcon, Fingerprint, ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip 
} from 'recharts';

// Internal Imports
import { useAIStore } from './store/useAIStore';
import TaskCard from './components/TaskCard';    
import AddTaskModal from './components/AddTaskModal';

const performanceData = [
  { name: 'Mon', val: 3200 }, { name: 'Tue', val: 4500 }, { name: 'Wed', val: 2900 },
  { name: 'Thu', val: 5600 }, { name: 'Fri', val: 4100 }, { name: 'Sat', val: 3000 }, { name: 'Sun', val: 4800 },
];

const teamMembers = [
  { id: 1, name: 'Alex Rivera', role: 'Lead Architect', color: 'bg-indigo-500', online: true, img: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Jordan Sykes', role: 'Product Manager', color: 'bg-rose-500', online: true, img: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Sam Chen', role: 'DevOps Engineer', color: 'bg-emerald-500', online: false, img: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Sarah Blake', role: 'UX Designer', color: 'bg-amber-500', online: true, img: 'https://i.pravatar.cc/150?u=4' },
];

const portalConfig: any = {
  All: { theme: 'bg-indigo-600', text: 'text-indigo-600', hex: '#4f46e5', lightBg: 'bg-indigo-50', icon: Zap, label: 'General OS', greeting: 'System Ready.' },
  Startups: { theme: 'bg-orange-600', text: 'text-orange-600', hex: '#ea580c', lightBg: 'bg-orange-50', icon: Rocket, label: 'Growth Engine', greeting: 'Venture mode active.' },
  'IT companies': { theme: 'bg-emerald-600', text: 'text-emerald-600', hex: '#059669', lightBg: 'bg-emerald-50', icon: Laptop, label: 'DevOps Hub', greeting: 'Environment stable.' },
  MNCs: { theme: 'bg-blue-600', text: 'text-blue-600', hex: '#2563eb', lightBg: 'bg-blue-50', icon: Building2, label: 'Global Corp', greeting: 'Compliance protocols active.' },
  FMCG: { theme: 'bg-rose-600', text: 'text-rose-600', hex: '#e11d48', lightBg: 'bg-rose-50', icon: Factory, label: 'Supply Chain', greeting: 'Inventory synced.' },
  SMEs: { theme: 'bg-violet-600', text: 'text-violet-600', hex: '#7c3aed', lightBg: 'bg-violet-50', icon: Store, label: 'Business Suite', greeting: 'Local operations live.' },
  'Import/Export': { theme: 'bg-cyan-600', text: 'text-cyan-600', hex: '#0891b2', lightBg: 'bg-cyan-50', icon: Globe, label: 'Logistics Command', greeting: 'Global ports monitored.' },
  'Government': { theme: 'bg-slate-700', text: 'text-slate-700', hex: '#334155', lightBg: 'bg-slate-100', icon: Landmark, label: 'Public Portal', greeting: 'Transparency engaged.' },
  Personal: { theme: 'bg-pink-600', text: 'text-pink-600', hex: '#db2777', lightBg: 'bg-pink-50', icon: User, label: 'Life Design', greeting: 'Wellness mode active.' }
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isPro, setIsPro] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  
  // Ref for Avatar Input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // USER PROFILE STATE
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    role: 'Lead Systems Architect',
    email: 'alex.rivera@neural.io',
    location: 'San Francisco, CA',
    bio: 'Pioneer in neural-linked interfaces and decentralized OS architecture. Optimizing human-machine workflows since 2021.',
    avatar: 'https://i.pravatar.cc/150?u=1',
    neuralId: 'ND-882-99-ALPHA',
    nodeStatus: 'Stable'
  });

  const { isChatOpen, toggleChat, messages, sendMessage } = useAIStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings' | 'billing' | 'team'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [settings, setSettings] = useState({ 
    darkMode: false, 
    notifications: true, 
    aiPersonalization: true, 
    autoSave: true, 
    biometricLock: false 
  });

  const [tasks, setTasks] = useState([
    { title: "Review Seed Funding Pitch", deadline: "Today", risk: "High", status: "To Do", category: "Startups", assignee: teamMembers[0] },
    { title: "Patch Server Vulnerability", deadline: "ASAP", risk: "High", status: "Done", category: "IT companies", assignee: teamMembers[1] },
  ]);

  const [activityLog, setActivityLog] = useState([
    { id: 1, user: 'Jordan', action: 'completed', task: 'Patch Server', time: '2m ago' },
    { id: 2, user: 'Alex', action: 'added', task: 'Review Funding', time: '10m ago' },
  ]);

  const config = portalConfig[activeCategory] || portalConfig.All;

  const downloadPDFReport = () => window.print();

  const plans = [
    { id: '3m', label: 'Quarterly', duration: '3 Months', price: '$79', trial: '30 Days Free' },
    { id: '6m', label: 'Semi-Annual', duration: '6 Months', price: '$149', trial: '30 Days Free' },
    { id: '1y', label: 'Annual Best Value', duration: '1 Year', price: '$269', trial: '30 Days Free' },
  ];

  const paymentMethods = [
    { name: 'VISA', icon: CreditCard, color: 'text-blue-600' },
    { name: 'MASTERCARD', icon: CreditCard, color: 'text-orange-500' },
    { name: 'bKASH', icon: Smartphone, color: 'text-pink-600' },
    { name: 'NAGAD', icon: Smartphone, color: 'text-orange-600' },
    { name: 'CITY BANK', icon: BankIcon, color: 'text-emerald-700' },
    { name: 'ISLAMIC BANK', icon: BankIcon, color: 'text-green-700' },
  ];

  const handlePaymentConfirm = (method: string) => {
    if(!selectedPlan) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowSuccessAnim(true);
      setTimeout(() => {
        setIsPro(true);
        setShowSuccessAnim(false);
        setSelectedPlan(null); 
        setCurrentView('dashboard');
      }, 3000); 
    }, 2500);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(authMode === 'forgot') {
        alert("Reset instructions transmitted to neural link.");
        setAuthMode('login');
        return;
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to terminate the session?")) {
      setIsAuthenticated(false);
      setAuthMode('login');
      setCurrentView('dashboard');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tasks, activeCategory, searchQuery]);

  const handleSaveTask = (taskData: any) => {
    const actionType = editingTask ? 'updated' : 'added';
    setActivityLog([{ id: Date.now(), user: 'You', action: actionType, task: taskData.title, time: 'Just now' }, ...activityLog]);
    if (editingTask) {
      setTasks(tasks.map(t => t.title === editingTask.title ? { ...taskData, category: activeCategory } : t));
    } else {
      setTasks([{ ...taskData, category: activeCategory, status: 'To Do', assignee: teamMembers[0] }, ...tasks]);
    }
    closeTaskPanel();
  };

  const openEditPanel = (task: any) => {
    if (isChatOpen) toggleChat();
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeTaskPanel = () => { setIsModalOpen(false); setEditingTask(null); };

  const deleteTask = (title: string) => {
    if (window.confirm("Delete this entry?")) {
      setTasks(prev => prev.filter(t => t.title !== title));
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    sendMessage(chatInput);
    setChatInput('');
  };

  // Profile Picture Change Logic
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl ${settings.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4"><Zap size={28} className="text-white" /></div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter">SMARTDO</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                {authMode === 'login' && 'Neural Access'}
                {authMode === 'signup' && 'Node Registration'}
                {authMode === 'forgot' && 'Identity Recovery'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
               <input required type="text" className={`w-full px-4 py-3 rounded-xl outline-none ${settings.darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`} placeholder="Full Name" />
            )}
            <input required type="email" className={`w-full px-4 py-3 rounded-xl outline-none ${settings.darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`} placeholder="Email Address" />
            
            {authMode !== 'forgot' && (
                <input required type="password" className={`w-full px-4 py-3 rounded-xl outline-none ${settings.darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`} placeholder="Secret Key" />
            )}

            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl uppercase text-xs shadow-lg shadow-indigo-500/20">
              {authMode === 'login' && 'Sync Connection'}
              {authMode === 'signup' && 'Initialize Node'}
              {authMode === 'forgot' && 'Send Recovery Data'}
            </button>
          </form>

          {authMode !== 'forgot' && (
            <div className="mt-6">
                <div className="relative flex items-center justify-center mb-6">
                    <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
                    <span className="px-4 text-[8px] font-black uppercase text-slate-400 bg-transparent">Social Bridge</span>
                    <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setIsAuthenticated(true)} className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${settings.darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <Chrome size={14} className="text-rose-500" /> Google
                    </button>
                    <button onClick={() => setIsAuthenticated(true)} className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${settings.darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <Github size={14} /> GitHub
                    </button>
                </div>
            </div>
          )}

          <div className="mt-8 flex flex-col items-center gap-3">
            {authMode === 'login' && (
              <button onClick={() => setAuthMode('forgot')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-500">Lost Key?</button>
            )}
            <button 
              onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
              className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400"
            >
              {authMode === 'signup' ? "Back to Login" : "Initialize New Node"}
            </button>
            {authMode === 'forgot' && (
              <button onClick={() => setAuthMode('login')} className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cancel</button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-[#f8fafc] text-slate-900'} overflow-hidden relative`}>
      
    /*  {/* PAYMENT CONFIRMATION ANIMATION OVERLAY */
     /* <AnimatePresence>
        {(isProcessingPayment || showSuccessAnim) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-10 rounded-[3rem] text-center max-w-sm w-full mx-4 shadow-2xl border ${settings.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              {isProcessingPayment ? (
                <div className="flex flex-col items-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="mb-6"><Loader2 size={60} className="text-indigo-500" /></motion.div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Syncing Vault</h2>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Establishing secure neural handshake...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }} className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20"><CheckCircle2 size={40} className="text-white" /></motion.div>
                  <motion.h2 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-2xl font-black uppercase italic tracking-tighter mb-2">Upgrade Complete</motion.h2>
                  <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest">Pro Features Initialized</motion.p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVITY LOG PANEL */
      /*<AnimatePresence>
        {isLogOpen && (
          <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className={`fixed left-0 top-0 h-full w-80 z-[100] border-r shadow-2xl p-6 overflow-y-auto ${settings.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black uppercase text-sm flex items-center gap-2"><History size={18}/> Activity Log</h3>
                <button onClick={() => setIsLogOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><X size={16}/></button>
              </div>
              <div className="space-y-6">
                {activityLog.map(log => (
                  <div key={log.id} className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{log.time}</p>
                    <p className="text-sm font-medium mt-1"><span className="font-black text-indigo-600">{log.user}</span> {log.action} <span className="italic">"{log.task}"</span></p>
                  </div>
                ))}
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */
     /* <aside className={`fixed lg:static inset-y-0 left-0 z-[70] w-72 bg-slate-950 text-white p-6 flex flex-col shrink-0 transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setCurrentView('dashboard'); setActiveCategory('All');}}>
              <div className={`w-10 h-10 ${config.theme} rounded-xl flex items-center justify-center`}><config.icon size={20} className="text-white" /></div>
              <h1 className="text-xl font-black italic tracking-tighter uppercase">SMARTDO {isPro && <span className="text-indigo-400 text-[10px]">PRO</span>}</h1>
            </div>
            <button className="lg:hidden p-2 text-slate-400" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {Object.keys(portalConfig).map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setCurrentView('dashboard'); }} className={`flex items-center gap-3 w-full p-3 rounded-xl text-xs font-bold transition-all ${activeCategory === cat && currentView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              {React.createElement(portalConfig[cat].icon, { size: 16 })} {cat}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
            <button onClick={() => setIsLogOpen(true)} className="flex items-center gap-3 w-full p-3 text-xs font-bold text-slate-500 hover:text-white"><History size={16} /> Activity Log</button>
            <button onClick={() => setCurrentView('team')} className={`flex items-center gap-3 w-full p-3 text-xs font-bold transition-all ${currentView === 'team' ? 'text-white' : 'text-slate-500'}`}><Users size={16} /> Team Members</button>
          </div>
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-2">
          {!isPro && <button onClick={() => setCurrentView('billing')} className="flex items-center gap-3 w-full p-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"><Crown size={16} /> Upgrade PRO</button>}
          <button onClick={() => setCurrentView('settings')} className={`flex items-center gap-3 w-full p-3 rounded-xl text-xs font-bold ${currentView === 'settings' ? 'text-white bg-white/10' : 'text-slate-500 hover:text-white'}`}><Settings size={16} /> Settings</button>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-all"><LogOut size={16} /> Terminate Session</button>
        </div>
      </aside>

      /* MAIN CONTENT */
    /*  <main className={`flex-1 flex flex-col relative overflow-hidden ${settings.darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <header className={`h-24 flex items-center justify-between px-10 border-b shrink-0 z-20 ${settings.darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-8">
            <div className="hidden sm:block">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.text}`}>Portal Node</span>
              <h2 className={`text-3xl font-black tracking-tight ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}>{currentView === 'dashboard' ? config.greeting : currentView.toUpperCase()}</h2>
            </div>
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Neural search..." className={`pl-10 pr-4 py-2 rounded-xl text-xs font-bold outline-none border-none ${settings.darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={downloadPDFReport} className={`p-3 rounded-xl hidden md:flex items-center gap-2 font-black text-[10px] uppercase ${settings.darkMode ? 'text-slate-400 bg-slate-800' : 'text-slate-600 bg-slate-100'}`}><Download size={16}/> Export</button>
            <button onClick={() => toggleChat()} className={`${config.theme} text-white px-6 py-3 rounded-xl text-xs font-black shadow-lg uppercase flex items-center gap-2`}>
                <Sparkles size={16} /> Neural Brain
            </button>
          </div>
        </header>

        <section className="p-10 overflow-y-auto flex-1 no-scrollbar">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  <div className={`${settings.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} lg:col-span-2 p-8 rounded-[2.5rem] border shadow-sm h-64 flex flex-col`}>
                    <p className="text-lg font-black mb-4">Velocity Metrics</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <Area type="monotone" dataKey="val" stroke={config.hex} fill={config.hex} fillOpacity={0.1} />
                        <Tooltip />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl">
                     <Activity size={24} className="opacity-50" />
                     <h3 className="text-2xl font-black uppercase italic">Live Synchrony</h3>
                     <p className="text-[10px] font-bold opacity-70">Neural sync active across all nodes</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black">Active Workstream</h3>
                  <button onClick={() => setIsModalOpen(true)} className={`${config.theme} text-white w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center`}><Plus size={28} /></button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {filteredTasks.map((t) => (
                    <div key={t.title} className="relative group">
                      <TaskCard {...t} riskLevel={t.risk as any} isDark={settings.darkMode} />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2 transition-opacity">
                        <button onClick={() => openEditPanel(t)} className="p-2 bg-white dark:bg-slate-800 shadow-md rounded-lg text-slate-400 hover:text-indigo-500 border border-transparent dark:border-slate-700"><Edit3 size={16} /></button>
                        <button onClick={() => deleteTask(t.title)} className="p-2 bg-white dark:bg-slate-800 shadow-md rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent dark:border-slate-700"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentView === 'team' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter">Team Hub</h3>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Active Neural Collaborators</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"><Plus size={16}/> Invite Node</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teamMembers.map(member => (
                    <div key={member.id} className={`${settings.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-8 rounded-[2rem] border shadow-sm flex items-center justify-between`}>
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <img src={member.img} className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/20" alt={member.name} />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${settings.darkMode ? 'border-slate-900' : 'border-white'} ${member.online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        </div>
                        <div>
                          <h4 className="font-black text-lg leading-tight">{member.name}</h4>
                          <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider mb-1">{member.role}</p>
                          <div className="flex items-center gap-2">
                             <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${member.online ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>{member.online ? 'Online' : 'Away'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                         <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-600"><Mail size={16}/></button>
                         <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-600"><Settings size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {currentView === 'billing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
                <h3 className="text-4xl font-black uppercase text-center mb-10">Choose <span className="text-indigo-500">Pro</span> Plan</h3>
                {!selectedPlan ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <button key={plan.id} onClick={() => setSelectedPlan(plan)} className={`p-10 rounded-[2.5rem] border-2 text-left transition-all ${settings.darkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500 text-white' : 'bg-white border-slate-100 hover:border-indigo-500 text-slate-900'}`}>
                        <h4 className="font-black text-xl mb-2">{plan.duration}</h4>
                        <div className="text-3xl font-black text-indigo-500 mb-6">{plan.price}</div>
                        <div className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase text-center">Select Plan</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={`max-w-md mx-auto p-10 rounded-[2.5rem] border shadow-2xl relative ${settings.darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                    <button onClick={() => setSelectedPlan(null)} className="absolute right-6 top-6 text-slate-400 hover:text-indigo-500"><X size={20}/></button>
                    <h4 className="font-black text-xl mb-2 italic uppercase tracking-tighter">Secure Checkout</h4>
                    <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase">Total: <span className="text-indigo-500">{selectedPlan.price}</span></p>
                    <div className="space-y-3">
                       {paymentMethods.map(method => (
                         <button key={method.name} onClick={() => handlePaymentConfirm(method.name)} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 font-black text-xs transition-all ${settings.darkMode ? 'border-slate-800 hover:border-indigo-500 bg-slate-800/50' : 'border-slate-100 hover:border-indigo-500 bg-white'}`}>
                           <span className="flex items-center gap-3"><method.icon className={method.color} size={18}/> {method.name}</span>
                           <ChevronRight size={14}/>
                         </button>
                       ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-10">
                
                /* IDENTITY NODE (PROFILE EDIT) */
               /* <div className={`${settings.darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'} p-10 rounded-[3rem] border shadow-xl`}>
                    <div className="flex items-center justify-between mb-12">
                        <div>
                          <h3 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                            <UserCircle size={32} className="text-indigo-500"/> Identity Node
                          </h3>
                          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1">Configure your neural presence</p>
                        </div>
                        <button onClick={() => alert("Neural Identity Re-synchronized.")} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 transition-transform active:scale-95">Update Node</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        /* Avatar Column */
                       /* <div className="lg:col-span-4 flex flex-col items-center">
                            <div className="relative group mb-6" onClick={handleAvatarClick}>
                                <img src={profile.avatar} className="w-44 h-44 rounded-[3rem] object-cover border-8 border-indigo-500/10 transition-all group-hover:border-indigo-500/30" alt="Avatar" />
                                <div className="absolute inset-0 bg-slate-900/60 rounded-[3rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm">
                                    <Camera size={32} className="text-white" />
                                </div>
                                /* Hidden File Input */
                              /*  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            </div>
                            <div className="text-center">
                               <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[8px] font-black uppercase tracking-widest">Neural Link ID</span>
                               <p className="text-sm font-black mt-2 font-mono tracking-tighter">{profile.neuralId}</p>
                               <div className="flex items-center justify-center gap-2 mt-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Core Status: {profile.nodeStatus}</span>
                               </div>
                            </div>
                        </div>

                        /* Fields Column */
                        /*<div className="lg:col-span-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><User size={12}/> Legal Alias</label>
                                    <input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className={`w-full px-5 py-4 rounded-2xl outline-none font-bold text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Briefcase size={12}/> Primary Protocol (Role)</label>
                                    <input value={profile.role} onChange={(e) => setProfile({...profile, role: e.target.value})} className={`w-full px-5 py-4 rounded-2xl outline-none font-bold text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Mail size={12}/> Communication Port</label>
                                    <input value={profile.email} readOnly className={`w-full px-5 py-4 rounded-2xl outline-none font-bold text-sm opacity-50 cursor-not-allowed ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><MapPin size={12}/> Physical Geolocation</label>
                                    <input value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className={`w-full px-5 py-4 rounded-2xl outline-none font-bold text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Zap size={12}/> Neural Memory (Bio)</label>
                                <textarea rows={4} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className={`w-full px-5 py-4 rounded-2xl outline-none font-bold text-sm resize-none transition-all focus:ring-2 focus:ring-indigo-500/20 ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                /* SECURITY & PROTOCOLS SECTION */
               /* <div className={`${settings.darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'} p-10 rounded-[3rem] border shadow-sm`}>
                  <h3 className="text-2xl font-black mb-10 flex items-center gap-2 italic uppercase tracking-tighter"><ShieldCheck size={24} className="text-emerald-500"/> Global Protocols</h3>
                  <div className="space-y-8">
                    {[
                      { key: 'darkMode', label: 'Ultra Dark Mode', sub: 'Enable high-contrast night interface', icon: Sun },
                      { key: 'notifications', label: 'Neural Alerts', sub: 'Push notifications for task triggers', icon: Bell },
                      { key: 'aiPersonalization', label: 'AI Memory Sync', sub: 'Enable context retention for Neural Brain', icon: Sparkles },
                      { key: 'autoSave', label: 'Cloud Auto-Save', sub: 'Continuous backup to secure node', icon: Activity },
                      { key: 'biometricLock', label: 'Biometric Security', sub: 'Require Fingerprint/FaceID for access', icon: Fingerprint },
                    ].map((pref) => (
                      <div key={pref.key} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className={`p-3 rounded-xl ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'} group-hover:scale-110 transition-transform`}><pref.icon size={18} className="text-indigo-500"/></div>
                           <div>
                             <p className="font-black text-sm uppercase">{pref.label}</p>
                             <p className="text-[10px] text-slate-500 font-bold">{pref.sub}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => setSettings(s => ({...s, [pref.key]: !s[pref.key as keyof typeof settings]}))} 
                          className={`w-14 h-7 rounded-full relative transition-all shadow-inner ${settings[pref.key as keyof typeof settings] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${settings[pref.key as keyof typeof settings] ? 'translate-x-7' : ''}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        /* AI DRAWER */
       /* <div className={`fixed right-0 top-0 h-full w-full sm:w-[450px] ${settings.darkMode ? 'bg-slate-900 border-l border-slate-800' : 'bg-white border-l border-slate-100'} shadow-2xl transition-transform duration-500 z-[80] flex flex-col ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${settings.darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
              <span className="font-black text-lg flex items-center gap-2"><Sparkles className="text-indigo-500" size={20}/> Neural Brain</span>
              <button onClick={() => toggleChat()} className="p-2 rounded-xl">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((m: any, i: number) => (
                <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-bold ${m.role === 'ai' ? (settings.darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900') : 'bg-indigo-600 text-white'}`}>{m.content}</div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()} placeholder="Command the AI..." className={`w-full p-4 rounded-xl border outline-none font-bold ${settings.darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`} />
            </div>
        </div>

        /* MODAL */
       /* <div className={`fixed right-0 top-0 h-full w-full sm:w-[450px] ${settings.darkMode ? 'bg-slate-900' : 'bg-white'} shadow-2xl transition-transform duration-500 z-[90] ${isModalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <AddTaskModal isOpen={isModalOpen} onClose={closeTaskPanel} onAddTask={handleSaveTask} initialData={editingTask} isDarkMode={settings.darkMode} />
        </div>
      </main>
    </div>
  );
};

export default App;*/