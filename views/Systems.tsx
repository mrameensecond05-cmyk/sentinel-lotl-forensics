import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Moon, Sun, User as UserIcon, FileText as FileTextIcon, Clock as ClockIcon, Settings as SettingsIcon } from 'lucide-react';

const Systems = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5001/api/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch users:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}><UserIcon /> USERS</button>
                    <button className="btn btn-ghost" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><FileTextIcon /> RULES</button>
                    <button className="btn btn-ghost" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><ClockIcon /> AUDIT</button>
                    <button className="btn btn-ghost" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><SettingsIcon /> SETTINGS</button>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '6px' }}>
                    <Plus size={16} /> New User
                </button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '20px' }}>User Profile</th>
                            <th style={{ padding: '20px' }}>Role Permission</th>
                            <th style={{ padding: '20px' }}>Activity Status</th>
                            <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', background: '#232533', borderRadius: '8px', color: 'var(--sentinel-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                                            {user.initials}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{user.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, border: '1px solid',
                                        color: user.role === 'ADMIN' ? 'var(--sentinel-red)' : user.role === 'ANALYST' ? 'var(--sentinel-blue)' : 'var(--sentinel-blue)',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.05)'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600, color: user.status === 'ACTIVE' ? 'var(--sentinel-green)' : 'var(--text-muted)' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: user.status === 'ACTIVE' ? 'var(--sentinel-green)' : 'var(--text-muted)' }}></div>
                                        {user.status}
                                    </div>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', color: 'var(--text-secondary)' }}>
                                        <Edit2 size={16} style={{ cursor: 'pointer' }} />
                                        <Trash2 size={16} style={{ cursor: 'pointer' }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Systems;
