import { 
  Zap, Rocket, Laptop, Building2, Factory, Store, Globe, Landmark, User 
} from 'lucide-react';

export const portalConfig: any = {
  All: { 
    theme: 'bg-indigo-600', 
    text: 'text-indigo-600', 
    hex: '#4f46e5', 
    lightBg: 'bg-indigo-50', 
    icon: Zap, 
    label: 'General OS', 
    greeting: 'System Ready.' 
  },
  Startups: { 
    theme: 'bg-orange-600', 
    text: 'text-orange-600', 
    hex: '#ea580c', 
    lightBg: 'bg-orange-50', 
    icon: Rocket, 
    label: 'Growth Engine', 
    greeting: 'Venture mode active.' 
  },
  'IT companies': { 
    theme: 'bg-emerald-600', 
    text: 'text-emerald-600', 
    hex: '#059669', 
    lightBg: 'bg-emerald-50', 
    icon: Laptop, 
    label: 'DevOps Hub', 
    greeting: 'Environment stable.' 
  },
  MNCs: { 
    theme: 'bg-blue-600', 
    text: 'text-blue-600', 
    hex: '#2563eb', 
    lightBg: 'bg-blue-50', 
    icon: Building2, 
    label: 'Global Corp', 
    greeting: 'Compliance protocols active.' 
  },
  FMCG: { 
    theme: 'bg-rose-600', 
    text: 'text-rose-600', 
    hex: '#e11d48', 
    lightBg: 'bg-rose-50', 
    icon: Factory, 
    label: 'Supply Chain', 
    greeting: 'Inventory synced.' 
  },
  SMEs: { 
    theme: 'bg-violet-600', 
    text: 'text-violet-600', 
    hex: '#7c3aed', 
    lightBg: 'bg-violet-50', 
    icon: Store, 
    label: 'Business Suite', 
    greeting: 'Local operations live.' 
  },
  'Import/Export': { 
    theme: 'bg-cyan-600', 
    text: 'text-cyan-600', 
    hex: '#0891b2', 
    lightBg: 'bg-cyan-50', 
    icon: Globe, 
    label: 'Logistics Command', 
    greeting: 'Global ports monitored.' 
  },
  Government: { 
    theme: 'bg-slate-700', 
    text: 'text-slate-700', 
    hex: '#334155', 
    lightBg: 'bg-slate-100', 
    icon: Landmark, 
    label: 'Public Portal', 
    greeting: 'Transparency engaged.' 
  },
  Personal: { 
    theme: 'bg-pink-600', 
    text: 'text-pink-600', 
    hex: '#db2777', 
    lightBg: 'bg-pink-50', 
    icon: User, 
    label: 'Life Design', 
    greeting: 'Wellness mode active.' 
  }
};