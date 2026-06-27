import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navigation from '../components/Navigation';

const RaiseComplaint = () => {
    const [formData, setFormData] = useState({
        department: '', programme: '', block: '', blockName: '', roomNumber: '',
        complaintType: 'PC Hardware', complaintRemarks: '', attachment: ''
    });
    const [departments, setDepartments] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => { fetchProgrammes(); }, []);

    const fetchDepartments = async () => {
        try { const { data } = await API.get('/master/department'); setDepartments(data); }
        catch (err) { setMessage({ type: 'error', text: 'Error fetching departments' }); }
    };
    const fetchProgrammes = async () => {
        try {
            const { data } = await API.get('/master/programme');
            setProgrammes(data);
        } catch (err) { setMessage({ type: 'error', text: 'Error fetching programmes' }); }
    };
    const fetchBlocks = async (progId) => {
        try {
            const { data } = await API.get('/master/block');
            setBlocks(data.filter(b => b.programme && b.programme._id === progId));
            setFormData(prev => ({ ...prev, block: '', blockName: '' }));
        } catch (err) { setMessage({ type: 'error', text: 'Error fetching blocks' }); }
    };

    const handleProgrammeChange = (e) => {
        const progId = e.target.value;
        const selectedProg = programmes.find(p => p._id === progId);
        setFormData(prev => ({ 
            ...prev, 
            programme: progId, 
            department: selectedProg?.department?._id || '', 
            block: '' 
        }));
        if (progId) fetchBlocks(progId);
        else setBlocks([]);
    };
    const handleBlockChange = (e) => {
        const blockId = e.target.value;
        const selectedBlock = blocks.find(b => b._id === blockId);
        setFormData(prev => ({ ...prev, block: blockId, blockName: selectedBlock?.blockName || '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/complaints', formData);
            setMessage({ type: 'success', text: '✓ Ticket submitted successfully!' });
            setFormData({
                department: '', programme: '', block: '', blockName: '', roomNumber: '',
                complaintType: 'PC Hardware', complaintRemarks: '', attachment: ''
            });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Error raising ticket: ' + (err.response?.data?.error || err.message) });
        } finally { setLoading(false); }
    };

    return (
        <div className="page-wrapper">
            <Navigation />
            <div className="content-area">
                <div className="header-section">
                    <h1 className="main-title">📝 Raise a New Ticket</h1>
                    <p className="subtitle">Submit a new support ticket or complaint</p>
                </div>

                {message && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.text}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px', alignItems: 'start' }}>
                    <div className="glass-card">
                        <form onSubmit={handleSubmit} className="form-body">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Programme / Course</label>
                                    <select required value={formData.programme} onChange={handleProgrammeChange} className="form-select">
                                        <option value="">Select your Programme</option>
                                        {programmes.map(p => (
                                            <option key={p._id} value={p._id}>
                                                {p.programmeName} ({p.programmeShortName}) - {p.department?.deptName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Block</label>
                                    <select required value={formData.block} onChange={handleBlockChange} className="form-select">
                                        <option value="">Select Block</option>
                                        {blocks.map(b => <option key={b._id} value={b._id}>{b.blockName}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Room Number</label>
                                    <input type="text" required placeholder="e.g., A101..." value={formData.roomNumber}
                                        onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Complaint Type</label>
                                    <select value={formData.complaintType}
                                        onChange={e => setFormData({ ...formData, complaintType: e.target.value })} className="form-select">
                                        <option value="PC Hardware">🖥️ PC Hardware</option>
                                        <option value="PC Software">💻 PC Software</option>
                                        <option value="Application Issues">⚙️ Application Issues</option>
                                        <option value="Network">🌐 Network</option>
                                        <option value="Electronics">⚡ Electronics</option>
                                        <option value="Plumbing">🔧 Plumbing</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Complaint Remarks</label>
                                <textarea required placeholder="Describe your issue in detail..." value={formData.complaintRemarks}
                                    onChange={e => setFormData({ ...formData, complaintRemarks: e.target.value })} className="form-textarea" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Attachment URL (Optional)</label>
                                <input type="url" placeholder="https://example.com/image.jpg" value={formData.attachment}
                                    onChange={e => setFormData({ ...formData, attachment: e.target.value })} className="form-input" />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                                {loading ? 'Submitting...' : '🚀 Submit Ticket'}
                            </button>
                        </form>
                    </div>

                    <div className="glass-card">
                        <h3 className="section-title">📌 Quick Tips</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {[
                                'Be as detailed as possible when describing your issue',
                                'Include the exact location and room number',
                                'Attach screenshots or images if available',
                                'Our team will respond within 24 hours',
                                "You'll receive updates on your ticket status"
                            ].map((tip, i) => (
                                <li key={i} style={{
                                    padding: '12px 0',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.85rem',
                                    borderBottom: '1px solid var(--border-color)',
                                    lineHeight: 1.5
                                }}>• {tip}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RaiseComplaint;