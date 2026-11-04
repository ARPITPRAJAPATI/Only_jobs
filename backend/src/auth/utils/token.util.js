import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            role: user.role,
        },
        env.JWT_SECRET,
        {
            expiresIn: env.JWT_EXPIRES_IN,
        }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, env.JWT_SECRET);
};