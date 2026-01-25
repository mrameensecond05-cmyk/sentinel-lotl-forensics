import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Server, ArrowRight, AlertCircle, UserPlus, LogIn } from 'lucide-react';

const LoginAdmin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const API_URL = 'http://localhost:5001/api';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isRegistering ? '/register' : '/login';
            const body = isRegistering
                ? { ...formData, role_id: 1 } // Role 1 = Admin
                : { email: formData.email, password: formData.password };

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || (isRegistering ? 'Registration failed' : 'Login failed'));

            if (isRegistering) {
                // Auto login after register or just switch mode? 
                // Let's switch to login mode with success message or auto-login
                // For simplicity: Auto login logic or just alert.
                // Re-using login logic immediately:
                const loginRes = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, password: formData.password })
                });
                const loginData = await loginRes.json();
                if (!loginRes.ok) throw new Error(loginData.error || 'Auto-login failed after registration');

                // Set LocalStorage
                localStorage.setItem('token', loginData.token);
                localStorage.setItem('userRole', loginData.role);
                localStorage.setItem('userName', loginData.user.name);
                localStorage.setItem('userEmail', loginData.user.email);
                navigate('/overview');
                return;
            }

            if (data.role !== 'admin') {
                throw new Error("Access Denied: Not an Admin Account");
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userEmail', data.user.email);

            navigate('/overview');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B0C15' }}>
            <div className="glass-panel" style={{ padding: '3rem', borderRadius: '16px', maxWidth: '420px', width: '100%', borderColor: 'var(--sentinel-blue)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', marginBottom: '1rem' }}>
                        <Server size={40} color="var(--sentinel-blue)" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{isRegistering ? 'Admin Registration' : 'Admin Portal'}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>{isRegistering ? 'Create new SOC Administrator' : 'SOC Management Access'}</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ width: '100%' }}>
                    {isRegistering && (
                        <input
                            className="input-field"
                            placeholder="Full Name"
                            value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                            required
                        />
                    )}
                    <input
                        className="input-field"
                        placeholder="Admin Email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        className="input-field"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    {error && <div className="text-red-500 text-sm flex items-center gap-2 bg-red-900/20 p-2 rounded"><AlertCircle size={14} /> {error}</div>}

                    <button type="submit" disabled={loading} className="btn btn-primary w-full flex justify-center gap-2" style={{ background: 'var(--sentinel-blue)', color: 'white' }}>
                        {loading ? 'Processing...' : (isRegistering ? 'Register & Login' : 'Access Console')}
                        {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-sm text-blue-400 hover:text-blue-300 underline bg-transparent border-none cursor-pointer"
                    >
                        {isRegistering ? 'Already have an account? Login' : 'Need an admin account? Register'}
                    </button>
                </div>

                <p className="text-center mt-6 text-sm text-gray-500 cursor-pointer hover:text-white" onClick={() => navigate('/')}>
                    &larr; Back to Selection
                </p>
            </div>
        </div>
    );
};

export default LoginAdmin;
