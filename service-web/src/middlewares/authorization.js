const { decodeToken } = require('../util/token');

const authorization = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ status: "error", message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: "error", message: "Unauthorized: Invalid token format" });
    }

    try {
        const decoded = decodeToken(token);
        if (!decoded) {
            return res.status(401).json({ status: "error", message: "Unauthorized: Invalid token" });
        }

        req.currentUserId = decoded.id; 
    } catch (error) {
        console.error("Token decoding error:", error);
        return res.status(403).json({ status: "error", message: "Forbidden: Token verification failed" });
    }
};

module.exports = authorization;
