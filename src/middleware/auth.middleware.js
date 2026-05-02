import jwt from "jsonwebtoken";

// ================= TOKEN VERIFY =================
export const verifyTokenGuard = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({ message: "No token provided" });
        }

        const [type, token] = authorization.split(" ");

        if (type !== "Bearer" || !token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.AUTH_SECRET);

        req.user = decoded; // ✅ contains id, email, role

        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// ================= ADMIN GUARD =================
export const AdminUserGuard = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admin only access" });
        }

        next();

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};