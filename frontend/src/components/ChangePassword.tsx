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
    <div className="card shadow border-0">
      <div className="card-body">
        <h4 className="card-title mb-3 fw-bold text-primary">Alterar Senha</h4>
        <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Senha atual</label>
            <input type="password" className="form-control form-control-lg" placeholder="Senha atual" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nova senha</label>
            <input type="password" className="form-control form-control-lg" placeholder="Nova senha" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          </div>
          <div className="col-12 d-grid gap-2 mt-2">
            <button type="submit" className="btn btn-warning btn-lg">Alterar Senha</button>
          </div>
        </form>
        {message && <div className="alert alert-success py-2 mt-3 text-center">{message}</div>}
        {error && <div className="alert alert-danger py-2 mt-3 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default ChangePassword;
