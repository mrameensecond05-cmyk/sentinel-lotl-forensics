import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginSelection from './views/Login';
import LoginAdmin from './views/LoginAdmin';
import LoginUser from './views/LoginUser';
import Overview from './views/AdminDashboard';
import Intelligence from './views/Intelligence';
import Systems from './views/Systems';
import UserDashboard from './views/UserDashboard';
import UserProfile from './views/UserProfile';
import Cases from './views/Cases';
import VulnerabilityManagement from './views/VulnerabilityManagement';
import LogExplorer from './views/LogExplorer';
import ThreatMap from './views/ThreatMap';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LoginSelection />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login/user" element={<LoginUser />} />

        {/* Protected Admin Routes - Users cannot access these */}
        <Route element={<Layout />}>
          <Route path="/overview" element={
            <ProtectedRoute requireAdmin={true}>
              <Overview />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={<Navigate to="/overview" replace />} />
          <Route path="/intelligence" element={
            <ProtectedRoute requireAdmin={true}>
              <Intelligence />
            </ProtectedRoute>
          } />
          <Route path="/systems" element={
            <ProtectedRoute requireAdmin={true}>
              <Systems />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requireAdmin={true}>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/cases" element={
            <ProtectedRoute requireAdmin={true}>
              <Cases />
            </ProtectedRoute>
          } />
          <Route path="/vulnerabilities" element={
            <ProtectedRoute requireAdmin={true}>
              <VulnerabilityManagement />
            </ProtectedRoute>
          } />
          <Route path="/explorer" element={
            <ProtectedRoute requireAdmin={true}>
              <LogExplorer />
            </ProtectedRoute>
          } />
          <Route path="/map" element={
            <ProtectedRoute requireAdmin={true}>
              <ThreatMap />
            </ProtectedRoute>
          } />
        </Route>


        {/* Protected User Routes - Admins redirected to admin dashboard */}
        <Route path="/user" element={
          <ProtectedRoute requireAdmin={false}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
