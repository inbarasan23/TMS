import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navigation from '../components/Navigation';

const RoomMaster = () => {
    const [rooms, setRooms] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [formData, setFormData] = useState({ department: '', programme: '', block: '', roomNumber: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => { fetchRooms(); fetchProgrammes(); }, []);

    const fetchRooms = async () => {
        try { const { data } = await API.get('/master/room'); setRooms(data); }
        catch (err) { console.error('Error fetching rooms', err); }
    };

    const fetchProgrammes = async () => {
        try {
            const { data } = await API.get('/master/programme');
            setProgrammes(data);
        } catch (err) { console.error('Error fetching programmes', err); }
    };
    const fetchBlocks = async (progId) => {
        try {
            const { data } = await API.get('/master/block');
            setBlocks(data.filter(b => b.programme && b.programme._id === progId));
        } catch (err) { console.error('Error fetching blocks', err); }
    };

    const handleProgrammeChange = (e) => {
        const progId = e.target.value;
        const selectedProg = programmes.find(p => p._id === progId);
        setFormData({ 
            ...formData, 
            programme: progId, 
            department: selectedProg?.department?._id || '',
            block: '' 
        });
        if (progId) fetchBlocks(progId);
        else setBlocks([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/master/room', formData);
            setFormData({ department: '', programme: '', block: '', roomNumber: '' });
            fetchRooms();
            setMessage({ type: 'success', text: '✓ Room added successfully!' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: '✗ Error adding room' });
            setTimeout(() => setMessage(''), 3000);
        } finally { setLoading(false); }
    };

    return (
        <div className="page-wrapper">
            <Navigation />
            <div className="content-area">
                <div className="header-section">
                    <h1 className="main-title">🚪 Room Master</h1>
                    <p className="subtitle">Manage all room numbers across departments</p>
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
                                <select required value={formData.programme} onChange={handleProgrammeChange} className="form-select">
                                    <option value="">Select Programme</option>
                                    {programmes.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.programmeName} ({p.programmeShortName})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Block</label>
                                <select required value={formData.block}
                                    onChange={e => setFormData({ ...formData, block: e.target.value })} className="form-select">
                                    <option value="">Select Block</option>
                                    {blocks.map(b => <option key={b._id} value={b._id}>{b.blockName}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Room Number</label>
                                <input type="text" required placeholder="e.g., A101"
                                    value={formData.roomNumber}
                                    onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
                                    className="form-input" />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                                {loading ? 'Adding...' : '+ Add Room'}
                            </button>
                        </form>
                    </div>

                    <div className="table-card">
                        <h3 className="table-title">📋 Rooms List</h3>
                        <div className="table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Programme</th>
                                        <th>Block</th>
                                        <th>Room #</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.length > 0 ? rooms.map(room => (
                                        <tr key={room._id}>
                                            <td>{room.department?.deptName || room.department?.department || '-'}</td>
                                            <td>{room.programme?.programmeName || room.programme?.programme || '-'}</td>
                                            <td>{room.block?.blockName || '-'}</td>
                                            <td><span className="badge badge-accent">{room.roomNumber}</span></td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="table-empty">No rooms found</td></tr>
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

export default RoomMaster;
