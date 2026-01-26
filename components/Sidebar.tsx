
import React from 'react';
import { Shield } from 'lucide-react';
import { NAVIGATION_ITEMS, COLORS } from '../constants';

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-500 z-20`} style={{ width: '260px', background: 'var(--bg-app)' }}>
      <div className="p-8 flex items-center gap-3">
        <div style={{
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          borderRadius: '16px',
          padding: '10px',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(59, 130, 246, 0.3), 0 4px 15px rgba(0,0,0,0.3)'
        }}>
          <Shield style={{ color: '#fff', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8))' }} size={24} strokeWidth={2.5} />
        </div>
        <span className={`hidden lg:block font-bold text-xl tracking-tighter ${COLORS.text}`}>LOTI-flow</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group`}
            style={{
              marginBottom: '4px',
              padding: '12px 16px',
              color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === item.id ? 'var(--bg-hover)' : 'transparent',
            }}
          >
            <span className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span className="hidden lg:block font-semibold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={`p-8 hidden lg:block`}>
        <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Engine Online</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Monitoring 2.4k nodes across 3 regions.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
