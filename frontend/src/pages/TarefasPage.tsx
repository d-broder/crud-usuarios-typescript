import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Tarefa {
  id: number;
  titulo: string;
  descricao?: string;
  criadaEm: string;
  atualizadaEm: string;
}

const TarefasPage: React.FC = () => {
  const { token } = useAuth();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 5;
  const [error, setError] = useState('');

  const fetchTarefas = async () => {
    try {
      const res = await api.get('/tarefas', {
        params: { page, pageSize },
        headers: { Authorization: `Bearer ${token}` }
      });
      setTarefas(res.data.tarefas);
      setTotal(res.data.total);
    } catch (err: any) {
      setError('Erro ao carregar tarefas.');
    }
  };

  useEffect(() => { fetchTarefas(); }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.put(`/tarefas/${editId}`, { titulo, descricao }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await api.post('/tarefas', { titulo, descricao }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setTitulo(''); setDescricao(''); setEditId(null);
      fetchTarefas();
    } catch {
      setError('Erro ao salvar tarefa.');
    }
  };

  const handleEdit = (tarefa: Tarefa) => {
    setEditId(tarefa.id);
    setTitulo(tarefa.titulo);
    setDescricao(tarefa.descricao || '');
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      await api.delete(`/tarefas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTarefas();
    } catch {
      setError('Erro ao excluir tarefa.');
    }
  };

  return (
    <div className="tarefas-container">
      <h3>Minhas Tarefas</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
        <input type="text" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <button type="submit">{editId ? 'Atualizar' : 'Criar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setTitulo(''); setDescricao(''); }}>Cancelar</button>}
      </form>
      {error && <div className="error">{error}</div>}
      <ul>
        {tarefas.map(tarefa => (
          <li key={tarefa.id}>
            <strong>{tarefa.titulo}</strong> - {tarefa.descricao}
            <button onClick={() => handleEdit(tarefa)}>Editar</button>
            <button onClick={() => handleDelete(tarefa.id)}>Excluir</button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
        <span>Página {page}</span>
        <button onClick={() => setPage(page + 1)} disabled={page * pageSize >= total}>Próxima</button>
      </div>
    </div>
  );
};

export default TarefasPage;
