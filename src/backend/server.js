/**
 * 🐾 App dos Gatos - Backend API
 * Node.js + Express + JWT Authentication
 * Autor: Nykollas Guimarães
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-aqui';

// Middleware
app.use(cors());
app.use(express.json());

// ============= MOCK DATABASE =============
const users = [
  {
    id: 1,
    email: 'admin@appdosgatos.com',
    password: await bcrypt.hash('admin123', 10),
    name: 'Admin'
  }
];

const cats = [
  {
    id: 1,
    name: 'Miau',
    type: 'Preto',
    personality: 'Misterioso',
    description: 'Um gato preto elegante e inteligente',
    imageUrl: '/images/cat-black.jpg'
  },
  {
    id: 2,
    name: 'Brancão',
    type: 'Branco',
    personality: 'Amigável',
    description: 'Um gato branco puro e carinhoso',
    imageUrl: '/images/cat-white.jpg'
  }
];

const favorites = {};
const tokens = new Set();

// ============= MIDDLEWARE DE AUTENTICAÇÃO =============
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    req.user = user;
    next();
  });
};

// ============= ENDPOINTS PÚBLICOS =============

// GET / - Info da API
app.get('/', (req, res) => {
  res.json({
    message: '🐾 App dos Gatos - Backend API v2.0',
    version: '2.0.0',
    author: 'Nykollas Guimarães',
    endpoints: {
      public: ['/api/cats', '/api/stats', '/auth/register', '/auth/login'],
      protected: ['/api/favorites', '/api/ai/generate-description', '/api/chatbot']
    }
  });
});

// GET /api/cats - Lista de gatos
app.get('/api/cats', (req, res) => {
  res.json({
    success: true,
    data: cats,
    count: cats.length
  });
});

// GET /api/stats - Estatísticas
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalCats: cats.length,
      totalUsers: users.length,
      totalFavorites: Object.values(favorites).reduce((sum, arr) => sum + arr.length, 0)
    }
  });
});

// POST /auth/register - Registrar novo usuário
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
    }

    if (users.some(u => u.email === email)) {
      return res.status(409).json({ error: 'Email já registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      user: { id: newUser.id, email: newUser.email, name: newUser.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// POST /auth/login - Fazer login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    tokens.add(token);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// ============= ENDPOINTS PROTEGIDOS =============

// GET /api/favorites - Listar favoritos do usuário
app.get('/api/favorites', authenticateToken, (req, res) => {
  const userFavorites = favorites[req.user.id] || [];
  const favoriteCats = cats.filter(cat => userFavorites.includes(cat.id));

  res.json({
    success: true,
    data: favoriteCats,
    count: favoriteCats.length
  });
});

// POST /api/favorites/:catId - Adicionar aos favoritos
app.post('/api/favorites/:catId', authenticateToken, (req, res) => {
  const catId = parseInt(req.params.catId);
  const cat = cats.find(c => c.id === catId);

  if (!cat) {
    return res.status(404).json({ error: 'Gato não encontrado' });
  }

  if (!favorites[req.user.id]) {
    favorites[req.user.id] = [];
  }

  if (!favorites[req.user.id].includes(catId)) {
    favorites[req.user.id].push(catId);
  }

  res.json({
    success: true,
    message: `${cat.name} adicionado aos favoritos`,
    cat
  });
});

// DELETE /api/favorites/:catId - Remover dos favoritos
app.delete('/api/favorites/:catId', authenticateToken, (req, res) => {
  const catId = parseInt(req.params.catId);

  if (!favorites[req.user.id]) {
    return res.status(404).json({ error: 'Nenhum favorito encontrado' });
  }

  favorites[req.user.id] = favorites[req.user.id].filter(id => id !== catId);

  res.json({
    success: true,
    message: 'Gato removido dos favoritos'
  });
});

// POST /api/ai/generate-description - Gerar descrição com IA
app.post('/api/ai/generate-description', authenticateToken, (req, res) => {
  const { catName, catType } = req.body;

  if (!catName || !catType) {
    return res.status(400).json({ error: 'Nome e tipo do gato são obrigatórios' });
  }

  const descriptions = {
    'Preto': `${catName} é um gato preto misterioso, com olhos brilhantes como diamantes. Conhecido por sua inteligência e agilidade, este felino é o companheiro perfeito para aventuras noturnas.`,
    'Branco': `${catName} é um gato branco puro, suave como algodão. Com uma personalidade amigável e carinhosa, este gatinho traz paz e serenidade para qualquer lar.`
  };

  const description = descriptions[catType] || `${catName} é um gatinho adorável e único!`;

  res.json({
    success: true,
    catName,
    catType,
    description
  });
});

// POST /api/chatbot - Chat com assistente felino
app.post('/api/chatbot', authenticateToken, (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensagem é obrigatória' });
  }

  const responses = [
    'Miau! 🐱 Que legal!',
    'Ronrom... muito interessante! 😸',
    'Miau miau! Concordo totalmente! 🐾',
    'Que legal! Você é um amigo dos gatos! 😻',
    'Miau! Quer brincar comigo? 🎾'
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  res.json({
    success: true,
    userMessage: message,
    botResponse: randomResponse
  });
});

// ============= TRATAMENTO DE ERROS =============

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ============= INICIALIZAR SERVIDOR =============

app.listen(PORT, () => {
  console.log(`🐾 App dos Gatos Backend rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação: GET http://localhost:${PORT}/`);
});

export default app;
