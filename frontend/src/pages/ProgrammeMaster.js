import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navigation from '../components/Navigation';

const ProgrammeMaster = () => {
    const [programmes, setProgrammes] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ department: '', programmeName: '', programmeShortName: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [deptLoading, setDeptLoading] = useState(true);

    useEffect(() => {
        fetchProgrammes();
        fetchDepartments();
    }, []);

    const fetchProgrammes = async () => {
        try {
            const { data } = await API.get('/master/programme');
            setProgrammes(data);
        } catch (err) {
            setMessage({ type: 'error', text: 'Error fetching programmes' });
        }
    };

    const fetchDepartments = async () => {
        try {
            const { data } = await API.get('/master/department');
            setDepartments(data);
        } catch (err) {
            setMessage({ type: 'error', text: 'Error fetching departments' });
        } finally {
            setDeptLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/master/programme', formData);
            setFormData({ department: '', programmeName: '', programmeShortName: '' });
            fetchProgrammes();
            setMessage({ type: 'success', text: '✓ Programme added successfully!' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Error adding programme' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Navigation />
            <div className="content-area">
                <div className="header-section">
                    <h1 className="main-title">📚 Programme Master</h1>
                    <p className="subtitle">Manage all academic programmes</p>
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
                                <label className="form-label">
                                    Department {deptLoading && <span className="text-muted"> (Loading...)</span>}
                                </label>
                                <select required value={formData.department}
                                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                                    className="form-select" disabled={deptLoading}>
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept._id} value={dept._id}>
                                            {dept.department || dept.deptName || 'No name'}
                                        </option>
                                    ))}
                                </select>
                                {!deptLoading && departments.length === 0 && (
                                    <div className="alert alert-error" style={{ marginTop: '8px', marginBottom: 0 }}>
                                        ⚠️ No departments found. Please add departments first.
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Programme Name</label>
                                <input type="text" required value={formData.programmeName}
                                    onChange={e => setFormData({ ...formData, programmeName: e.target.value })}
                                    className="form-input" placeholder="Enter programme name..."
                                    disabled={deptLoading || departments.length === 0} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Short Name</label>
                                <input type="text" required value={formData.programmeShortName}
                                    onChange={e => setFormData({ ...formData, programmeShortName: e.target.value })}
                                    className="form-input" placeholder="e.g., BCA, MCA..." maxLength="5"
                                    disabled={deptLoading || departments.length === 0} />
                            </div>
                            <button type="submit"
                                disabled={loading || deptLoading || departments.length === 0}
                                className="btn btn-primary" style={{ width: '100%' }}>
                                {loading ? 'Adding...' : '+ Add Programme'}
                            </button>
                        </form>
                    </div>

                    <div className="table-card">
                        <h3 className="table-title">📋 Programme List</h3>
                        <div className="table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Programme Name</th>
                                        <th>Short Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {programmes.length > 0 ? (
                                        programmes.map(prog => (
                                            <tr key={prog._id}>
                                                <td>{prog.department?.deptName || prog.department?.department || 'N/A'}</td>
                                                <td>{prog.programmeName}</td>
                                                <td><span className="badge badge-primary">{prog.programmeShortName}</span></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="3" className="table-empty">No programmes found</td></tr>
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

export default ProgrammeMaster;