import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { token } from 'morgan';

export interface AuthRequest extends Request {
  user?: { id: string; role: 'user' | 'admin' };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' });
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret) as any;
    req.user = { id: payload.id, role: payload.role };
    next();
    console.log("This is the token",token);
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}
console.log(token);

export function requireOwnerOrAdmin(getOwnerId: (req: AuthRequest) => string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role === 'admin') return next();
    const ownerId = getOwnerId(req);
    if (req.user?.id === ownerId) return next();
    return res.status(403).json({ success: false, message: 'Forbidden' });
  };
}
