import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onRecoverPassword?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onRecoverPassword }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: 420, width: '100%' }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-circle display-4 text-primary mb-2"></i>
          <h2 className="fw-bold">Acesso ao Sistema</h2>
          <p className="text-muted mb-0">Entre com seu usuário e senha para acessar.</p>
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
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Senha</label>
            <input
              id="password"
              type="password"
              className="form-control form-control-lg"
              placeholder="Digite sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger py-2 text-center">{error}</div>}
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary btn-lg">Entrar</button>
          </div>
        </form>
        <div className="text-center mt-3">
          <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={onRecoverPassword}>
            Esqueceu a senha?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
