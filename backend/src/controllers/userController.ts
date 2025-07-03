import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Listar usuários com paginação (apenas admin)
export async function listUsers(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.usuario.findMany({
      skip,
      take: limit,
      select: { Username: true, Nome: true, Tipo: true, Status: true, Quant_Acesso: true }
    }),
    prisma.usuario.count()
  ]);
  res.json({ users, total, page, pages: Math.ceil(total / limit) });
}

// Buscar usuário por username (apenas admin)
export async function getUser(req: Request, res: Response): Promise<void> {
  const { username } = req.params;
  const user = await prisma.usuario.findUnique({
    where: { Username: username },
    select: { Username: true, Nome: true, Tipo: true, Status: true, Quant_Acesso: true }
  });
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado.' });
    return;
  }
  res.json(user);
}

// Editar usuário (apenas admin)
export async function updateUser(req: Request, res: Response): Promise<void> {
  const { username } = req.params;
  const { nome, tipo, status } = req.body;
  const user = await prisma.usuario.findUnique({ where: { Username: username } });
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado.' });
    return;
  }
  await prisma.usuario.update({
    where: { Username: username },
    data: { Nome: nome, Tipo: tipo, Status: status }
  });
  res.json({ message: 'Usuário atualizado com sucesso.' });
}

// Excluir usuário (apenas admin)
export async function deleteUser(req: Request, res: Response): Promise<void> {
  const { username } = req.params;
  const user = await prisma.usuario.findUnique({ where: { Username: username } });
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado.' });
    return;
  }
  await prisma.usuario.delete({ where: { Username: username } });
  res.json({ message: 'Usuário excluído com sucesso.' });
}

// Alterar senha (usuário autenticado)
export async function changePassword(req: Request, res: Response): Promise<void> {
  const username = (req as any).user.username;
  const { oldPassword, newPassword } = req.body;
  const user = await prisma.usuario.findUnique({ where: { Username: username } });
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado.' });
    return;
  }
  const valid = await bcrypt.compare(oldPassword, user.Password);
  if (!valid) {
    res.status(401).json({ error: 'Senha atual incorreta.' });
    return;
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.usuario.update({ where: { Username: username }, data: { Password: hash } });
  res.json({ message: 'Senha alterada com sucesso.' });
}

// Recuperação de senha (simulada)
export async function recoverPassword(req: Request, res: Response): Promise<void> {
  const { username } = req.body;
  const user = await prisma.usuario.findUnique({ where: { Username: username } });
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado.' });
    return;
  }
  // Simula envio de e-mail
  res.json({ message: `Instruções de recuperação de senha enviadas para o e-mail do usuário ${username} (simulado).` });
}
