import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0, pending: 0, closed: 0, assigned: 0, inProgress: 0, onHold: 0,
  });
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/complaints/stats');
      setStats({
        total: data.total || 0,
        pending: data.pending || 0,
        assigned: data.assigned || 0,
        inProgress: data.inProgress || 0,
        onHold: data.onHold || 0,
        closed: data.closed || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const go = (path) => navigate(path);

  const isSuperAdmin = userRole === 'SuperAdmin';
  const isUser = userRole === 'User';
  const isStaff = !isSuperAdmin && !isUser && userRole; // Any other role is staff

  return (
    <div className="page-wrapper">
      <Navigation />

      <div className="content-area">
        <div className="header-section">
          <h1 className="main-title">Dashboard</h1>
          <p className="subtitle">Welcome to your Ticket Management System</p>
        </div>

        {/* Stats Section */}
        {!loading && (
          <div className="section">
            <h2 className="section-title">
              {isUser ? "📊 Your Statistics" : isStaff ? "📊 Assigned Tasks" : "📊 System Statistics"}
            </h2>
            <div className="stats-grid">
              {isUser ? (
                <>
                  <StatCard icon="📋" label="My Total Complaints" value={stats.total} color="#6366f1" />
                  <StatCard icon="⏱️" label="In Process" value={stats.pending + stats.assigned + stats.inProgress} color="#f59e0b" />
                  <StatCard icon="✅" label="Resolved" value={stats.closed} color="#10b981" />
                </>
              ) : (
                <>
                  <StatCard icon="📋" label={isSuperAdmin ? "Total Tickets" : "Assigned Tickets"} value={stats.total} color="#6366f1" />
                  <StatCard icon="⏱️" label="Pending" value={stats.pending} color="#f59e0b" />
                  <StatCard icon="👤" label="Assigned" value={stats.assigned} color="#8b5cf6" />
                  <StatCard icon="⚙️" label="In Progress" value={stats.inProgress} color="#3b82f6" />
                  <StatCard icon="🔒" label="On Hold" value={stats.onHold} color="#ef4444" />
                  <StatCard icon="✅" label="Completed" value={stats.closed} color="#10b981" />
                </>
              )}
            </div>
          </div>
        )}

        {/* Admin Controls - ONLY FOR SUPERADMIN */}
        {isSuperAdmin && (
          <div className="section">
            <div className="section-header">
              <span className="section-icon">🔐</span>
              <h2 className="section-title">Admin Controls</h2>
            </div>
            <div className="buttons-grid">
              <NavBtn icon="🏢" label="Department Master" onClick={() => go('/department')} />
              <NavBtn icon="📚" label="Programme Master" onClick={() => go('/programme')} />
              <NavBtn icon="🏠" label="Block Master" onClick={() => go('/block')} />
              <NavBtn icon="🚪" label="Room Master" onClick={() => go('/room')} />
              <NavBtn icon="👑" label="Role Master" onClick={() => go('/role')} />
              <NavBtn icon="👥" label="User Management" onClick={() => go('/users')} />
            </div>
          </div>
        )}

        {/* Action Center */}
        <div className="section">
          <h2 className="section-title">⚡ {isUser ? "What would you like to do?" : "Ticket Management"}</h2>
          <div className="buttons-grid">
            {(isUser || isSuperAdmin) && (
              <NavBtn icon="📝" label="Raise New Ticket" onClick={() => go('/raise-complaint')} primary />
            )}
            
            <NavBtn 
              icon="📋" 
              label={isSuperAdmin ? "View All Tickets" : isUser ? "View My Tickets" : "My Assigned Tickets"} 
              onClick={() => go('/complaints')} 
              primary={isStaff} // Primary for staff since it's their main job
            />

            {isSuperAdmin && (
              <NavBtn icon="📈" label="Generate Report" onClick={() => go('/report')} primary />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card" style={{ '--stat-color': color }}>
    <span className="stat-icon">{icon}</span>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
  </div>
);

const NavBtn = ({ icon, label, onClick, primary = false }) => (
  <button onClick={onClick} className={`btn-nav ${primary ? 'btn-nav-primary' : ''}`}>
    <span className="btn-icon">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Dashboard;