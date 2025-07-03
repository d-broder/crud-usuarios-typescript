import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function Main() {
  const { user } = useAuth();
  return (
    <div className="app-container">
      {user ? <DashboardPage /> : <LoginPage />}
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
