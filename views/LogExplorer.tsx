import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Terminal, Clock, User, Monitor, ChevronRight, Activity } from 'lucide-react';

const API_URL = '/api';

const LogExplorer = () => {
    const [searchParams, setSearchParams] = useState({ query: '', host: '', user: '', process: '' });
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(true);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/logs/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(searchParams)
            });
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error("Search failed:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Log Explorer</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Advanced query engine for system telemetry and events.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" onClick={() => setShowFilters(!showFilters)} style={{ gap: '8px', border: '1px solid var(--border-color)' }}>
                        <Filter size={16} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <button className="btn btn-primary" style={{ gap: '8px' }}>
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="card" style={{ padding: '24px' }}>
                    <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Keyword Search</label>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    className="input-field"
                                    placeholder="Process name, command line, hash..."
                                    style={{ paddingLeft: '40px' }}
                                    value={searchParams.query}
                                    onChange={e => setSearchParams({ ...searchParams, query: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Host Selection</label>
                            <div style={{ position: 'relative' }}>
                                <Monitor size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    className="input-field"
                                    placeholder="Hostname"
                                    style={{ paddingLeft: '40px' }}
                                    value={searchParams.host}
                                    onChange={e => setSearchParams({ ...searchParams, host: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>User Identity</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    className="input-field"
                                    placeholder="Username"
                                    style={{ paddingLeft: '40px' }}
                                    value={searchParams.user}
                                    onChange={e => setSearchParams({ ...searchParams, user: e.target.value })}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px' }}>Search Logs</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                                <th style={{ padding: '16px', fontWeight: 600 }}>TIMESTAMP</th>
                                <th style={{ padding: '16px', fontWeight: 600 }}>HOST</th>
                                <th style={{ padding: '16px', fontWeight: 600 }}>PROCESS</th>
                                <th style={{ padding: '16px', fontWeight: 600 }}>COMMAND LINE</th>
                                <th style={{ padding: '16px', fontWeight: 600 }}>USER</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>
                                        <Activity className="animate-spin" style={{ margin: '0 auto', color: 'var(--sentinel-blue)' }} />
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <Terminal size={48} style={{ opacity: 0.2 }} />
                                            <p>No telemetry events found matching your filter criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.map((log) => (
                                <tr key={log.event_id} className="hover-row" style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                                    <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                            <Clock size={14} />
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--sentinel-blue)' }}>{log.hostname}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <code style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--sentinel-green)', fontSize: '0.8rem' }}>
                                                {log.process_name}
                                            </code>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)' }}>
                                            {log.command_line}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: 500 }}>{log.user_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LogExplorer;
