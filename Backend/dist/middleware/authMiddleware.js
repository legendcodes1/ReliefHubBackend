import { supabase } from "../config/supabase.js";
export async function requireAuth(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authorization token is required",
        });
    }
    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
        return res.status(401).json({
            message: "Authorization token is required",
        });
    }
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
    req.user = data.user;
    return next();
}
