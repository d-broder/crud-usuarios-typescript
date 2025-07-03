import React, { useState } from 'react';
import api from '../services/api';

const RecoverPasswordPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/auth/recover-password', { username });
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao recuperar senha.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: 420, width: '100%' }}>
        <div className="text-center mb-4">
          <i className="bi bi-shield-lock display-4 text-primary mb-2"></i>
          <h2 className="fw-bold">Recuperar Senha</h2>
          <p className="text-muted mb-0">Informe seu usuário para simular o envio de recuperação de senha.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Usuário</label>
            <input
              id="username"
              type="text"
              className="form-control form-control-lg"
              placeholder="Digite seu usuário"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          {message && <div className="alert alert-success py-2 text-center">{message}</div>}
          {error && <div className="alert alert-danger py-2 text-center">{error}</div>}
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary btn-lg">Recuperar</button>
          </div>
        </form>
        <div className="text-center mt-3">
          <a href="/" className="text-decoration-none">Voltar para o login</a>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
