import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navigation from '../components/Navigation';

const DepartmentMaster = () => {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ deptName: '', deptShortName: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => { fetchDepartments(); }, []);

    const fetchDepartments = async () => {
        try {
            const { data } = await API.get('/master/department');
            setDepartments(data);
        } catch (err) {
            setMessage({ type: 'error', text: 'Error fetching departments' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/master/department', formData);
            setFormData({ deptName: '', deptShortName: '' });
            fetchDepartments();
            setMessage({ type: 'success', text: '✓ Department added successfully!' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Error adding department' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Navigation />
            <div className="content-area">
                <div className="header-section">
                    <h1 className="main-title">🏢 Department Master</h1>
                    <p className="subtitle">Manage all departments in the system</p>
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
                                <label className="form-label">Department Name</label>
                                <input
                                    type="text" required
                                    value={formData.deptName}
                                    onChange={e => setFormData({ ...formData, deptName: e.target.value })}
                                    className="form-input"
                                    placeholder="Enter department name..."
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Short Name</label>
                                <input
                                    type="text" required
                                    value={formData.deptShortName}
                                    onChange={e => setFormData({ ...formData, deptShortName: e.target.value })}
                                    className="form-input"
                                    placeholder="e.g., IT, HR..."
                                    maxLength="5"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                                {loading ? 'Adding...' : '+ Add Department'}
                            </button>
                        </form>
                    </div>

                    <div className="table-card">
                        <h3 className="table-title">📋 Department List</h3>
                        <div className="table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '70%' }}>Department Name</th>
                                        <th style={{ width: '30%' }}>Short Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.length > 0 ? (
                                        departments.map(dept => (
                                            <tr key={dept._id}>
                                                <td>{dept.deptName}</td>
                                                <td><span className="badge badge-primary">{dept.deptShortName}</span></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="2" className="table-empty">No departments found</td></tr>
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

export default DepartmentMaster;
