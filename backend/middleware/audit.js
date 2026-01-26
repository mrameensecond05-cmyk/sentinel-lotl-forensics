// Audit Logging Middleware
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Log an action to the audit table
const logAuditAction = async (userId, actionType, targetType, targetId, description, ipAddress) => {
    try {
        const db = new sqlite3.Database(path.join(__dirname, '../lotl.db'));

        return new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO lotl_audit_log 
                (user_id, action_type, target_type, target_id, description, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [userId, actionType, targetType, targetId, description, ipAddress], (err) => {
                db.close();
                if (err) reject(err);
                else resolve();
            });
        });
    } catch (err) {
        console.error('Audit log error:', err);
    }
};

// Middleware factory for audit logging
const auditLog = (actionType, targetType, getDescription) => {
    return async (req, res, next) => {
        // Store original res.json
        const originalJson = res.json.bind(res);

        res.json = function (data) {
            // Only log on success (2xx status codes)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const userId = req.session?.user?.id || null;
                const targetId = req.params.id || req.body?.id || null;
                const description = typeof getDescription === 'function'
                    ? getDescription(req, data)
                    : getDescription || actionType;
                const ipAddress = req.ip || req.connection.remoteAddress;

                // Log asynchronously, don't wait
                logAuditAction(userId, actionType, targetType, targetId, description, ipAddress)
                    .catch(err => console.error('Audit log failed:', err));
            }

            return originalJson(data);
        };

        next();
    };
};

module.exports = {
    logAuditAction,
    auditLog
};
