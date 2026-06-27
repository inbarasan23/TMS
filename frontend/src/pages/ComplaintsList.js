import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navigation from '../components/Navigation';

const getStatusBadgeClass = (status) => {
    const map = {
        'Pending': 'badge-pending', 'Assigned': 'badge-assigned',
        'In-Progress': 'badge-in-progress', 'On-Hold': 'badge-on-hold', 'Completed': 'badge-completed'
    };
    return map[status] || 'badge-primary';
};

const ComplaintsList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ status: '', type: '' });
    const [message, setMessage] = useState('');

    const statusOptions = ['Pending', 'Assigned', 'In-Progress', 'On-Hold', 'Completed'];
    const typeOptions = ['PC Hardware', 'PC Software', 'Application Issues', 'Network', 'Electronics', 'Plumbing'];

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
        fetchComplaints();
        if (role === 'SuperAdmin') fetchUsers();
    }, []);

    const fetchComplaints = async () => {
        try { const { data } = await API.get('/complaints'); setComplaints(data); }
        catch (err) { setMessage({ type: 'error', text: 'Error fetching complaints' }); }
        finally { setLoading(false); }
    };
    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/master/users');
            setUsers(data.filter(u => ['Plumber', 'Electrician', 'Networking Staff', 'Software Developer'].includes(u.role)));
        } catch (err) { console.error('Error fetching users:', err); }
    };

    const handleAssign = async (complaintId, assigneeId) => {
        try {
            await API.put(`/complaints/assign/${complaintId}`, { assignedTo: assigneeId });
            fetchComplaints(); setSelectedComplaint(null);
            setMessage({ type: 'success', text: '✓ Complaint assigned successfully!' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) { setMessage({ type: 'error', text: 'Error assigning complaint' }); }
    };
    const handleStatusChange = async (complaintId, newStatus) => {
        try {
            await API.put(`/complaints/status/${complaintId}`, { status: newStatus });
            fetchComplaints(); setSelectedComplaint(null);
            setMessage({ type: 'success', text: '✓ Status updated successfully!' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) { setMessage({ type: 'error', text: 'Error updating status' }); }
    };

    const isSuperAdmin = userRole === 'SuperAdmin';
    const isStaff = ['Plumber', 'Electrician', 'Networking Staff', 'Software Developer'].includes(userRole);

    const filteredComplaints = complaints.filter(c => {
        if (filters.status && c.status !== filters.status) return false;
        if (filters.type && c.complaintType !== filters.type) return false;
        return true;
    });

    if (loading) return (
        <div className="page-wrapper">
            <Navigation />
            <div className="spinner-container"><div className="spinner"></div></div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Navigation />
            <div className="content-area">
                <div className="header-section">
                    <h1 className="main-title">📋 All Tickets</h1>
                    <p className="subtitle">View and manage all support tickets</p>
                </div>

                {message && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.text}
                    </div>
                )}

                {/* Filters */}
                <div className="filter-card">
                    <div className="filters-row">
                        <div>
                            <label className="filter-label">🔍 Status</label>
                            <select value={filters.status}
                                onChange={e => setFilters({ ...filters, status: e.target.value })} className="filter-select">
                                <option value="">All Status</option>
                                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="filter-label">🏷️ Type</label>
                            <select value={filters.type}
                                onChange={e => setFilters({ ...filters, type: e.target.value })} className="filter-select">
                                <option value="">All Types</option>
                                {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="table-card">
                    <div className="table-scroll">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Block</th>
                                    <th>Room</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Raised By</th>
                                    <th>Assigned To</th>
                                    {isSuperAdmin && <th>Assign Staff</th>}
                                    {(isSuperAdmin || isStaff) && <th>Update Status</th>}
                                    <th>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredComplaints.length === 0 ? (
                                    <tr><td colSpan="10" className="table-empty">No tickets found</td></tr>
                                ) : (
                                    filteredComplaints.map(c => (
                                        <tr key={c._id}>
                                            <td><span className="badge-id">{c._id.substring(0, 8)}</span></td>
                                            <td>{c.blockName}</td>
                                            <td>{c.roomNumber}</td>
                                            <td>{c.complaintType}</td>
                                            <td><span className={`badge ${getStatusBadgeClass(c.status)}`}>{c.status}</span></td>
                                            <td>{c.user?.userName}</td>
                                            <td>{c.assignedTo?.userName || <span className="text-danger">Unassigned</span>}</td>
                                            {isSuperAdmin && (
                                                <td>
                                                    <select value={c.assignedTo?._id || ''}
                                                        onChange={e => handleAssign(c._id, e.target.value)} className="inline-select">
                                                        <option value="">-- Assign --</option>
                                                        {users.map(u => <option key={u._id} value={u._id}>{u.userName} ({u.role})</option>)}
                                                    </select>
                                                </td>
                                            )}
                                            {(isSuperAdmin || isStaff) && (
                                                <td>
                                                    <select value={c.status}
                                                        onChange={e => handleStatusChange(c._id, e.target.value)} className="inline-select">
                                                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </td>
                                            )}
                                            <td>
                                                <button onClick={() => setSelectedComplaint(c)} className="btn-view">👁️</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedComplaint && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedComplaint(null)}>
                    <div className="modal-card">
                        <div className="modal-header">
                            <h2 className="modal-title">🎫 Ticket Details</h2>
                            <button onClick={() => setSelectedComplaint(null)} className="modal-close">✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Block</span>
                                <p className="detail-value">{selectedComplaint.blockName}</p>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Room</span>
                                <p className="detail-value">{selectedComplaint.roomNumber}</p>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Type</span>
                                <p className="detail-value">{selectedComplaint.complaintType}</p>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Remarks</span>
                                <p className="detail-value">{selectedComplaint.complaintRemarks}</p>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Raised By</span>
                                <p className="detail-value">
                                    {selectedComplaint.user?.userName}
                                    <br /><span className="text-muted">{selectedComplaint.user?.email}</span>
                                </p>
                            </div>

                            {isSuperAdmin && (
                                <div className="detail-row">
                                    <span className="detail-label">Assign To</span>
                                    <select onChange={e => handleAssign(selectedComplaint._id, e.target.value)} className="detail-select">
                                        <option value="">Select Staff Member</option>
                                        {users.map(u => <option key={u._id} value={u._id}>{u.userName} ({u.role})</option>)}
                                    </select>
                                </div>
                            )}

                            {(isSuperAdmin || (isStaff && selectedComplaint.assignedTo?._id === localStorage.getItem('userId'))) && (
                                <div className="detail-row">
                                    <span className="detail-label">Update Status</span>
                                    <select value={selectedComplaint.status}
                                        onChange={e => handleStatusChange(selectedComplaint._id, e.target.value)} className="detail-select">
                                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setSelectedComplaint(null)} className="btn btn-ghost">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintsList;
