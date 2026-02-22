# 🚀 Guia SUPER SIMPLES: Rodar o Site no Windows

## ⚠️ IMPORTANTE: Resolve os Conflitos Primeiro!

Se você tem conflitos de merge, faça isso:

```powershell
cd C:\Users\nykol\Desktop\New\app-dos-gatos

# Desfazer tudo e voltar ao estado limpo
git reset --hard origin/main

# Puxar a versão mais recente
git pull origin main
```

---

## 🎯 PASSO 1: Abrir PowerShell

1. Clique com botão direito na pasta `app-dos-gatos`
2. Selecione **"Open PowerShell window here"**

Ou:
```powershell
cd C:\Users\nykol\Desktop\New\app-dos-gatos
```

---

## 🔧 PASSO 2: Instalar Dependências

### Terminal 1 - Backend

```powershell
cd web/backend
npm install
```

**Espere terminar** (vai levar ~30 segundos)

### Terminal 2 - Frontend

Abra **outro PowerShell** na mesma pasta:

```powershell
cd web/frontend
npm install
```

**Espere terminar** (vai levar ~1 minuto)

---

## ▶️ PASSO 3: Rodar o Projeto

### Terminal 1 - Backend (Deixe rodando)

```powershell
cd web/backend
npm start
```

**Resultado esperado:**
```
✅ Server running on http://localhost:3001
```

### Terminal 2 - Frontend (Deixe rodando)

```powershell
cd web/frontend
npm run dev
```

**Resultado esperado:**
```
VITE v5.0.0 ready in 234 ms
Local: http://localhost:5173/
```

---

## 🌐 PASSO 4: Acessar o Site

Abra seu navegador e vá para:

**👉 http://localhost:5173**

---

## 🔐 PASSO 5: Fazer Login

Use estas credenciais:

```
Usuário: hostadmin.ni
Senha: admin
```

---

## 📱 PASSO 6: Testar no Celular/Tablet

Abra DevTools (pressione **F12**):

1. Clique no ícone de celular (canto superior esquerdo)
2. Selecione um modelo de celular
3. Veja como fica responsivo!

---

## 🧪 PASSO 7: Testar Funcionalidades

- ✅ Login
- ✅ Criar conta
- ✅ Ver perfil
- ✅ Jogar
- ✅ Logout

---

## 🐛 SE DER ERRO

### Erro: "Port 3001 already in use"

```powershell
# Encontrar processo na porta 3001
netstat -ano | findstr :3001

# Matar o processo (substitua XXXX pelo PID)
taskkill /PID XXXX /F
```

### Erro: "Cannot find module"

```powershell
# Limpar e reinstalar
rm -r node_modules
rm package-lock.json
npm install
```

### Erro: "CORS error"

- Certifique-se de que o **backend está rodando** em http://localhost:3001
- Se não estiver, abra outro terminal e execute: `cd web/backend && npm start`

### Erro: "Connection refused"

- O backend não está rodando
- Abra um novo terminal e execute: `cd web/backend && npm start`

---

## 💡 DICAS

1. **Deixe os 2 terminais abertos** enquanto estiver desenvolvendo
2. **Não feche nenhum dos 2 terminais** ou o site para
3. **Para parar tudo**: Pressione `Ctrl+C` em cada terminal
4. **Para rodar novamente**: Repita o PASSO 3

---

## 📊 Estrutura

```
app-dos-gatos/
├── web/
│   ├── frontend/    ← React (http://localhost:5173)
│   └── backend/     ← Node.js (http://localhost:3001)
├── database/        ← Dados
└── docs/            ← Documentação
```

---

## ✅ CHECKLIST FINAL

- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Repositório clonado
- [ ] Dependências instaladas
- [ ] Backend rodando (http://localhost:3001)
- [ ] Frontend rodando (http://localhost:5173)
- [ ] Login funcionando
- [ ] Responsividade testada

---

**Pronto! Seu site está rodando!** 🎉

Acesse: **http://localhost:5173**

Se tiver dúvidas, leia o arquivo `RODAR_LOCALMENTE.md` para mais detalhes.
