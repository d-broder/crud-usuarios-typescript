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
    <div className="register-user-container">
      <h3>Cadastrar Novo Usuário</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
        <select value={tipo} onChange={e => setTipo(e.target.value)} required>
          <option value="1">Usuário Comum</option>
          <option value="0">Administrador</option>
        </select>
        <button type="submit">Cadastrar</button>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default RegisterUser;
