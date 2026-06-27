import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navigation from '../components/Navigation';

const BlockMaster = () => {
    const [blocks, setBlocks] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [formData, setFormData] = useState({ department: '', programme: '', blockName: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => { fetchBlocks(); fetchProgrammes(); }, []);

    const fetchBlocks = async () => {
        try { const { data } = await API.get('/master/block'); setBlocks(data); }
        catch (err) { setMessage({ type: 'error', text: 'Error fetching blocks' }); }
    };



    const fetchProgrammes = async () => {
        try {
            const { data } = await API.get('/master/programme');
            setProgrammes(data);
        } catch (err) { setMessage({ type: 'error', text: 'Error fetching programmes' }); }
    };

    const handleProgrammeChange = (e) => {
        const progId = e.target.value;
        const selectedProg = programmes.find(p => p._id === progId);
        setFormData({ 
            ...formData, 
            programme: progId, 
            department: selectedProg?.department?._id || '',
            blockName: '' 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/master/block', formData);
            setFormData({ department: '', programme: '', blockName: '' });
            setProgrammes([]);
            fetchBlocks();
            setMessage({ type: 'success', text: '✓ Block added successfully!' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Error adding block' });
        } finally { setLoading(false); }
    };

    return (
        <div className="page-wrapper">
            <Navigation />
            <div className="content-area">
                <div className="header-section">
                    <h1 className="main-title">🏠 Block Master</h1>
                    <p className="subtitle">Manage building blocks and their associations</p>
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
                                <label className="form-label">Programme / Course</label>
                                <select required value={formData.programme}
                                    onChange={handleProgrammeChange}
                                    className="form-select">
                                    <option value="">Select Programme</option>
                                    {programmes.map(prog => (
                                        <option key={prog._id} value={prog._id}>
                                            {prog.programmeName} ({prog.programmeShortName}) - {prog.department?.deptName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Block Name</label>
                                <input type="text" required value={formData.blockName}
                                    onChange={e => setFormData({ ...formData, blockName: e.target.value })}
                                    className="form-input" placeholder="e.g., Block A, Main Building..." />
                            </div>
                            <button type="submit"
                                disabled={loading || !formData.department || !formData.programme || !formData.blockName}
                                className="btn btn-primary" style={{ width: '100%' }}>
                                {loading ? 'Adding...' : '+ Add Block'}
                            </button>
                        </form>
                    </div>

                    <div className="table-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                            <h3 className="table-title" style={{ marginBottom: 0 }}>📋 All Blocks</h3>
                            <span className="badge badge-primary">{blocks.length} Blocks</span>
                        </div>
                        <div className="table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Programme</th>
                                        <th>Block Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blocks.length > 0 ? (
                                        blocks.map(block => (
                                            <tr key={block._id}>
                                                <td>{block.department?.deptName || block.department?.department || 'N/A'}</td>
                                                <td>{block.programme?.programmeName || block.programme?.programme || 'N/A'}</td>
                                                <td><span className="badge badge-accent">{block.blockName}</span></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="3" className="table-empty">No blocks found. Add your first block above.</td></tr>
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

export default BlockMaster;