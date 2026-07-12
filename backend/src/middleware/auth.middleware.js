import {getAuth} from "@clerk/express";

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader) {
            console.warn("Missing Authorization header in request to:", req.originalUrl);
            return res.status(401).json({message: "Unauthorized - No token provided"});
        }
        const { userId } = getAuth(req);
        if (!userId) {
            console.warn("Clerk could not find userId for request to:", req.originalUrl);
            return res.status(401).json({
                message: "Unauthorized - Invalid token",
                debug: {headerPresent: true}
            });
        }
        req.auth = req.auth || {};
        req.auth.userId = userId;
        next();
    } catch (error) {
        console.error("Critical error in protectRoute:", error);
        next(error);
    }
};

export const requireAdmin = async (req, res, next) => {
    try {
        const {userId, sessionClaims} = getAuth(req);

        if (!userId) {
            return res.status(401).json({message: "Unauthorized - you must be logged in"});
        }

        const role = sessionClaims?.metadata?.role;
        if (role !== "admin") {
            return res.status(403).json({message: "Forbidden - you must be an admin"});
        }

        next();
    } catch (error) {
        console.error("Error in requireAdmin:", error);
        next(error);
    }
};
