import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginSelection from './views/Login';
import LoginAdmin from './views/LoginAdmin';
import LoginUser from './views/LoginUser';
import Overview from './views/AdminDashboard';
import Intelligence from './views/Intelligence';
import Systems from './views/Systems';
import UserDashboard from './views/UserDashboard';
import UserProfile from './views/UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LoginSelection />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login/user" element={<LoginUser />} />

        {/* Protected Admin Routes */}
        <Route element={<Layout />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/admin" element={<Navigate to="/overview" replace />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/systems" element={<Systems />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<UserDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
