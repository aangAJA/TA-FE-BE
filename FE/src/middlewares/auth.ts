import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/express";

// Main token verification middleware
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      code: 'MISSING_TOKEN',
      message: 'Authorization header with Bearer token required' 
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      code: 'MISSING_TOKEN',
      message: 'Token not provided' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    console.error('JWT Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ 
        code: 'INVALID_TOKEN',
        message: 'Invalid token' 
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ 
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired' 
      });
    } else {
      return res.status(500).json({ 
        code: 'TOKEN_ERROR',
        message: 'Token verification failed' 
      });
    }
  }
};

// Role verification middleware (standalone)
export const verifyRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Get user from req.user (set by verifyToken)
    
    if (!user) {
      return res.status(401).json({ 
        code: 'UNAUTHENTICATED',
        message: 'User not authenticated. Please login first.' 
      });
    }
    
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        code: 'UNAUTHORIZED',
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}` 
      });
    }
    
    next();
  };
};

// Combined authentication and authorization guard
export const authGuard = (roles?: string[]) => {
  return [
    verifyToken,
    (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ 
          code: 'UNAUTHENTICATED',
          message: 'Please login first' 
        });
      }

      if (roles && !roles.includes(req.user.role)) {
        return res.status(403).json({
          code: 'UNAUTHORIZED',
          message: `You don't have permission. Required roles: ${roles.join(', ')}`
        });
      }

      next();
    }
  ];
};

// Optional: Middleware for optional authentication (doesn't fail if no token)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return next(); // Continue without setting req.user
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    console.error('Optional JWT Error:', error);
    // Don't return error, just continue without setting req.user
  }
  
  next();
};