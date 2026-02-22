# 🚀 Guia Completo: Rodar o Site Localmente no VS Code

## 📋 Pré-requisitos

- ✅ Node.js 18+ 
- ✅ npm
- ✅ Git
- ✅ VS Code

## 🎯 Passo 1: Clonar e Abrir

```bash
git clone https://github.com/Nykollas001/app-dos-gatos.git
cd app-dos-gatos
code .
```

## 🔧 Passo 2: Instalar Dependências

**Terminal 1 - Backend:**
```bash
cd web/backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd web/frontend
npm install
```

## ▶️ Passo 3: Rodar o Projeto

**Terminal 1 - Backend:**
```bash
cd web/backend
npm start
```
Resultado: `Server running on http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd web/frontend
npm run dev
```
Resultado: `Local: http://localhost:5173/`

## 🌐 Passo 4: Acessar o Site

Abra: **http://localhost:5173**

## 🔐 Passo 5: Fazer Login

- Usuário: `hostadmin.ni`
- Senha: `admin`

## 📱 Passo 6: Testar Responsividade

- **Desktop**: Janela normal (1920x1080)
- **Tablet**: Redimensione para ~1024x768
- **Mobile**: Abra DevTools (F12) e selecione um celular

## 🧪 Passo 7: Testar Funcionalidades

- ✅ Login
- ✅ Registro
- ✅ Perfil
- ✅ Jogos
- ✅ Logout

## 🐛 Troubleshooting

**Erro: "Port 3001 already in use"**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Erro: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Erro: "CORS error"**
- Certifique-se de que o backend está rodando

**Erro: "Connection refused"**
- Abra um novo terminal e execute: `cd web/backend && npm start`

## 📊 Estrutura

```
app-dos-gatos/
├── web/
│   ├── frontend/    ← React (http://localhost:5173)
│   └── backend/     ← Node.js (http://localhost:3001)
├── database/        ← Dados (JSON)
└── docs/            ← Documentação
```

## 🚀 Deploy em Produção

1. **Frontend**: Deploy no Vercel
2. **Backend**: Deploy no Railway
3. Veja `DEPLOY.md` para instruções

## 💡 Dicas

- Use VS Code Extensions: Prettier, Thunder Client
- Debug com DevTools (F12)
- Teste API com Thunder Client

---

**Pronto! Seu site está rodando!** 🎉

Acesse: **http://localhost:5173**

