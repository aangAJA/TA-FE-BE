
import { JwtPayload } from '../middlewares/authorization';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const generateToken = (payload: JwtPayload): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign(payload, process.env.JWT_SECRET as Secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
};