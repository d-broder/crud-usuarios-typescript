import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Criar tarefa
export const createTarefa = async (req: Request, res: Response) => {
  const { titulo, descricao } = req.body;
  const usuarioUsername = (req as any).user?.username;
  if (!titulo) {
    return res.status(400).json({ error: 'Título é obrigatório.' });
  }
  try {
    const tarefa = await prisma.tarefa.create({
      data: { titulo, descricao, usuarioUsername }
    });
    res.status(201).json(tarefa);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

// Listar tarefas com paginação
export const listTarefas = async (req: Request, res: Response) => {
  const usuarioUsername = (req as any).user?.username;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  try {
    const [tarefas, total] = await Promise.all([
      prisma.tarefa.findMany({
        where: { usuarioUsername },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { criadaEm: 'desc' }
      }),
      prisma.tarefa.count({ where: { usuarioUsername } })
    ]);
    res.json({ tarefas, total, page, pageSize });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar tarefas.' });
  }
};

// Editar tarefa
export const updateTarefa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { titulo, descricao } = req.body;
  const usuarioUsername = (req as any).user?.username;
  try {
    const tarefa = await prisma.tarefa.updateMany({
      where: { id: Number(id), usuarioUsername },
      data: { titulo, descricao }
    });
    if (tarefa.count === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.json({ message: 'Tarefa atualizada com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
};

// Excluir tarefa
export const deleteTarefa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const usuarioUsername = (req as any).user?.username;
  try {
    const tarefa = await prisma.tarefa.deleteMany({
      where: { id: Number(id), usuarioUsername }
    });
    if (tarefa.count === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.json({ message: 'Tarefa excluída com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir tarefa.' });
  }
};
