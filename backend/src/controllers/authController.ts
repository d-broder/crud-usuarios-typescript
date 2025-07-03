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
    const novasTentativas = (usuario.Tentativas_Erro || 0) + 1;
    const novoStatus = novasTentativas >= 3 ? 'B' : usuario.Status;
    await prisma.usuario.update({
      where: { Username: username },
      data: {
        Tentativas_Erro: novasTentativas,
        Status: novoStatus
      }
    });
    if (novoStatus === 'B') {
      res.status(403).json({ error: 'Usuário bloqueado por tentativas inválidas.' });
    } else {
      res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }
    return;
  }

  // Zera tentativas de erro e incrementa acesso
  await prisma.usuario.update({
    where: { Username: username },
    data: {
      Tentativas_Erro: 0,
      Quant_Acesso: (usuario.Quant_Acesso || 0) + 1
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
      Quant_Acesso: 0,
      Tentativas_Erro: 0
    }
  });
  res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
};

// Alteração de senha (usuário autenticado)
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const username = (req as any).user?.username;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
    return;
  }
  const usuario = await prisma.usuario.findUnique({ where: { Username: username } });
  if (!usuario) {
    res.status(404).json({ error: 'Usuário não encontrado.' });
    return;
  }
  const senhaCorreta = await bcrypt.compare(oldPassword, usuario.Password);
  if (!senhaCorreta) {
    res.status(401).json({ error: 'Senha atual incorreta.' });
    return;
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.usuario.update({
    where: { Username: username },
    data: { Password: hash }
  });
  res.json({ message: 'Senha alterada com sucesso.' });
};

// Recuperação de senha (simulado)
export const recoverPassword = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.body;
  if (!username) {
    res.status(400).json({ error: 'Usuário é obrigatório.' });
    return;
  }
  const usuario = await prisma.usuario.findUnique({ where: { Username: username } });
  if (!usuario) {
    res.status(404).json({ error: 'Usuário não encontrado.' });
    return;
  }
  // Simula envio de e-mail
  res.json({ message: `Instruções de recuperação de senha enviadas para o e-mail cadastrado de ${usuario.Nome} (simulado).` });
};
