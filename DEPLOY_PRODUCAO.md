# 🚀 GUIA DE DEPLOY EM PRODUÇÃO

> **App dos Gatos** - Menu de Menus 2.0

---

## 📋 ÍNDICE

1. [Deploy do Backend (Railway)](#deploy-do-backend-railway)
2. [Deploy do Frontend (Vercel)](#deploy-do-frontend-vercel)
3. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
4. [Teste em Produção](#teste-em-produção)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 PRÉ-REQUISITOS

Antes de começar, você precisa ter:

- ✅ Conta no [Railway.app](https://railway.app)
- ✅ Conta no [Vercel.com](https://vercel.com)
- ✅ Git instalado e configurado
- ✅ Node.js 16+ instalado
- ✅ NPM ou PNPM instalado

---

## 🚂 DEPLOY DO BACKEND (RAILWAY)

### Passo 1: Instalar Railway CLI

```bash
npm install -g railway
```

### Passo 2: Fazer Login no Railway

```bash
railway login
```

Isso abrirá o navegador para você fazer login. Autorize a aplicação.

### Passo 3: Navegar para a Pasta do Backend

```bash
cd web/backend
```

### Passo 4: Inicializar Projeto no Railway

```bash
railway init
```

Escolha um nome para seu projeto (ex: `app-dos-gatos-api`)

### Passo 5: Adicionar Variáveis de Ambiente

```bash
railway variables set PORT=3001
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456789
railway variables set CORS_ORIGIN=https://seu-frontend-vercel.vercel.app
```

**⚠️ IMPORTANTE:** Gere uma chave JWT segura!

```bash
# No Linux/Mac:
openssl rand -base64 32

# No Windows (PowerShell):
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Passo 6: Deploy

```bash
railway up
```

O Railway fará o deploy automaticamente. Anote a URL gerada (ex: `https://app-dos-gatos-api-production.up.railway.app`)

### Passo 7: Verificar Deploy

```bash
railway logs
```

Você deve ver algo como:
```
[2026-02-22] Server running on port 3001
```

---

## 🎨 DEPLOY DO FRONTEND (VERCEL)

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Fazer Login no Vercel

```bash
vercel login
```

Escolha seu provedor de autenticação (GitHub, GitLab, etc.)

### Passo 3: Navegar para a Pasta do Frontend

```bash
cd web/frontend
```

### Passo 4: Deploy

```bash
vercel --prod
```

Responda as perguntas:
- **Project name:** `app-dos-gatos-web`
- **Directory:** `./`
- **Build command:** `npm run build`
- **Output directory:** `dist`

### Passo 5: Configurar Variáveis de Ambiente

Após o deploy, vá para o dashboard da Vercel:

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique no seu projeto
3. Vá para **Settings** → **Environment Variables**
4. Adicione:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://seu-backend-railway.railway.app` (URL do Railway)

### Passo 6: Redeploy

Após adicionar as variáveis, redeploy:

```bash
vercel --prod
```

---

## 🔐 CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE

### Backend (Railway)

| Variável | Valor | Exemplo |
|----------|-------|---------|
| `PORT` | Porta do servidor | `3001` |
| `NODE_ENV` | Ambiente | `production` |
| `JWT_SECRET` | Chave para JWT | `base64_string_32_chars` |
| `CORS_ORIGIN` | URLs permitidas | `https://seu-frontend-vercel.vercel.app` |

### Frontend (Vercel)

| Variável | Valor | Exemplo |
|----------|-------|---------|
| `VITE_API_URL` | URL da API | `https://seu-backend-railway.railway.app` |

---

## ✅ TESTE EM PRODUÇÃO

### 1. Testar Login

```bash
curl -X POST https://seu-backend-railway.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"hostadmin.ni","password":"admin"}'
```

Você deve receber um token JWT.

### 2. Testar Frontend

Acesse sua URL da Vercel e faça login com:
- **Usuário:** `hostadmin.ni`
- **Senha:** `admin`

### 3. Testar Console F8 (Mobile)

Se estiver testando a versão mobile:
1. Pressione **F8** para abrir o console
2. Digite: `help`
3. Você deve ver a lista de comandos

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot find module 'express'"

**Solução:** Railway não instalou as dependências. Verifique se `package.json` existe e está correto.

```bash
cd web/backend
npm install
railway up
```

### Erro: "CORS error" no Frontend

**Solução:** Adicione a URL do frontend na variável `CORS_ORIGIN` do Railway:

```bash
railway variables set CORS_ORIGIN=https://seu-frontend-vercel.vercel.app
```

### Erro: "JWT_SECRET not found"

**Solução:** Defina a variável no Railway:

```bash
railway variables set JWT_SECRET=sua_chave_secreta_aqui
```

### Frontend não conecta na API

**Solução:** Verifique se a variável `VITE_API_URL` está correta na Vercel:

1. Vá para Vercel Dashboard
2. Settings → Environment Variables
3. Confirme que `VITE_API_URL` aponta para a URL correta do Railway
4. Redeploy: `vercel --prod`

---

## 📊 MONITORAMENTO

### Railway

```bash
railway logs
```

### Vercel

Acesse [vercel.com/dashboard](https://vercel.com/dashboard) e clique em **Analytics**

---

## 🔄 ATUALIZAÇÕES FUTURAS

Para fazer deploy de novas versões:

### Backend

```bash
cd web/backend
git add .
git commit -m "Atualização"
git push origin main
railway up
```

### Frontend

```bash
cd web/frontend
git add .
git commit -m "Atualização"
git push origin main
vercel --prod
```

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verifique os logs: `railway logs` ou Vercel Dashboard
2. Confirme as variáveis de ambiente
3. Teste localmente primeiro: `npm run dev`
4. Consulte a documentação do Railway e Vercel

---

**Boa sorte com seu deploy! 🚀**
