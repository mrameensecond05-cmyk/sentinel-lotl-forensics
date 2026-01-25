import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ScanEye, Laptop, AlignCenterHorizontal } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B0C15' }}>
      <div className="glass-panel" style={{ padding: '3rem', borderRadius: '16px', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.1)',
            marginBottom: '1rem',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }} className="animate-float">
            <Shield size={48} color="var(--accent-primary)" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>LOTI System</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Living-Off-The-Land Intelligence & Forensics</p>
        </div>

        <div style={{ display: 'grid', gap: '1rem', width: '100%' }}>
          <button
            className="glass-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              textAlign: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
            onClick={() => navigate('/login/admin')}
          >
            <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '8px' }}>
              <ScanEye size={24} color="var(--accent-secondary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Analyst Portal</h3>
              <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-muted)' }}>Admin Login for SOC</p>
            </div>
          </button>

          <button
            className="glass-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              textAlign: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
            onClick={() => navigate('/login/user')}
          >
            <div style={{ padding: '0.75rem', background: 'rgba(0, 208, 132, 0.2)', borderRadius: '8px' }}>
              <Laptop size={24} color="var(--sentinel-green)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Endpoint User</h3>
              <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-muted)' }}>Manage your Monitored Device</p>
            </div>
          </button>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Lock size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
