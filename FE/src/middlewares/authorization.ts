import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth";
// Removed the import of JwtPayload to resolve circular import issue.
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Invalid authorization header format' });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            req.user = verifyToken(token);
            next();
        } catch (err) {
            console.error('JWT verification error:', err);
            
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: 'Token expired' });
            }
            if (err instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            
            return res.status(500).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Forbidden: Requires ${roles.join(' or ')} role` 
            });
        }
        
        next();
    };
};


export { JwtPayload };