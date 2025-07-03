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
    <div className="recover-password-container">
      <h2>Recuperar Senha</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <button type="submit">Recuperar</button>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default RecoverPasswordPage;
