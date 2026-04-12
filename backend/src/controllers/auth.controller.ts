import { Request, Response } from 'express';
import { registerUserService, loginUserService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { ZodError } from 'zod';

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await registerUserService(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const fields: Record<string, string> = {};
      error.errors.forEach(err => {
        if (err.path[0]) {
          fields[err.path[0].toString()] = err.message;
        }
      });
      return res.status(400).json({ error: 'validation failed', fields });
    }
    
    if (error.message === 'Email already in use') {
      return res.status(400).json({ error: 'validation failed', fields: { email: 'already in use' } });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await loginUserService(validatedData);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const fields: Record<string, string> = {};
      error.errors.forEach(err => {
        if (err.path[0]) {
          fields[err.path[0].toString()] = err.message;
        }
      });
      return res.status(400).json({ error: 'validation failed', fields });
    }

    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'unauthorized', message: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};
