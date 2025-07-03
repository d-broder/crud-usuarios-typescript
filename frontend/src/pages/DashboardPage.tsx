import React from 'react';
import { useAuth } from '../context/AuthContext';
import RegisterUser from '../components/RegisterUser';
import TarefasPage from './TarefasPage';
import ChangePassword from '../components/ChangePassword';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 col-md-8 mx-auto">
          <div className="card shadow-lg border-0">
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div>
                <h2 className="mb-1 fw-bold">Bem-vindo, {user?.nome}!</h2>
                <span className={`badge ${user?.tipo === '0' ? 'bg-primary' : 'bg-secondary'} fs-6`}>{user?.tipo === '0' ? 'Administrador' : 'Usuário Comum'}</span>
              </div>
              <button className="btn btn-outline-danger btn-lg mt-3 mt-md-0" onClick={logout}>Sair</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4">
        {user?.tipo === '0' && (
          <div className="col-12 col-lg-6 mx-auto">
            <RegisterUser />
          </div>
        )}
        <div className="col-12 col-lg-6 mx-auto">
          <ChangePassword />
        </div>
        <div className="col-12 col-xl-10 mx-auto">
          <TarefasPage />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
