/**
 * 🎮 Menu de Menus 2.0 - App Responsivo Multi-Dispositivo
 * 
 * SUPORTE A DISPOSITIVOS:
 * ✅ Desktop: Windows (1920x1080, 16:9) - Janelas flutuantes
 * ✅ Laptop: Full HD (1366x768, 16:9)
 * ✅ Tablet: iPad (1024x768, 4:3) ou (1024x1366, 4:3)
 * ✅ Mobile: 9:16 (360x640, 375x812, 390x844, etc)
 * ✅ APK Android: Responsivo para qualquer resolução
 * ✅ Web: Funciona em todos os navegadores
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Hook para detectar o tipo de dispositivo
 * Retorna: 'mobile', 'tablet', 'desktop'
 */
function useDeviceType() {
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Mobile: até 768px de largura
      if (width <= 768) {
        setDeviceType('mobile');
      }
      // Tablet: 768px a 1024px
      else if (width <= 1024) {
        setDeviceType('tablet');
      }
      // Desktop: acima de 1024px
      else {
        setDeviceType('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

/**
 * Hook para detectar a orientação (Portrait/Landscape)
 */
function useOrientation() {
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const handleOrientationChange = () => {
      const angle = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      setOrientation(angle);
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientation;
}

/**
 * Componente Principal - App Responsivo
 */
function App() {
  // ========== ESTADOS ==========
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', name: '' });
  const [showRegister, setShowRegister] = useState(false);
  const [games, setGames] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // ========== HOOKS CUSTOMIZADOS ==========
  const deviceType = useDeviceType();
  const orientation = useOrientation();

  // ========== EFEITOS ==========
  useEffect(() => {
    fetchGames();
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token);
    }
  }, []);

  // ========== FUNÇÕES DE API ==========
  const fetchGames = async () => {
    try {
      const response = await axios.get(\`\${API_URL}/api/games\`);
      setGames(response.data);
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
    }
  };

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get(\`\${API_URL}/api/profile\`, {
        headers: { Authorization: \`Bearer \${token}\` }
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
      const response = await axios.post(\`\${API_URL}/api/auth/login\`, loginForm);
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
      const response = await axios.post(\`\${API_URL}/api/auth/register\`, registerForm);
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

  // ========== ESTILOS RESPONSIVOS ==========
  const getContainerStyle = () => {
    const baseStyle = {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      color: '#fff',
      minHeight: '100vh',
      padding: 0,
      margin: 0,
    };

    // Adaptações por dispositivo
    if (deviceType === 'mobile') {
      return {
        ...baseStyle,
        padding: '10px',
        maxWidth: '100%',
      };
    } else if (deviceType === 'tablet') {
      return {
        ...baseStyle,
        padding: '20px',
        maxWidth: '100%',
      };
    } else {
      // Desktop: Janela estilo Windows
      return {
        ...baseStyle,
        padding: '30px',
        maxWidth: '1920px',
        margin: '0 auto',
      };
    }
  };

  const getHeaderStyle = () => {
    const baseStyle = {
      textAlign: 'center',
      background: 'rgba(139, 0, 255, 0.1)',
      borderRadius: '20px',
      marginBottom: '40px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(139, 0, 255, 0.2)',
    };

    if (deviceType === 'mobile') {
      return {
        ...baseStyle,
        padding: '20px 10px',
        marginBottom: '20px',
      };
    } else if (deviceType === 'tablet') {
      return {
        ...baseStyle,
        padding: '30px 20px',
        marginBottom: '30px',
      };
    } else {
      return {
        ...baseStyle,
        padding: '40px 20px',
        marginBottom: '40px',
      };
    }
  };

  const getH1Style = () => {
    if (deviceType === 'mobile') {
      return {
        fontSize: '1.8em',
        marginBottom: '10px',
        background: 'linear-gradient(135deg, #8B00FF, #0066FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
    } else if (deviceType === 'tablet') {
      return {
        fontSize: '2.2em',
        marginBottom: '10px',
        background: 'linear-gradient(135deg, #8B00FF, #0066FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
    } else {
      return {
        fontSize: '3em',
        marginBottom: '10px',
        background: 'linear-gradient(135deg, #8B00FF, #0066FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
    }
  };

  const getGamesGridStyle = () => {
    if (deviceType === 'mobile') {
      return {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '15px',
        marginBottom: '20px',
      };
    } else if (deviceType === 'tablet') {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '30px',
      };
    } else {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '40px',
      };
    }
  };

  const getAuthFormStyle = () => {
    const baseStyle = {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '15px',
      padding: '30px',
      width: '100%',
    };

    if (deviceType === 'mobile') {
      return {
        ...baseStyle,
        maxWidth: '100%',
        padding: '20px',
      };
    } else if (deviceType === 'tablet') {
      return {
        ...baseStyle,
        maxWidth: '500px',
        padding: '25px',
      };
    } else {
      return {
        ...baseStyle,
        maxWidth: '400px',
        padding: '30px',
      };
    }
  };

  // ========== RENDERIZAÇÃO ==========
  return (
    <div style={getContainerStyle()}>
      {/* HEADER */}
      <header style={getHeaderStyle()}>
        <h1 style={getH1Style()}>🎮 Menu de Menus 2.0</h1>
        <p style={{ fontSize: deviceType === 'mobile' ? '1em' : '1.2em', color: '#aaa' }}>
          Jogos, Diversão e Pontos!
        </p>
      </header>

      {/* MENSAGENS */}
      {message && (
        <div
          style={{
            background: messageType === 'success' ? 'rgba(68, 255, 68, 0.2)' : 'rgba(255, 68, 68, 0.2)',
            border: messageType === 'success' ? '1px solid rgba(68, 255, 68, 0.5)' : '1px solid rgba(255, 68, 68, 0.5)',
            color: messageType === 'success' ? '#88ff88' : '#ff8888',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px',
          }}
        >
          {message}
        </div>
      )}

      {/* AUTENTICAÇÃO */}
      {!isLoggedIn ? (
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
          }}
        >
          <form style={getAuthFormStyle()} onSubmit={showRegister ? handleRegister : handleLogin}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5em' }}>
              {showRegister ? '📝 Registrar' : '🔐 Login'}
            </h2>

            {/* Campo: Usuário */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#aaa' }}>
                Usuário
              </label>
              <input
                type="text"
                placeholder={showRegister ? 'Seu usuário' : 'hostadmin.ni'}
                value={showRegister ? registerForm.username : loginForm.username}
                onChange={(e) =>
                  showRegister
                    ? setRegisterForm({ ...registerForm, username: e.target.value })
                    : setLoginForm({ ...loginForm, username: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1em',
                }}
              />
            </div>

            {/* Campo: Email (apenas registro) */}
            {showRegister && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#aaa' }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1em',
                  }}
                />
              </div>
            )}

            {/* Campo: Nome (apenas registro) */}
            {showRegister && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#aaa' }}>
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1em',
                  }}
                />
              </div>
            )}

            {/* Campo: Senha */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#aaa' }}>
                Senha
              </label>
              <input
                type="password"
                placeholder="Sua senha"
                value={showRegister ? registerForm.password : loginForm.password}
                onChange={(e) =>
                  showRegister
                    ? setRegisterForm({ ...registerForm, password: e.target.value })
                    : setLoginForm({ ...loginForm, password: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1em',
                }}
              />
            </div>

            {/* Botão: Enviar */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #8B00FF, #0066FF)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1em',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              {showRegister ? 'Registrar' : 'Entrar'}
            </button>

            {/* Botão: Alternar Login/Registro */}
            <button
              type="button"
              onClick={() => setShowRegister(!showRegister)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '10px',
                background: 'rgba(139, 0, 255, 0.3)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1em',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {showRegister ? 'Voltar ao Login' : 'Criar Conta'}
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* PERFIL DO USUÁRIO */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: deviceType === 'mobile' ? '20px' : '30px',
              marginBottom: deviceType === 'mobile' ? '20px' : '40px',
            }}
          >
            <h2 style={{ marginBottom: '20px', fontSize: deviceType === 'mobile' ? '1.3em' : '1.5em' }}>
              👤 Perfil: {user?.name}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  deviceType === 'mobile'
                    ? '1fr 1fr'
                    : deviceType === 'tablet'
                    ? 'repeat(2, 1fr)'
                    : 'repeat(4, 1fr)',
                gap: '20px',
                marginTop: '20px',
              }}
            >
              <div style={{ background: 'rgba(139, 0, 255, 0.1)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '5px' }}>ID</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#8B00FF' }}>{user?.id}</div>
              </div>
              <div style={{ background: 'rgba(139, 0, 255, 0.1)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '5px' }}>Cargo</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#8B00FF' }}>{user?.role}</div>
              </div>
              <div style={{ background: 'rgba(139, 0, 255, 0.1)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '5px' }}>Cor</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#8B00FF' }}>{user?.color}</div>
              </div>
              <div style={{ background: 'rgba(139, 0, 255, 0.1)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '5px' }}>Pontos</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#8B00FF' }}>{user?.points}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(135deg, #ff4444, #ff0000)',
                marginTop: '20px',
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1em',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>

          {/* JOGOS */}
          <h2 style={{ marginBottom: '20px', fontSize: deviceType === 'mobile' ? '1.3em' : '1.5em' }}>
            🎮 Jogos Disponíveis
          </h2>
          <div style={getGamesGridStyle()}>
            {games.map((game) => (
              <div
                key={game.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  padding: deviceType === 'mobile' ? '20px' : '30px',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 0, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(139, 0, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: deviceType === 'mobile' ? '2em' : '3em', marginBottom: '15px' }}>
                  {game.icon}
                </div>
                <h3 style={{ fontSize: deviceType === 'mobile' ? '1.1em' : '1.3em', marginBottom: '10px' }}>
                  {game.name}
                </h3>
                <p style={{ color: '#aaa', marginBottom: '15px' }}>{game.description}</p>
                <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
                  👥 {game.players} jogadores
                </p>
                <button
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #8B00FF, #0066FF)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1em',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Jogar Agora
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* INFO DO DISPOSITIVO (Debug) */}
      <div
        style={{
          marginTop: '40px',
          padding: '15px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          fontSize: '0.85em',
          color: '#666',
          textAlign: 'center',
        }}
      >
        📱 {deviceType.toUpperCase()} | {orientation.toUpperCase()} | {window.innerWidth}x{window.innerHeight}
      </div>
    </div>
  );
}

// ========== RENDERIZAÇÃO REACT ==========
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
