# ⚡ QUICK DEPLOY - 5 MINUTOS

> Guia rápido para colocar a aplicação no ar em **Railway** e **Vercel**

---

## 🚀 PASSO 1: BACKEND (Railway) - 2 minutos

```bash
# 1. Instalar CLI
npm install -g railway

# 2. Login
railway login

# 3. Ir para backend
cd web/backend

# 4. Inicializar
railway init
# Nome: app-dos-gatos-api

# 5. Adicionar variáveis
railway variables set PORT=3001
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# 6. Deploy
railway up

# 7. Copiar URL (ex: https://app-dos-gatos-api-production.up.railway.app)
```

---

## 🎨 PASSO 2: FRONTEND (Vercel) - 2 minutos

```bash
# 1. Instalar CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Ir para frontend
cd web/frontend

# 4. Deploy
vercel --prod
# Responda: app-dos-gatos-web, ./, npm run build, dist

# 5. Copiar URL (ex: https://app-dos-gatos-web.vercel.app)
```

---

## 🔗 PASSO 3: CONECTAR BACKEND E FRONTEND - 1 minuto

### No Vercel Dashboard:

1. Vá para seu projeto
2. **Settings** → **Environment Variables**
3. Adicione:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://seu-backend-railway.railway.app`
4. Clique em **Save**
5. Redeploy: `vercel --prod`

---

## ✅ PRONTO!

Sua aplicação está no ar! 🎉

- **Frontend:** `https://seu-frontend-vercel.vercel.app`
- **Backend:** `https://seu-backend-railway.railway.app`
- **Login:** `hostadmin.ni` / `admin`

---

## 🆘 PROBLEMAS?

Veja o arquivo completo: **DEPLOY_PRODUCAO.md**
