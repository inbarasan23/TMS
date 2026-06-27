import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navigation from '../components/Navigation';

const RoleMaster = () => {
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({ roleName: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const roleOptions = ['SuperAdmin', 'User', 'Networking Staff', 'Plumber', 'Electrician', 'Software Developer', 'Cleaner', 'Carpenter'];

    useEffect(() => { fetchRoles(); }, []);

    const fetchRoles = async () => {
        try {
            const { data } = await API.get('/master/role');
            setRoles(data);
        } catch (err) { console.error('Error fetching roles', err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/master/role', formData);
            setFormData({ roleName: '', description: '' });
            fetchRoles();
            setMessage({ type: 'success', text: '✓ Role added successfully!' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: '✗ Error adding role' });
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Navigation />
            <div className="content-area">
                <div className="header-section">
                    <h1 className="main-title">👥 Role Master</h1>
                    <p className="subtitle">Manage user roles and permissions</p>
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
                                <label className="form-label">Role Name</label>
                                <select required value={formData.roleName}
                                    onChange={e => setFormData({ ...formData, roleName: e.target.value })}
                                    className="form-select">
                                    <option value="">Select Role</option>
                                    {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea placeholder="Enter role description..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="form-textarea" />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                                {loading ? 'Adding...' : '+ Add Role'}
                            </button>
                        </form>
                    </div>

                    <div className="table-card">
                        <h3 className="table-title">📋 Roles List</h3>
                        <div className="table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40%' }}>Role Name</th>
                                        <th style={{ width: '60%' }}>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.length > 0 ? (
                                        roles.map(role => (
                                            <tr key={role._id}>
                                                <td><span className="badge badge-accent">{role.roleName}</span></td>
                                                <td>{role.description || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="2" className="table-empty">No roles found</td></tr>
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

export default RoleMaster;
