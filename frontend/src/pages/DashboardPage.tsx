import React from 'react';
import { useAuth } from '../context/AuthContext';
import RegisterUser from '../components/RegisterUser';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <h2>Bem-vindo, {user?.nome}!</h2>
      <p>Tipo de usuário: {user?.tipo === '0' ? 'Administrador' : 'Usuário Comum'}</p>
      {user?.tipo === '0' && <RegisterUser />}
      <button onClick={logout}>Sair</button>
      {/* Aqui você pode adicionar as opções de CRUD e outras funcionalidades */}
    </div>
  );
};

export default DashboardPage;
