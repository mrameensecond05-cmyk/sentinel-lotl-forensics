import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Activity, Shield, AlertTriangle, Info, RefreshCw } from 'lucide-react';

const API_URL = '/api';

const ThreatMap = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/threat-map`);
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error("Failed to fetch threat map data:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const getThreatColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'critical': return '#ef4444';
            case 'high': return '#f97316';
            case 'medium': return '#eab308';
            default: return '#22c55e';
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Global Threat Map</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Real-time visualization of global security events and telemetry nodes.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <Activity size={16} color="var(--sentinel-green)" className="animate-pulse" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sentinel-green)' }}>LIVE MONITORING</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px' }}>
                {/* Map Display (Mocked with SVG/Illustration) */}
                <div className="card" style={{ padding: '0', position: 'relative', overflow: 'hidden', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0E15' }}>
                    {/* Simplified SVG Map Background */}
                    <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '100%', opacity: 0.1, fill: '#3B82F6' }}>
                        <path d="M150,150 Q200,100 250,150 T350,150 T450,150 T550,150 T650,150 T750,150 T850,150" stroke="#3B82F6" fill="none" />
                        {/* Add more abstract paths for a "map" look */}
                        <circle cx="200" cy="200" r="100" />
                        <circle cx="500" cy="300" r="150" />
                        <circle cx="800" cy="200" r="120" />
                    </svg>

                    {/* Threat Nodes (Pulsing hotspots) */}
                    {data?.nodes.map((node: any) => (
                        <div key={node.id} style={{
                            position: 'absolute',
                            left: `${(node.lng + 180) * (100 / 360)}%`,
                            top: `${(90 - node.lat) * (100 / 180)}%`,
                            transform: 'translate(-50%, -50%)',
                            cursor: 'pointer'
                        }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                background: getThreatColor(node.threatLevel),
                                borderRadius: '50%',
                                zIndex: 2,
                                position: 'relative'
                            }}></div>
                            <div className="animate-ping" style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '12px',
                                height: '12px',
                                background: getThreatColor(node.threatLevel),
                                borderRadius: '50%',
                                opacity: 0.75
                            }}></div>
                            {/* Label */}
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(15, 16, 22, 0.9)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                whiteSpace: 'nowrap',
                                fontSize: '0.65rem',
                                color: 'white',
                                pointerEvents: 'none'
                            }}>
                                {node.city} ({node.hostCount} hosts)
                            </div>
                        </div>
                    ))}

                    <div style={{ position: 'absolute', bottom: '24px', left: '24px', background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem' }}>
                                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div> Stable
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem' }}>
                                <div style={{ width: '8px', height: '8px', background: '#f97316', borderRadius: '50%' }}></div> Alerting
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem' }}>
                                <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div> Incident
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                        <Shield size={48} color={data?.globalThreatLevel === 'MODERATE' ? 'var(--sentinel-orange)' : 'var(--sentinel-red)'} style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>GLOBAL THREAT STATUS</h3>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: data?.globalThreatLevel === 'MODERATE' ? 'var(--sentinel-orange)' : 'var(--sentinel-red)', marginBottom: '16px' }}>
                            {data?.globalThreatLevel || 'LOADING...'}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Active monitoring of telemetry nodes shows moderate suspicious activity globally.
                        </p>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>Top Hotspots</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {data?.nodes.sort((a: any, b: any) => b.hostCount - a.hostCount).slice(0, 3).map((node: any) => (
                                <div key={node.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MapPin size={14} color="var(--sentinel-blue)" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{node.city}</span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{node.hostCount}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Info size={16} color="var(--sentinel-blue)" style={{ flexShrink: 0 }} />
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>
                                IP Geolocation is based on estimated endpoint metadata. Accuracy may vary for VPN-connected nodes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreatMap;
