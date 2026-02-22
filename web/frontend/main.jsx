import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', name: '' });
  const [showRegister, setShowRegister] = useState(false);
  const [games, setGames] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchGames();
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token);
    }
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/games`);
      setGames(response.data);
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
    }
  };

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, loginForm);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsLoggedIn(true);
      setLoginForm({ username: '', password: '' });
      showMessage('Login bem-sucedido!', 'success');
    } catch (error) {
      showMessage(error.response?.data?.error || 'Erro ao fazer login', 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, registerForm);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsLoggedIn(true);
      setRegisterForm({ username: '', email: '', password: '', name: '' });
      setShowRegister(false);
      showMessage('Usuário registrado com sucesso!', 'success');
    } catch (error) {
      showMessage(error.response?.data?.error || 'Erro ao registrar', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    showMessage('Logout realizado', 'success');
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container">
      <header>
        <h1>🎮 Menu de Menus 2.0</h1>
        <p className="subtitle">Jogos, Diversão e Pontos!</p>
      </header>

      {message && <div className={messageType}>{message}</div>}

      {!isLoggedIn ? (
        <div className="auth-section">
          {!showRegister ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <h2>🔐 Login</h2>
              <div className="form-group">
                <label>Usuário</label>
                <input
                  type="text"
                  placeholder="hostadmin.ni"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  placeholder="Sua senha"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
              <button type="submit">Entrar</button>
              <button type="button" onClick={() => setShowRegister(true)} style={{ marginTop: '10px', background: 'rgba(139, 0, 255, 0.3)' }}>
                Criar Conta
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <h2>📝 Registrar</h2>
              <div className="form-group">
                <label>Usuário</label>
                <input
                  type="text"
                  placeholder="Seu usuário"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  placeholder="Sua senha"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>
              <button type="submit">Registrar</button>
              <button type="button" onClick={() => setShowRegister(false)} style={{ marginTop: '10px', background: 'rgba(139, 0, 255, 0.3)' }}>
                Voltar ao Login
              </button>
            </form>
          )}
        </div>
      ) : (
        <>
          <div className="profile-section">
            <h2>👤 Perfil: {user?.name}</h2>
            <div className="profile-info">
              <div className="info-item">
                <div className="info-label">ID</div>
                <div className="info-value">{user?.id}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Cargo</div>
                <div className="info-value">{user?.role}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Cor</div>
                <div className="info-value">{user?.color}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Pontos</div>
                <div className="info-value">{user?.points}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>

          <h2 style={{ marginBottom: '20px' }}>🎮 Jogos Disponíveis</h2>
          <div className="games-grid">
            {games.map((game) => (
              <div key={game.id} className="game-card">
                <div className="game-icon">{game.icon}</div>
                <h3>{game.name}</h3>
                <p>{game.description}</p>
                <p style={{ fontSize: '0.9em', color: '#666' }}>👥 {game.players} jogadores</p>
                <button>Jogar Agora</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
