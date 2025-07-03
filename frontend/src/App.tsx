import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RecoverPasswordPage from './pages/RecoverPasswordPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState } from 'react';
import './App.css';

function Main() {
  const { user } = useAuth();
  const [showRecover, setShowRecover] = useState(false);
  if (user) return <div className="app-container"><DashboardPage /></div>;
  return (
    <div className="app-container">
      {showRecover ? (
        <>
          <RecoverPasswordPage />
          <button onClick={() => setShowRecover(false)} className="btn btn-link mt-3">Voltar ao Login</button>
        </>
      ) : (
        <>
          <LoginPage onRecoverPassword={() => setShowRecover(true)} />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

export default App;
