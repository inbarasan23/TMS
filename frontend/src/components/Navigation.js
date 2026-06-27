import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ showLogout = true }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <div className="nav-bar">
      <div className="nav-brand" onClick={() => navigate('/dashboard')}>
        <span className="nav-logo">⚡</span>
        TMS
      </div>

      <div className="nav-right">
        {userRole && (
          <div className="nav-user">
            <div className="nav-user-name">{userName}</div>
            <div className="nav-user-role">{userRole}</div>
          </div>
        )}

        {showLogout && (
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;