import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Middleware para autenticar qualquer usuário
export function authUser(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido.' });
  }
}

// Middleware para autenticar apenas administradores
export function authAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.tipo !== '0') {
      res.status(403).json({ error: 'Apenas administradores podem acessar.' });
      return;
    }
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido.' });
  }
}
