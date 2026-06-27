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

const ReportScreen = () => {
    const [complaints, setComplaints] = useState([]);
    const [filters, setFilters] = useState({ department: '', programme: '', complaintType: '', status: '', assignee: '' });
    const [departments, setDepartments] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);

    const typeOptions = ['PC Hardware', 'PC Software', 'Application Issues', 'Network', 'Electronics', 'Plumbing'];
    const statusOptions = ['Pending', 'Assigned', 'In-Progress', 'On-Hold', 'Completed'];

    useEffect(() => { fetchDepartments(); fetchUsers(); }, []);

    const fetchDepartments = async () => {
        try { const { data } = await API.get('/master/department'); setDepartments(data); }
        catch (err) { console.error('Error fetching departments:', err); }
    };
    const fetchProgrammes = async (deptId) => {
        try {
            const { data } = await API.get('/master/programme');
            setProgrammes(data.filter(p => p.department && p.department._id === deptId));
        } catch (err) { console.error('Error fetching programmes:', err); }
    };
    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/master/users');
            setUsers(data.filter(u => ['Plumber', 'Electrician', 'Networking Staff', 'Software Developer'].includes(u.role)));
        } catch (err) { console.error('Error fetching users:', err); }
    };

    const handleGenerateReport = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/complaints');
            let filtered = data;
            if (filters.department) filtered = filtered.filter(c => c.department?._id === filters.department);
            if (filters.programme) filtered = filtered.filter(c => c.programme?._id === filters.programme);
            if (filters.complaintType) filtered = filtered.filter(c => c.complaintType === filters.complaintType);
            if (filters.status) filtered = filtered.filter(c => c.status === filters.status);
            if (filters.assignee) filtered = filtered.filter(c => c.assignedTo?._id === filters.assignee);
            setComplaints(filtered);
            setShowReport(true);
        } catch (err) { console.error('Error generating report:', err); }
        finally { setLoading(false); }
    };

    const handlePrint = () => window.print();

    const handleExportCSV = () => {
        if (complaints.length === 0) { alert('No data to export'); return; }
        const headers = ['Block', 'Room', 'Type', 'Status', 'Remarks', 'Raised By', 'Assigned To', 'Created Date'];
        const rows = complaints.map(c => [
            c.blockName, c.roomNumber, c.complaintType, c.status, c.complaintRemarks,
            c.user?.userName || '', c.assignedTo?.userName || 'Unassigned',
            new Date(c.createdAt).toLocaleDateString()
        ]);
        let csv = headers.join(',') + '\n';
        rows.forEach(row => { csv += row.map(val => `"${val}"`).join(',') + '\n'; });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'complaints_report.csv'; a.click();
    };

    const handleDepartmentChange = (e) => {
        const deptId = e.target.value;
        setFilters({ ...filters, department: deptId, programme: '' });
        if (deptId) fetchProgrammes(deptId);
    };

    return (
        <div className="page-wrapper">
            <Navigation />
            <div className="content-area">
                <div className="header-section">
                    <h1 className="main-title">📊 Complaint Reports</h1>
                    <p className="subtitle">Generate and analyze detailed complaint reports</p>
                </div>

                {!showReport ? (
                    <div className="glass-card">
                        <h3 className="section-title">🔍 Report Filters</h3>
                        <div className="filters-row">
                            <div>
                                <label className="filter-label">Department</label>
                                <select value={filters.department} onChange={handleDepartmentChange} className="filter-select">
                                    <option value="">All Departments</option>
                                    {departments.map(d => <option key={d._id} value={d._id}>{d.deptName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="filter-label">Programme</label>
                                <select value={filters.programme}
                                    onChange={e => setFilters({ ...filters, programme: e.target.value })} className="filter-select">
                                    <option value="">All Programmes</option>
                                    {programmes.map(p => <option key={p._id} value={p._id}>{p.programmeName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="filter-label">Complaint Type</label>
                                <select value={filters.complaintType}
                                    onChange={e => setFilters({ ...filters, complaintType: e.target.value })} className="filter-select">
                                    <option value="">All Types</option>
                                    {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="filter-label">Status</label>
                                <select value={filters.status}
                                    onChange={e => setFilters({ ...filters, status: e.target.value })} className="filter-select">
                                    <option value="">All Statuses</option>
                                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="filter-label">Assignee</label>
                                <select value={filters.assignee}
                                    onChange={e => setFilters({ ...filters, assignee: e.target.value })} className="filter-select">
                                    <option value="">All Staff</option>
                                    {users.map(u => <option key={u._id} value={u._id}>{u.userName}</option>)}
                                </select>
                            </div>
                        </div>
                        <button onClick={handleGenerateReport} disabled={loading}
                            className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                            {loading ? 'Generating Report...' : '📈 Generate Report'}
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="report-actions" style={{ marginBottom: '24px' }}>
                            <button onClick={() => setShowReport(false)} className="btn btn-ghost">← Edit Filters</button>
                            <button onClick={handlePrint} className="btn btn-primary">🖨️ Print</button>
                            <button onClick={handleExportCSV} className="btn btn-accent">📥 Export CSV</button>
                        </div>

                        <div className="table-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                                <h3 className="table-title" style={{ marginBottom: 0 }}>📋 Report Results</h3>
                                <span className="badge badge-primary">{complaints.length} records</span>
                            </div>

                            {complaints.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                                    📭 No complaints found matching the criteria
                                </div>
                            ) : (
                                <div className="table-scroll">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Block</th>
                                                <th>Room</th>
                                                <th>Type</th>
                                                <th>Status</th>
                                                <th>Remarks</th>
                                                <th>Raised By</th>
                                                <th>Assigned To</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {complaints.map(c => (
                                                <tr key={c._id}>
                                                    <td>{c.blockName}</td>
                                                    <td><span className="badge badge-accent">{c.roomNumber}</span></td>
                                                    <td>{c.complaintType}</td>
                                                    <td><span className={`badge ${getStatusBadgeClass(c.status)}`}>{c.status}</span></td>
                                                    <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.complaintRemarks}</td>
                                                    <td>{c.user?.userName}</td>
                                                    <td>{c.assignedTo?.userName || <span className="text-danger">Unassigned</span>}</td>
                                                    <td style={{ fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportScreen;
