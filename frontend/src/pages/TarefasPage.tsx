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
    <div className="card shadow-lg border-0 mb-4">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-list-task display-6 text-success me-2"></i>
          <h3 className="card-title mb-0 fw-bold">Minhas Tarefas</h3>
        </div>
        <form className="row g-3 align-items-end mb-4" onSubmit={handleSubmit}>
          <div className="col-md-5">
            <label htmlFor="titulo" className="form-label">Título</label>
            <input type="text" id="titulo" className="form-control form-control-lg" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
          </div>
          <div className="col-md-5">
            <label htmlFor="descricao" className="form-label">Descrição</label>
            <input type="text" id="descricao" className="form-control form-control-lg" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
          </div>
          <div className="col-md-2 d-grid gap-2">
            <button type="submit" className={`btn btn-lg ${editId ? 'btn-warning' : 'btn-success'}`}>{editId ? 'Atualizar' : 'Criar'}</button>
            {editId && <button type="button" className="btn btn-secondary btn-lg" onClick={() => { setEditId(null); setTitulo(''); setDescricao(''); }}>Cancelar</button>}
          </div>
        </form>
        {error && <div className="alert alert-danger py-2 text-center">{error}</div>}
        <ul className="list-group mb-3">
          {tarefas.map(tarefa => (
            <li key={tarefa.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
              <div>
                <strong className="fs-5">{tarefa.titulo}</strong>
                {tarefa.descricao && <span className="text-muted ms-2">- {tarefa.descricao}</span>}
              </div>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(tarefa)}>
                  <i className="bi bi-pencil-square"></i> Editar
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(tarefa.id)}>
                  <i className="bi bi-trash"></i> Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
        <nav className="d-flex justify-content-center">
          <ul className="pagination mb-0">
            <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
            </li>
            <li className="page-item disabled"><span className="page-link">Página {page}</span></li>
            <li className={`page-item${page * pageSize >= total ? ' disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page + 1)} disabled={page * pageSize >= total}>Próxima</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TarefasPage;
