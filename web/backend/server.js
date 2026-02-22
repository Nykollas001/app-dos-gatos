import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-aqui';

// Middleware
app.use(cors());
app.use(express.json());

// Mock Database
const users = [
  {
    id: 'usr_admin_001',
    username: 'hostadmin.ni',
    email: 'admin@appdosgatos.com',
    password: await bcrypt.hash('admin', 10),
    name: 'Admin Central',
    role: 'CEO',
    color: 'roxo',
    points: 10000,
    createdAt: new Date()
  }
];

const games = [
  { id: 1, name: 'Número Secreto', description: 'Adivinhe o número de 1 a 10', icon: '🔢', players: 1234 },
  { id: 2, name: 'GIF Secreto', description: 'Descubra qual gatinho é', icon: '🎁', players: 856 },
  { id: 3, name: 'Cartas Aleatórias', description: 'Sorteie cartas e ganhe pontos', icon: '🃏', players: 542 }
];

// Rotas de Autenticação
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const colors = ['azul', 'verde', 'rosa', 'roxo', 'amarelo', 'vermelho', 'laranja', 'preto', 'branco'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser = {
      id: `usr_${uuidv4().slice(0, 8)}`,
      username,
      email,
      password: await bcrypt.hash(password, 10),
      name,
      role: 'User',
      color: randomColor,
      points: 0,
      createdAt: new Date()
    };

    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: { id: newUser.id, username: newUser.username, name: newUser.name, color: randomColor },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login bem-sucedido',
      user: { id: user.id, username: user.username, name: user.name, role: user.role, color: user.color, points: user.points },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware de Autenticação
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Rotas de Jogos
app.get('/api/games', (req, res) => {
  res.json(games);
});

app.get('/api/games/:id', (req, res) => {
  const game = games.find(g => g.id === parseInt(req.params.id));
  if (!game) return res.status(404).json({ error: 'Jogo não encontrado' });
  res.json(game);
});

// Rotas de Usuário
app.get('/api/users/:username', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    color: user.color,
    points: user.points,
    createdAt: user.createdAt
  });
});

app.get('/api/profile', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    color: user.color,
    points: user.points,
    email: user.email,
    createdAt: user.createdAt
  });
});

// Rotas de Pontos
app.post('/api/points/add', authenticate, (req, res) => {
  const { points } = req.body;
  const user = users.find(u => u.id === req.user.id);

  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  user.points += points;
  res.json({ message: 'Pontos adicionados', points: user.points });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API está funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
