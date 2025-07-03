import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChangePassword: React.FC = () => {
  const { token, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Senha alterada com sucesso! Faça login novamente.');
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => logout(), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao alterar senha.');
    }
  };

  return (
    <div className="change-password-container">
      <h3>Alterar Senha</h3>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Senha atual" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
        <input type="password" placeholder="Nova senha" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        <button type="submit">Alterar Senha</button>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default ChangePassword;
