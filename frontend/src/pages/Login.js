import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userName', data.userName || data.email || 'User');
            localStorage.setItem('userId', data.userId);
            setErrorMessage('');
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.message || "Invalid email or password";
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand">
                    <div className="login-brand-icon">⚡</div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to access your dashboard</p>
                </div>

                {errorMessage && (
                    <div className="login-error">{errorMessage}</div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="login-form-group">
                        <input
                            type="email"
                            className="login-input"
                            placeholder=" "
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <label className="login-label">Email</label>
                    </div>

                    <div className="login-form-group">
                        <input
                            type="password"
                            className="login-input"
                            placeholder=" "
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <label className="login-label">Password</label>
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;