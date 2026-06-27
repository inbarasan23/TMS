import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navigation from '../components/Navigation';

const getRoleBadgeClass = (role) => {
    const map = {
        'SuperAdmin': 'badge-superadmin', 'User': 'badge-user',
        'Networking Staff': 'badge-network', 'Plumber': 'badge-plumber',
        'Electrician': 'badge-electrician', 'Software Developer': 'badge-developer',
    };
    return map[role] || 'badge-primary';
};

const UserMaster = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        userName: '', email: '', password: '', phoneNumber: '', role: 'User', department: '', programme: ''
    });
    const [loading, setLoading] = useState(false);
    const [programmes, setProgrammes] = useState([]);
    const [message, setMessage] = useState('');

    const roleOptions = ['SuperAdmin', 'User', 'Networking Staff', 'Plumber', 'Electrician', 'Software Developer', 'Cleaner', 'Carpenter'];

    useEffect(() => { fetchUsers(); fetchProgrammes(); }, []);

    const fetchUsers = async () => {
        try { const { data } = await API.get('/master/users'); setUsers(data); }
        catch (err) { console.error('Error fetching users', err); }
    };

    const fetchProgrammes = async () => {
        try {
            const { data } = await API.get('/master/programme');
            setProgrammes(data);
        } catch (err) { console.error('Error fetching programmes', err); }
    };

    const handleProgrammeChange = (e) => {
        const progId = e.target.value;
        const selectedProg = programmes.find(p => p._id === progId);
        setFormData({ 
            ...formData, 
            programme: progId, 
            department: selectedProg?.department?._id || '' 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/master/users', formData);
            setFormData({ userName: '', email: '', password: '', phoneNumber: '', role: 'User', department: '', programme: '' });
            fetchUsers();
            setMessage({ type: 'success', text: '✓ User created successfully!' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: '✗ Error creating user' });
            setTimeout(() => setMessage(''), 3000);
        } finally { setLoading(false); }
    };

    return (
        <div className="page-wrapper">
            <Navigation />
            <div className="content-area">
                <div className="header-section">
                    <h1 className="main-title">👤 User Management</h1>
                    <p className="subtitle">Create and manage user accounts</p>
                </div>

                {message && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.text}
                    </div>
                )}

                <div className="master-grid">
                    <div className="glass-card">
                        <form onSubmit={handleSubmit} className="form-body">
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input type="text" required placeholder="Enter username..."
                                    value={formData.userName}
                                    onChange={e => setFormData({ ...formData, userName: e.target.value })}
                                    className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" required placeholder="Enter email..."
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input type="password" required placeholder="Enter password..."
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input type="tel" required placeholder="10-digit phone..."
                                    value={formData.phoneNumber}
                                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select required value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="form-select">
                                    {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Programme / Course</label>
                                <select required value={formData.programme} onChange={handleProgrammeChange} className="form-select">
                                    <option value="">Select Programme</option>
                                    {programmes.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.programmeName} ({p.programmeShortName})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                                {loading ? 'Creating...' : '+ Create User'}
                            </button>
                        </form>
                    </div>

                    <div className="table-card">
                        <h3 className="table-title">📋 Users List</h3>
                        <div className="table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.userName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phoneNumber || '-'}</td>
                                            <td><span className={`badge ${getRoleBadgeClass(user.role)}`}>{user.role}</span></td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="table-empty">No users found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserMaster;