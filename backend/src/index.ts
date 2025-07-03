import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from './generated/prisma';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { Request, Response } from 'express';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API CRUD Usuários - Backend rodando!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
