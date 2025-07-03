import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RegisterUser: React.FC = () => {
  const { token } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('1');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/auth/register', { username, password, nome, tipo }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Usuário cadastrado com sucesso!');
      setUsername(''); setPassword(''); setNome(''); setTipo('1');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao cadastrar usuário.');
    }
  };

  return (
    <div className="card shadow border-0">
      <div className="card-body">
        <h4 className="card-title mb-3 fw-bold text-primary">Cadastrar Novo Usuário</h4>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Usuário</label>
            <input type="text" className="form-control form-control-lg" placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nome</label>
            <input type="text" className="form-control form-control-lg" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Senha</label>
            <input type="password" className="form-control form-control-lg" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tipo</label>
            <select className="form-select form-select-lg" value={tipo} onChange={e => setTipo(e.target.value)} required>
              <option value="1">Usuário Comum</option>
              <option value="0">Administrador</option>
            </select>
          </div>
          <div className="col-12 d-grid gap-2 mt-2">
            <button type="submit" className="btn btn-primary btn-lg">Cadastrar</button>
          </div>
        </form>
        {message && <div className="alert alert-success py-2 mt-3 text-center">{message}</div>}
        {error && <div className="alert alert-danger py-2 mt-3 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default RegisterUser;
