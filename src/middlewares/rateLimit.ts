import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import type { Request } from 'express';
import type { AuthRequest } from './auth.js';

export const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const r = req as AuthRequest;
    return r.user?.id || req.ip;
  },
});
