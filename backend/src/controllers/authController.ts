import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Função para autenticar usuário e gerar token
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
    return;
  }

  const usuario = await prisma.usuario.findUnique({ where: { Username: username } });
  if (!usuario) {
    res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    return;
  }

  if (usuario.Status !== 'A') {
    res.status(403).json({ error: 'Usuário inativo ou bloqueado.' });
    return;
  }

  const senhaCorreta = await bcrypt.compare(password, usuario.Password);
  if (!senhaCorreta) {
    // Incrementa tentativas de erro e bloqueia após 3
    await prisma.usuario.update({
      where: { Username: username },
      data: {
        Quant_Acesso: (usuario.Quant_Acesso || 0) + 1,
        Status: (usuario.Quant_Acesso || 0) + 1 >= 3 ? 'B' : usuario.Status
      }
    });
    res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    return;
  }

  // Zera tentativas e incrementa acesso
  await prisma.usuario.update({
    where: { Username: username },
    data: {
      Quant_Acesso: 0
    }
  });

  const token = jwt.sign({ username: usuario.Username, tipo: usuario.Tipo }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, nome: usuario.Nome, tipo: usuario.Tipo });
};

// Função para cadastro de usuário (apenas admin pode cadastrar)
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, nome, tipo } = req.body;
  if (!username || !password || !nome || !tipo) {
    res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    return;
  }

  // Verifica se já existe
  const existe = await prisma.usuario.findUnique({ where: { Username: username } });
  if (existe) {
    res.status(409).json({ error: 'Usuário já existe.' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.usuario.create({
    data: {
      Username: username,
      Password: hash,
      Nome: nome,
      Tipo: tipo,
      Status: 'A',
      Quant_Acesso: 0
    }
  });
  res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
};
