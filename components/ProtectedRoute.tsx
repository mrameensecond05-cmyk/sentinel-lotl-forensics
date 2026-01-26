import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    // No authentication at all
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Require admin role
    if (requireAdmin && userRole !== 'admin') {
        return <Navigate to="/user" replace />;
    }

    // Prevent admin from accessing user-only routes
    if (!requireAdmin && userRole === 'admin') {
        return <Navigate to="/overview" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
