# 📚 GUIA COMPLETO - Menu de Menus 2.0
## Documentação Linha por Linha de Cada Commit

---

# 📖 SUMÁRIO

1. [Capítulo 1: App Mobile Base (KivyMD)](#capítulo-1)
2. [Capítulo 2: Backend API (Node.js + Express + JWT)](#capítulo-2)
3. [Capítulo 3: Configurações, Scripts e Testes](#capítulo-3)
4. [Capítulo 4: Docker, Infraestrutura e Documentação](#capítulo-4)
5. [Capítulo 5: Sistema de Login + Banco de Dados + Menus + Jogos](#capítulo-5)

---

# <a name="capítulo-1"></a>
# 📱 CAPÍTULO 1: APP MOBILE BASE (KivyMD)
## Commit: ✨ Commit 1: App Mobile Base (KivyMD)

### O QUE É ESTE CAPÍTULO?
Este capítulo explica como criar uma aplicação mobile moderna usando KivyMD (Material Design). É a base de tudo - a interface que o usuário vê na tela do celular.

---

## 1.1 IMPORTS (IMPORTAÇÕES)

### `import os`
```python
import os
```
**Para quê?** Acessa funções do sistema operacional (Windows, Linux, Mac)
**Exemplo:** Ler arquivos, criar pastas, variáveis de ambiente
**Usado neste projeto?** Sim, para gerenciar caminhos de arquivos

---

### `from datetime import datetime`
```python
from datetime import datetime
```
**Para quê?** Trabalhar com datas e horas
**Exemplo:** `datetime.now()` pega a hora atual
**Usado neste projeto?** Sim! Para adicionar timestamp nos logs do console
```python
timestamp = datetime.now().strftime("%H:%M:%S")
# Resultado: "14:30:45"
```

---

### `from kivy.config import Config`
```python
from kivy.config import Config
```
**Para quê?** Configurar propriedades do Kivy ANTES de iniciar a app
**Importante:** DEVE vir ANTES de outros imports do Kivy!
**Usado neste projeto?** Sim, para definir tamanho da janela

---

### `Config.set('graphics', 'width', '360')`
```python
Config.set('graphics', 'width', '360')
Config.set('graphics', 'height', '640')
Config.set('graphics', 'resizable', '0')
```
**O que cada linha faz?**

| Linha | O Quê | Por Quê |
|-------|-------|--------|
| `width: '360'` | Define largura em 360 pixels | Simula tela de celular |
| `height: '640'` | Define altura em 640 pixels | Proporção mobile padrão |
| `resizable: '0'` | Desabilita redimensionamento | Mantém tamanho fixo |

**Resultado:** A janela abre com tamanho de celular (360x640)

---

### `from kivy.lang import Builder`
```python
from kivy.lang import Builder
```
**Para quê?** Carregar interface definida em KV Language (linguagem de design do Kivy)
**Exemplo:** `Builder.load_string(KV)` carrega a interface visual

---

### `from kivy.core.window import Window`
```python
from kivy.core.window import Window
```
**Para quê?** Controlar a janela (eventos de teclado, tamanho, etc.)
**Usado neste projeto?** Sim! Para capturar tecla F8
```python
Window.bind(on_key_down=self.on_keyboard_down)
```

---

### `from kivy.properties import StringProperty`
```python
from kivy.properties import StringProperty
```
**Para quê?** Criar propriedades que atualizam automaticamente a interface
**Exemplo:** Quando `console_logs` muda, o texto na tela atualiza sozinho
```python
console_logs = StringProperty("")
# Se mudar: self.console_logs = "Novo texto"
# A interface atualiza automaticamente!
```

---

### `from kivy.clock import Clock`
```python
from kivy.clock import Clock
```
**Para quê?** Agendar ações para acontecer depois
**Exemplo:** `Clock.schedule_once(funcao, 0.1)` executa funcao em 0.1 segundos
**Usado neste projeto?** Sim! Para inicializar o console após a tela carregar

---

### `from kivymd.app import MDApp`
```python
from kivymd.app import MDApp
```
**Para quê?** Classe base para aplicações com Material Design
**Diferença:** MDApp é mais bonita que App normal do Kivy
**Usado neste projeto?** Sim! Nossa classe `GatoApp` herda de MDApp

---

### `from kivymd.uix.dialog import MDDialog`
```python
from kivymd.uix.dialog import MDDialog
```
**Para quê?** Criar caixas de diálogo (popups) bonitas
**Exemplo:** Quando clica em um gato, abre um popup com informações

---

### `from kivymd.uix.button import MDRaisedButton`
```python
from kivymd.uix.button import MDRaisedButton
```
**Para quê?** Criar botões com Material Design (com sombra, animações)
**Diferença:** Mais bonito que Button normal

---

## 1.2 KV LANGUAGE (INTERFACE VISUAL)

### O QUE É KV LANGUAGE?
É uma linguagem especial do Kivy para definir a interface visual. É como HTML, mas para Kivy.

```python
KV = '''
MDScreen:
    name: "main"
    md_bg_color: app.theme_cls.bg_normal
```

**O que cada linha faz?**
- `MDScreen:` → Cria uma tela
- `name: "main"` → Nome da tela (para referência)
- `md_bg_color:` → Cor de fundo (usa cor do tema)

---

### BARRA SUPERIOR (Header)

```python
MDBoxLayout:
    orientation: 'horizontal'
    size_hint_y: None
    height: "60dp"
    pos_hint: {"top": 1}
    padding: "10dp"
```

**Explicação:**
- `MDBoxLayout` → Container que organiza elementos
- `orientation: 'horizontal'` → Elementos lado a lado
- `size_hint_y: None` → Altura fixa (não automática)
- `height: "60dp"` → Altura de 60 pixels
- `pos_hint: {"top": 1}` → Posiciona no topo
- `padding: "10dp"` → Espaço interno de 10 pixels

---

### ÍCONE DE TEMA

```python
MDIconButton:
    icon: "weather-night" if app.theme_cls.theme_style == "Light" else "weather-sunny"
    on_release: app.toggle_theme()
```

**O que faz?**
- `icon:` → Define qual ícone mostrar
- `if app.theme_cls.theme_style == "Light"` → Se tema é claro
- `"weather-night"` → Mostra ícone de lua
- `else` → Senão (tema escuro)
- `"weather-sunny"` → Mostra ícone de sol
- `on_release: app.toggle_theme()` → Ao clicar, chama função toggle_theme()

**Resultado:** Botão que muda de lua para sol conforme o tema

---

### CONSOLE F8 (Terminal)

```python
MDBoxLayout:
    id: dev_console
    orientation: 'vertical'
    padding: "10dp"
    size_hint_y: 0.4
    pos_hint: {"top": 1}
    opacity: 0
    disabled: True
```

**Explicação:**
- `id: dev_console` → Nome para referenciar depois
- `opacity: 0` → Invisível (transparência 0)
- `disabled: True` → Desativado (não responde a cliques)
- `size_hint_y: 0.4` → Ocupa 40% da altura

**Resultado:** Console escondido, aparece ao pressionar F8

---

## 1.3 CLASSE GATOAPP

### DEFINIÇÃO DA CLASSE

```python
class GatoApp(MDApp):
    console_logs = StringProperty("")
```

**O que significa?**
- `class GatoApp` → Define uma classe chamada GatoApp
- `(MDApp)` → Herda de MDApp (Material Design App)
- `console_logs = StringProperty("")` → Propriedade que armazena logs

**Por que herdar de MDApp?**
- MDApp gerencia o ciclo de vida da app
- Fornece métodos como `build()`, `run()`
- Integra Material Design automaticamente

---

### MÉTODO BUILD()

```python
def build(self):
    self.theme_cls.primary_palette = "DeepPurple"
    self.theme_cls.theme_style = "Light"
    self.dialog = None
    
    screen = Builder.load_string(KV)
    Window.bind(on_key_down=self.on_keyboard_down)
    Clock.schedule_once(self._init_console, 0.1)
    
    return screen
```

**O que cada linha faz?**

| Linha | O Quê | Por Quê |
|-------|-------|--------|
| `self.theme_cls.primary_palette = "DeepPurple"` | Define cor primária como roxo | Tema visual |
| `self.theme_cls.theme_style = "Light"` | Inicia em modo claro | Preferência do usuário |
| `self.dialog = None` | Inicializa popup como vazio | Evita erro se tentar fechar |
| `screen = Builder.load_string(KV)` | Carrega interface KV | Mostra a tela |
| `Window.bind(on_key_down=...)` | Registra evento de teclado | Captura F8 |
| `Clock.schedule_once(...)` | Agenda inicialização | Espera tela carregar |
| `return screen` | Retorna a tela | Kivy mostra na janela |

---

### MÉTODO TOGGLE_THEME()

```python
def toggle_theme(self):
    old_theme = self.theme_cls.theme_style
    new_theme = "Dark" if old_theme == "Light" else "Light"
    self.theme_cls.theme_style = new_theme
    self.add_log(f"🎨 Tema alterado para: {new_theme}")
```

**Passo a passo:**
1. `old_theme = ...` → Pega tema atual
2. `new_theme = "Dark" if ... else "Light"` → Se claro, muda para escuro; se escuro, muda para claro
3. `self.theme_cls.theme_style = new_theme` → Aplica novo tema
4. `self.add_log(...)` → Registra no console

---

### MÉTODO ADD_LOG()

```python
def add_log(self, message):
    timestamp = datetime.now().strftime("%H:%M:%S")
    self.console_logs += f"[{timestamp}] {message}\n"
```

**O que faz?**
1. `datetime.now()` → Pega hora atual
2. `.strftime("%H:%M:%S")` → Formata como "14:30:45"
3. `self.console_logs +=` → Adiciona ao final (não substitui)
4. `f"[{timestamp}] {message}\n"` → Formata com colchetes e quebra de linha

**Exemplo:**
```
[14:30:45] ✅ App Iniciado com sucesso!
[14:30:46] 🎨 Tema: Claro
```

---

### MÉTODO ON_KEYBOARD_DOWN()

```python
def on_keyboard_down(self, window, key, scancode, codepoint, modifier):
    if key == 289:  # F8
        if self.root and 'dev_console' in self.root.ids:
            console = self.root.ids.dev_console
            if console.disabled:
                console.disabled = False
                console.opacity = 1
                self.root.ids.console_input.focus = True
                self.add_log("✅ Console Aberto")
            else:
                console.disabled = True
                console.opacity = 0
                self.add_log("❌ Console Fechado")
            return True
    return False
```

**Explicação linha por linha:**

| Linha | O Quê | Por Quê |
|-------|-------|--------|
| `if key == 289:` | Verifica se é F8 | 289 é código da tecla F8 |
| `if self.root and 'dev_console' in self.root.ids:` | Verifica se console existe | Evita erro se não existir |
| `console = self.root.ids.dev_console` | Pega referência do console | Para manipular |
| `if console.disabled:` | Se console está desativado | Quer abrir |
| `console.disabled = False` | Ativa o console | Permite interação |
| `console.opacity = 1` | Torna visível | Opacidade 100% |
| `self.root.ids.console_input.focus = True` | Foca no campo de input | Cursor pronto para digitar |
| `return True` | Retorna True | Indica que processou a tecla |

---

### MÉTODO PROCESS_COMMAND()

```python
def process_command(self, command):
    cmd = command.strip().lower()
    self.add_log(f"> {cmd}")
    
    if cmd == "/quit":
        self.stop()
    elif cmd == "/clear":
        self.console_logs = ""
    else:
        self.add_log("Erro: Comando desconhecido")
```

**O que cada comando faz?**

| Comando | Ação | Código |
|---------|------|--------|
| `/quit` | Encerra app | `self.stop()` |
| `/clear` | Limpa console | `self.console_logs = ""` |
| Outro | Mostra erro | `self.add_log("Erro...")` |

---

## 1.4 INICIALIZAÇÃO DA APP

```python
if __name__ == "__main__":
    GatoApp().run()
```

**O que significa?**
- `if __name__ == "__main__":` → Executa só se for arquivo principal
- `GatoApp()` → Cria instância da app
- `.run()` → Inicia a app (abre janela, mostra interface)

---

## 1.5 FLUXO COMPLETO

```
1. Imports (carrega bibliotecas)
   ↓
2. Config.set() (configura tamanho)
   ↓
3. KV = ''' ''' (define interface)
   ↓
4. class GatoApp (define app)
   ↓
5. def build() (inicializa)
   ↓
6. GatoApp().run() (executa)
   ↓
7. Janela abre com interface
   ↓
8. Usuário interage
   ↓
9. Eventos disparam funções
   ↓
10. App encerra
```

---

# <a name="capítulo-2"></a>
# 🔌 CAPÍTULO 2: BACKEND API (Node.js + Express + JWT)
## Commit: 🔌 Commit 2: Backend API (Node.js + Express + JWT)

### O QUE É ESTE CAPÍTULO?
Backend é o "servidor" que fica rodando no computador. Ele recebe requisições do app mobile/web e responde com dados. É como um garçom que recebe pedidos e traz a comida.

---

## 2.1 IMPORTS (IMPORTAÇÕES)

### `import express from 'express'`
```javascript
import express from 'express';
```
**Para quê?** Framework web para Node.js
**O que faz?** Cria servidor HTTP que recebe requisições
**Exemplo:** `app.get('/api/cats')` → Endpoint que retorna gatos

---

### `import jwt from 'jsonwebtoken'`
```javascript
import jwt from 'jsonwebtoken';
```
**Para quê?** Criar tokens JWT (autenticação)
**O que é JWT?** Token seguro que prova que usuário está logado
**Exemplo:** Usuário faz login → Recebe token → Usa token para acessar dados protegidos

---

### `import bcrypt from 'bcryptjs'`
```javascript
import bcrypt from 'bcryptjs';
```
**Para quê?** Hash de senhas (criptografia)
**Por quê?** Nunca guardar senha em texto plano!
**Exemplo:**
```javascript
senha = "admin123"
hash = bcrypt.hash(senha) // Resultado: $2b$10$examplehash
// Impossível descobrir a senha original!
```

---

### `import cors from 'cors'`
```javascript
import cors from 'cors';
```
**Para quê?** Permitir requisições de outros domínios
**Exemplo:** App mobile (localhost:5173) pode acessar backend (localhost:3000)
**Sem CORS:** Erro de segurança!

---

## 2.2 CONFIGURAÇÃO DO SERVIDOR

### `const app = express()`
```javascript
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-aqui';
```

**O que cada linha faz?**

| Linha | O Quê | Por Quê |
|-------|-------|--------|
| `const app = express()` | Cria app Express | Base do servidor |
| `PORT = process.env.PORT \|\| 3000` | Porta 3000 (ou variável de ambiente) | Onde servidor escuta |
| `JWT_SECRET = ...` | Chave secreta para tokens | Assina tokens JWT |

---

### MIDDLEWARE

```javascript
app.use(cors());
app.use(express.json());
```

**O que é Middleware?** Função que processa requisições antes de chegar no endpoint

| Middleware | O Quê | Por Quê |
|-----------|-------|--------|
| `cors()` | Permite requisições de outros domínios | Segurança |
| `express.json()` | Converte JSON para objeto JavaScript | Processa dados |

---

## 2.3 MOCK DATABASE

```javascript
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
  }
];
```

**O que é Mock Database?** Dados em memória (não é banco de dados real)
**Por quê?** Mais rápido para testes, sem precisar de PostgreSQL

**Estrutura:**
- `users` → Lista de usuários
- `cats` → Lista de gatos
- Cada um tem propriedades (id, name, etc.)

---

## 2.4 MIDDLEWARE DE AUTENTICAÇÃO

```javascript
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
```

**Passo a passo:**

1. `const authHeader = req.headers['authorization']`
   - Pega header Authorization da requisição
   - Formato: "Bearer token123"

2. `const token = authHeader && authHeader.split(' ')[1]`
   - Divide "Bearer token123" em ["Bearer", "token123"]
   - Pega índice [1] (o token)

3. `if (!token) return res.status(401)`
   - Se não tem token, retorna erro 401 (não autorizado)

4. `jwt.verify(token, JWT_SECRET, ...)`
   - Verifica se token é válido
   - Usa JWT_SECRET para validar assinatura

5. `req.user = user`
   - Adiciona dados do usuário à requisição
   - Próxima função pode acessar `req.user`

6. `next()`
   - Passa para próxima função

---

## 2.5 ENDPOINTS PÚBLICOS

### GET / (Info da API)

```javascript
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
```

**O que faz?**
- `app.get('/', ...)` → Rota GET na raiz
- `(req, res) => {}` → Função que processa requisição
- `res.json({...})` → Retorna JSON com informações

**Resultado:** Quando acessa `http://localhost:3000/`, retorna info da API

---

### GET /api/cats (Lista de Gatos)

```javascript
app.get('/api/cats', (req, res) => {
  res.json({
    success: true,
    data: cats,
    count: cats.length
  });
});
```

**O que faz?**
- Retorna lista de gatos
- `success: true` → Indica sucesso
- `data: cats` → Array de gatos
- `count: cats.length` → Quantidade de gatos

**Resultado:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Miau",
      "type": "Preto"
    }
  ],
  "count": 1
}
```

---

### POST /auth/login (Fazer Login)

```javascript
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
```

**Passo a passo:**

1. `const { email, password } = req.body`
   - Extrai email e senha da requisição

2. `if (!email || !password) return res.status(400)`
   - Se falta algo, retorna erro 400 (requisição inválida)

3. `const user = users.find(u => u.email === email)`
   - Procura usuário com esse email
   - `find()` retorna primeiro que encontra

4. `if (!user) return res.status(401)`
   - Se não encontrou, retorna erro 401 (não autorizado)

5. `await bcrypt.compare(password, user.password)`
   - Compara senha digitada com hash armazenado
   - `await` espera resultado (operação assíncrona)

6. `jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn: '24h' })`
   - Cria token JWT
   - Válido por 24 horas
   - Contém id, email, name do usuário

7. `res.json({ success: true, token, user })`
   - Retorna token para cliente
   - Cliente armazena token
   - Usa token em próximas requisições

---

## 2.6 ENDPOINTS PROTEGIDOS

### GET /api/favorites (Listar Favoritos)

```javascript
app.get('/api/favorites', authenticateToken, (req, res) => {
  const userFavorites = favorites[req.user.id] || [];
  const favoriteCats = cats.filter(cat => userFavorites.includes(cat.id));

  res.json({
    success: true,
    data: favoriteCats,
    count: favoriteCats.length
  });
});
```

**O que faz?**

1. `authenticateToken` → Middleware que valida token
2. `favorites[req.user.id]` → Pega favoritos do usuário
3. `cats.filter(...)` → Filtra gatos que estão nos favoritos
4. Retorna gatos favoritos

**Fluxo:**
```
Cliente envia: GET /api/favorites
Header: Authorization: Bearer token123
↓
authenticateToken valida token
↓
Se válido: req.user = { id: 1, email: '...', name: '...' }
↓
Retorna favoritos do usuário 1
```

---

### POST /api/favorites/:catId (Adicionar Favorito)

```javascript
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
```

**Passo a passo:**

1. `const catId = parseInt(req.params.catId)`
   - Extrai ID do gato da URL
   - Exemplo: `/api/favorites/1` → catId = 1

2. `const cat = cats.find(c => c.id === catId)`
   - Procura gato com esse ID

3. `if (!cat) return res.status(404)`
   - Se não encontrou, retorna erro 404 (não encontrado)

4. `if (!favorites[req.user.id]) favorites[req.user.id] = []`
   - Se usuário não tem favoritos, cria array vazio

5. `if (!favorites[req.user.id].includes(catId))`
   - Se gato não está nos favoritos

6. `favorites[req.user.id].push(catId)`
   - Adiciona gato aos favoritos

---

## 2.7 INICIALIZAÇÃO DO SERVIDOR

```javascript
app.listen(PORT, () => {
  console.log(`🐾 App dos Gatos Backend rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação: GET http://localhost:${PORT}/`);
});
```

**O que faz?**
- `app.listen(PORT, ...)` → Inicia servidor na porta 3000
- Callback executa quando servidor está pronto
- Mostra mensagem no console

**Resultado:**
```
🐾 App dos Gatos Backend rodando em http://localhost:3000
📚 Documentação: GET http://localhost:3000/
```

---

## 2.8 FLUXO COMPLETO DE LOGIN

```
1. Cliente envia POST /auth/login
   { email: 'admin@appdosgatos.com', password: 'admin123' }
   ↓
2. Servidor valida email
   ↓
3. Servidor compara senha com bcrypt
   ↓
4. Se correto: Cria token JWT
   ↓
5. Retorna token ao cliente
   ↓
6. Cliente armazena token
   ↓
7. Próximas requisições: Header Authorization: Bearer token
   ↓
8. authenticateToken valida token
   ↓
9. Se válido: Processa requisição
   ↓
10. Se inválido: Retorna erro 403
```

---

# <a name="capítulo-3"></a>
# ⚙️ CAPÍTULO 3: CONFIGURAÇÕES, SCRIPTS E TESTES
## Commit: ⚙️ Commit 3: Configurações, Scripts e Testes

### O QUE É ESTE CAPÍTULO?
Configurações e scripts automatizam tarefas. Testes garantem que código funciona.

---

## 3.1 BUILDOZER.SPEC (GERAR APK)

```ini
[app]
title = App dos Gatos
package.name = appdosgatos
package.domain = org.appdosgatos
source.dir = .
source.include_exts = py,png,jpg,kv,atlas
version = 2.0.0
requirements = python3,kivy,kivymd
orientation = portrait
fullscreen = 0
android.permissions = INTERNET
android.api = 31
android.minapi = 21
android.ndk = 25b
android.accept_sdk_license = True
```

**O que cada linha faz?**

| Linha | O Quê | Por Quê |
|-------|-------|--------|
| `title = App dos Gatos` | Nome do app | Aparece na tela |
| `package.name = appdosgatos` | Nome do pacote | Identificador único |
| `package.domain = org.appdosgatos` | Domínio reverso | Padrão Android |
| `source.dir = .` | Diretório do código | Onde está main.py |
| `version = 2.0.0` | Versão do app | Para updates |
| `requirements = python3,kivy,kivymd` | Dependências | O que precisa |
| `orientation = portrait` | Orientação | Vertical (celular) |
| `android.permissions = INTERNET` | Permissões | Acesso à internet |
| `android.api = 31` | API Android | Versão alvo |
| `android.minapi = 21` | API mínima | Compatibilidade |

---

## 3.2 SETUP.SH (INSTALAÇÃO AUTOMÁTICA)

```bash
#!/bin/bash
echo "🐾 Setup App dos Gatos v2.0"
pip install "kivy[base]" kivymd
cd backend && npm install && cd ..
echo "✅ Setup concluído!"
```

**O que faz?**

1. `#!/bin/bash` → Indica que é script bash
2. `echo "..."` → Imprime mensagem
3. `pip install "kivy[base]" kivymd` → Instala bibliotecas Python
4. `cd backend && npm install && cd ..` → Instala dependências Node.js
5. `&&` → Executa próximo comando só se anterior funcionou

**Como usar:**
```bash
./setup.sh
```

---

## 3.3 TEST_MAIN.PY (TESTES UNITÁRIOS)

```python
import unittest
from datetime import datetime

class TestGatoApp(unittest.TestCase):
    def test_timestamp_format(self):
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.assertRegex(timestamp, r'\d{2}:\d{2}:\d{2}')
    
    def test_cat_names(self):
        cats = ["🐈‍⬛ Gato Preto", "🐈 Gato Branco"]
        self.assertEqual(len(cats), 2)

if __name__ == '__main__':
    unittest.main()
```

**O que é teste unitário?** Testa uma pequena parte do código

**Explicação:**

1. `class TestGatoApp(unittest.TestCase):`
   - Define classe de testes
   - Herda de TestCase

2. `def test_timestamp_format(self):`
   - Método de teste (começa com "test_")

3. `self.assertRegex(timestamp, r'\d{2}:\d{2}:\d{2}')`
   - Valida se timestamp tem formato "HH:MM:SS"
   - `\d{2}` = 2 dígitos

4. `self.assertEqual(len(cats), 2)`
   - Valida se lista tem 2 gatos

**Como rodar:**
```bash
python -m pytest test_main.py -v
```

---

# <a name="capítulo-4"></a>
# 🐳 CAPÍTULO 4: DOCKER, INFRAESTRUTURA E DOCUMENTAÇÃO
## Commit: 🐳 Commit 4: Docker, Infraestrutura e Documentação Completa

### O QUE É ESTE CAPÍTULO?
Docker empacota a app em um container (caixa isolada). Facilita deploy e evita problemas de "funciona na minha máquina".

---

## 4.1 DOCKERFILE

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

EXPOSE 3000

CMD ["npm", "start"]
```

**Passo a passo:**

| Linha | O Quê | Por Quê |
|-------|-------|--------|
| `FROM node:18-alpine` | Imagem base | Node.js 18 em Alpine (pequeno) |
| `WORKDIR /app` | Diretório de trabalho | Onde código fica |
| `COPY backend/package*.json ./` | Copia package.json | Lista de dependências |
| `RUN npm install` | Instala dependências | npm install |
| `COPY backend/ .` | Copia código | Copia server.js e outros |
| `EXPOSE 3000` | Expõe porta | Permite acesso à porta 3000 |
| `CMD ["npm", "start"]` | Comando padrão | O que executar ao iniciar |

---

## 4.2 DOCKER-COMPOSE.YML

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ..
      dockerfile: infra/Dockerfile.backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

**O que faz?**

- `version: '3.8'` → Versão do Docker Compose
- `services:` → Lista de serviços
- `backend:` → Nome do serviço
- `build:` → Como construir imagem
- `ports: "3000:3000"` → Mapeia porta 3000 local → 3000 container
- `environment:` → Variáveis de ambiente
- `restart: unless-stopped` → Reinicia se falhar

**Como usar:**
```bash
docker-compose up
```

---

# <a name="capítulo-5"></a>
# 🔐 CAPÍTULO 5: SISTEMA DE LOGIN + BANCO DE DADOS + MENUS + JOGOS
## Commit: 🔐 Commit 5: Sistema de Login + Banco de Dados + Menus + Jogos

### O QUE É ESTE CAPÍTULO?
Agora a app tem login real, banco de dados de usuários, menus interativos e jogos!

---

## 5.1 BANCO DE DADOS (JSON)

### DATABASE/USERS.JSON

```json
{
  "users": [
    {
      "id": "usr_admin_001",
      "ip": "127.0.0.1",
      "username": "hostadmin.ni",
      "password": "$2b$10$examplehash",
      "name": "Admin Central",
      "color": "roxo",
      "colorCode": "#8B00FF",
      "points": 10000,
      "role": "CEO",
      "createdAt": "2026-02-22T00:00:00Z",
      "lastLogin": "2026-02-22T00:00:00Z"
    }
  ]
}
```

**O que cada campo significa?**

| Campo | O Quê | Exemplo |
|-------|-------|---------|
| `id` | ID único | "usr_admin_001" |
| `ip` | IP do usuário | "127.0.0.1" |
| `username` | Nome de usuário | "hostadmin.ni" |
| `password` | Senha criptografada | "$2b$10$..." |
| `name` | Nome completo | "Admin Central" |
| `color` | Cor atribuída | "roxo" |
| `colorCode` | Código hexadecimal | "#8B00FF" |
| `points` | Pontos/moedas | 10000 |
| `role` | Tipo de usuário | "CEO", "Admin", "Mod", "User" |
| `createdAt` | Data de criação | ISO 8601 |
| `lastLogin` | Último login | ISO 8601 |

---

### DATABASE/COLORS.JSON

```json
{
  "colors": [
    {"id": 1, "name": "azul", "hex": "#0066FF", "rgb": "0, 102, 255"},
    {"id": 2, "name": "verde", "hex": "#00CC00", "rgb": "0, 204, 0"},
    {"id": 3, "name": "rosa", "hex": "#FF69B4", "rgb": "255, 105, 180"},
    {"id": 4, "name": "roxo", "hex": "#8B00FF", "rgb": "139, 0, 255"},
    {"id": 5, "name": "amarelo", "hex": "#FFFF00", "rgb": "255, 255, 0"},
    {"id": 6, "name": "vermelho", "hex": "#FF0000", "rgb": "255, 0, 0"},
    {"id": 7, "name": "laranja", "hex": "#FF8800", "rgb": "255, 136, 0"},
    {"id": 8, "name": "preto", "hex": "#000000", "rgb": "0, 0, 0"},
    {"id": 9, "name": "branco", "hex": "#FFFFFF", "rgb": "255, 255, 255"}
  ]
}
```

**O que é?** 9 cores que cada usuário pode receber aleatoriamente

**Probabilidade:** 1/9 para cada cor

---

## 5.2 SISTEMA DE LOGIN

### FUNÇÃO SHOW_LOGIN_SCREEN()

```python
def show_login_screen(self):
    content = MDBoxLayout(orientation='vertical', spacing='15dp', padding='20dp')
    
    username_field = MDTextField(hint_text="Usuário", size_hint_y=None, height='50dp')
    password_field = MDTextField(hint_text="Senha", password=True, size_hint_y=None, height='50dp')
    
    def login_action(instance):
        username = username_field.text
        password = password_field.text
        
        if username and password:
            self.login_user(username, password)
            self.dialog.dismiss()
        else:
            self.add_log("❌ Preencha todos os campos")
    
    content.add_widget(username_field)
    content.add_widget(password_field)
    
    buttons_layout = MDBoxLayout(size_hint_y=None, height='50dp', spacing='10dp')
    buttons_layout.add_widget(MDRaisedButton(text="LOGIN", on_release=login_action, size_hint_x=0.5))
    buttons_layout.add_widget(MDRaisedButton(text="REGISTRAR", on_release=register_action, size_hint_x=0.5))
    
    content.add_widget(buttons_layout)
    
    self.dialog = MDDialog(
        title="🔐 Login",
        type="custom",
        content_cls=content,
        size_hint=(0.9, 0.6)
    )
    self.dialog.open()
```

**Passo a passo:**

1. `content = MDBoxLayout(...)` → Container para elementos
2. `username_field = MDTextField(...)` → Campo de texto para usuário
3. `password_field = MDTextField(password=True, ...)` → Campo de senha (oculta caracteres)
4. `def login_action(instance):` → Função chamada ao clicar LOGIN
5. `username = username_field.text` → Pega texto digitado
6. `if username and password:` → Valida se preencheu
7. `self.login_user(username, password)` → Chama função de login
8. `self.dialog.open()` → Mostra popup

---

### FUNÇÃO LOGIN_USER()

```python
def login_user(self, username, password):
    if username == "hostadmin.ni" and password == "admin":
        self.current_user_name = "Admin Central"
        self.current_user_id = "usr_admin_001"
        self.current_user_color = "roxo"
        self.add_log(f"✅ Login bem-sucedido: {username}")
    else:
        self.add_log(f"❌ Credenciais inválidas")
```

**O que faz?**

1. Valida usuário e senha
2. Se correto:
   - Define nome do usuário
   - Define ID do usuário
   - Define cor do usuário
   - Registra no log
3. Se incorreto:
   - Mostra erro

---

### FUNÇÃO REGISTER_USER()

```python
def register_user(self, username, password, name):
    random_color_id = random.randint(1, 9)
    colors = ["azul", "verde", "rosa", "roxo", "amarelo", "vermelho", "laranja", "preto", "branco"]
    color = colors[random_color_id - 1]
    
    self.current_user_name = name
    self.current_user_id = f"usr_{random.randint(1000, 9999)}"
    self.current_user_color = color
    
    self.add_log(f"✅ Usuário registrado: {name}")
    self.add_log(f"🎨 Cor atribuída: {color}")
```

**Passo a passo:**

1. `random_color_id = random.randint(1, 9)` → Sorteia número de 1 a 9
2. `colors = [...]` → Lista de 9 cores
3. `color = colors[random_color_id - 1]` → Pega cor correspondente
   - Se random_color_id = 1 → colors[0] = "azul"
   - Se random_color_id = 2 → colors[1] = "verde"
   - Etc.
4. Define dados do usuário
5. Registra no log

**Probabilidade:**
- Cada cor tem 1/9 de chance (11.11%)

---

## 5.3 MENUS

### FUNÇÃO SHOW_GAMES_MENU()

```python
def show_games_menu(self):
    content = MDBoxLayout(orientation='vertical', spacing='10dp', padding='15dp')
    
    content.add_widget(MDRaisedButton(
        text="🔢 Número Secreto (1-10)",
        on_release=lambda x: self.start_number_game(),
        size_hint_y=None,
        height='50dp'
    ))
    
    content.add_widget(MDRaisedButton(
        text="🎁 GIF Secreto de Gatos",
        on_release=lambda x: self.start_gif_game(),
        size_hint_y=None,
        height='50dp'
    ))
    
    content.add_widget(MDRaisedButton(
        text="🃏 Cartas Aleatórias",
        on_release=lambda x: self.start_cards_game(),
        size_hint_y=None,
        height='50dp'
    ))
    
    self.dialog = MDDialog(
        title="🎮 Menu de Jogos",
        type="custom",
        content_cls=content,
        size_hint=(0.9, 0.6)
    )
    self.dialog.open()
```

**O que faz?**
- Cria popup com 3 botões de jogos
- Cada botão chama uma função diferente
- `lambda x:` → Função anônima que chama função

---

## 5.4 JOGOS

### JOGO DO NÚMERO SECRETO

```python
def start_number_game(self):
    self.secret_number = random.randint(1, 10)
    self.guesses = 0
    self.dialog.dismiss()
    self.add_log("🎮 Jogo iniciado: Adivinhe o número de 1 a 10!")
    
    content = MDBoxLayout(orientation='vertical', spacing='10dp', padding='15dp')
    guess_field = MDTextField(hint_text="Digite um número", input_filter='int', size_hint_y=None, height='50dp')
    
    def check_guess(instance):
        try:
            guess = int(guess_field.text)
            self.guesses += 1
            
            if guess == self.secret_number:
                self.add_log(f"🎉 Acertou em {self.guesses} tentativa(s)! Ganhou 100 pontos!")
                self.dialog.dismiss()
            elif guess < self.secret_number:
                self.add_log(f"📈 Muito baixo! Tente um número maior.")
            else:
                self.add_log(f"📉 Muito alto! Tente um número menor.")
            
            guess_field.text = ""
        except:
            self.add_log("❌ Digite um número válido")
    
    content.add_widget(guess_field)
    content.add_widget(MDRaisedButton(text="CHUTAR", on_release=check_guess, size_hint_y=None, height='50dp'))
    
    self.dialog = MDDialog(
        title="🔢 Número Secreto",
        type="custom",
        content_cls=content,
        size_hint=(0.9, 0.5)
    )
    self.dialog.open()
```

**Passo a passo:**

1. `self.secret_number = random.randint(1, 10)` → Sorteia número de 1 a 10
2. `self.guesses = 0` → Inicializa contador de tentativas
3. `guess_field = MDTextField(input_filter='int', ...)` → Campo que aceita só números
4. `def check_guess(instance):` → Função chamada ao clicar CHUTAR
5. `guess = int(guess_field.text)` → Converte texto para número
6. `self.guesses += 1` → Incrementa tentativas
7. `if guess == self.secret_number:` → Acertou?
   - Mostra mensagem de sucesso
   - Adiciona 100 pontos
8. `elif guess < self.secret_number:` → Muito baixo?
   - Mostra "Muito baixo!"
9. `else:` → Muito alto?
   - Mostra "Muito alto!"
10. `guess_field.text = ""` → Limpa campo

**Fluxo:**
```
1. Sorteia número (ex: 7)
2. Usuário digita 5
3. Mostra "Muito baixo!"
4. Usuário digita 9
5. Mostra "Muito alto!"
6. Usuário digita 7
7. Mostra "Acertou em 3 tentativas!"
```

---

### JOGO DO GIF SECRETO

```python
def start_gif_game(self):
    gifs = [
        "🐱 Gatinho feliz pulando",
        "😺 Gato dormindo",
        "🐈 Gato correndo",
        "😸 Gato brincando",
        "🐱‍👓 Gato inteligente"
    ]
    
    secret_gif = random.choice(gifs)
    self.add_log(f"🎁 GIF Secreto: {secret_gif}")
    self.dialog.dismiss()
```

**O que faz?**

1. `gifs = [...]` → Lista de 5 GIFs
2. `secret_gif = random.choice(gifs)` → Sorteia um GIF aleatório
3. Mostra no log

**Probabilidade:** 1/5 para cada GIF

---

### JOGO DE CARTAS ALEATÓRIAS

```python
def start_cards_game(self):
    cards = ["♠️ Ás", "♥️ Rei", "♦️ Rainha", "♣️ Valete", "🃏 Coringa"]
    card = random.choice(cards)
    self.add_log(f"🃏 Carta sorteada: {card}")
    self.dialog.dismiss()
```

**O que faz?**

1. `cards = [...]` → Lista de 5 cartas
2. `card = random.choice(cards)` → Sorteia uma carta
3. Mostra no log

---

## 5.5 RESUMO DO FLUXO COMPLETO

```
1. App inicia
   ↓
2. Mostra tela de login
   ↓
3. Usuário digita credenciais
   ↓
4. Se correto: Faz login
   ↓
5. Se novo: Registra e atribui cor aleatória
   ↓
6. Mostra menu principal
   ↓
7. Usuário clica em "Jogos" ou "Gatos"
   ↓
8. Mostra submenu
   ↓
9. Usuário escolhe jogo
   ↓
10. Jogo executa
   ↓
11. Resultado registrado no log
   ↓
12. Volta ao menu
```

---

# 🎓 CONCLUSÃO

Você agora entende:
- ✅ Como KivyMD funciona
- ✅ Como Express cria APIs
- ✅ Como JWT autentica usuários
- ✅ Como Docker empacota apps
- ✅ Como banco de dados armazena dados
- ✅ Como jogos funcionam com random
- ✅ Como tudo se conecta

**Parabéns!** 🎉

