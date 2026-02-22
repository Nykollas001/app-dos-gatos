# 🚀 Guia de Deploy - Menu de Menus 2.0

## Frontend (Vercel)

### Passo 1: Preparar o Frontend
```bash
cd web/frontend
npm install
npm run build
```

### Passo 2: Deploy no Vercel
1. Vá para https://vercel.com
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione o repositório `app-dos-gatos`
5. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: URL do backend (ex: https://seu-backend.railway.app)

### Passo 3: Deploy
Clique em "Deploy" e aguarde!

---

## Backend (Railway)

### Passo 1: Preparar o Backend
```bash
cd web/backend
npm install
```

### Passo 2: Deploy no Railway
1. Vá para https://railway.app
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub"
5. Escolha o repositório `app-dos-gatos`
6. Configure:
   - Root Directory: `web/backend`
   - Start Command: `npm start`
   - Environment Variables:
     - `PORT`: 3001
     - `JWT_SECRET`: Seu segredo (gere um aleatório!)
     - `NODE_ENV`: production

### Passo 3: Deploy
Railway fará o deploy automaticamente!

---

## Variáveis de Ambiente

### Frontend (.env)
```
VITE_API_URL=https://seu-backend.railway.app
```

### Backend (.env)
```
PORT=3001
JWT_SECRET=seu-segredo-super-secreto-aqui
NODE_ENV=production
```

---

## URLs Finais

- **Frontend**: https://seu-app.vercel.app
- **Backend**: https://seu-backend.railway.app
- **API**: https://seu-backend.railway.app/api

---

## Teste Local

### Terminal 1 - Backend
```bash
cd web/backend
npm install
npm start
```

### Terminal 2 - Frontend
```bash
cd web/frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

---

## Credenciais de Teste

- **Usuário**: hostadmin.ni
- **Senha**: admin

