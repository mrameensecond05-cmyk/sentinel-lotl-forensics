// Authentication Middleware
const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Unauthorized - Please login' });
    }
    next();
};

// Admin-only middleware (Admin and Analyst are the same)
const requireAdmin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const allowedRoles = ['Admin', 'Analyst'];
    if (!allowedRoles.includes(req.session.user.role)) {
        return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }
    next();
};

// Get current user info
const getCurrentUser = (req) => {
    return req.session?.user || null;
};

module.exports = {
    requireAuth,
    requireAdmin,
    getCurrentUser
};
