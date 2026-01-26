
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { COLORS } from '../constants';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, trend, trendUp, color = 'emerald' }) => {
  const accentColors: Record<string, string> = {
    emerald: 'text-emerald-500',
    rose: 'text-rose-500',
    amber: 'text-amber-500',
    sky: 'text-sky-500'
  };

  return (
    <div
      className="hover:-translate-y-1 transition-transform duration-200"
      style={{
        background: 'var(--bg-panel)',
        border: 'var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        padding: '1.5rem'
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <span style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 500
        }}>
          {title}
        </span>
        <Icon size={20} className={accentColors[color]} strokeWidth={2} />
      </div>
      <div className="flex items-end justify-between">
        <h3 style={{
          fontSize: '2rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1
        }}>
          {value}
        </h3>
        {trend && (
          <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {trendUp ? '+' : ''}{trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default KPICard;
