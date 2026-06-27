import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DepartmentMaster from './pages/DepartmentMaster';
import ProgrammeMaster from './pages/ProgrammeMaster';
import BlockMaster from './pages/BlockMaster';
import RoomMaster from './pages/RoomMaster';
import RoleMaster from './pages/RoleMaster';
import UserMaster from './pages/UserMaster';
import RaiseComplaint from './pages/RaiseComplaint';
import ComplaintsList from './pages/ComplaintsList';
import ReportScreen from './pages/ReportScreen';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const adminRoles = ['SuperAdmin'];
  const userAndAdmin = ['User', 'SuperAdmin'];
  const allRoles = ['User', 'SuperAdmin', 'Networking Staff', 'Plumber', 'Electrician', 'Software Developer', 'Cleaner', 'Carpenter', 'panitiya', 'Other'];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={allRoles}><Dashboard /></ProtectedRoute>} />

        {/* Master Screens (Admin-only actions) */}
        <Route path="/department" element={<ProtectedRoute allowedRoles={adminRoles}><DepartmentMaster /></ProtectedRoute>} />
        <Route path="/programme" element={<ProtectedRoute allowedRoles={adminRoles}><ProgrammeMaster /></ProtectedRoute>} />
        <Route path="/block" element={<ProtectedRoute allowedRoles={adminRoles}><BlockMaster /></ProtectedRoute>} />
        <Route path="/room" element={<ProtectedRoute allowedRoles={adminRoles}><RoomMaster /></ProtectedRoute>} />
        <Route path="/role" element={<ProtectedRoute allowedRoles={adminRoles}><RoleMaster /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={adminRoles}><UserMaster /></ProtectedRoute>} />

        {/* Transactions & Reports */}
        <Route path="/raise-complaint" element={<ProtectedRoute allowedRoles={userAndAdmin}><RaiseComplaint /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute allowedRoles={allRoles}><ComplaintsList /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute allowedRoles={adminRoles}><ReportScreen /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;