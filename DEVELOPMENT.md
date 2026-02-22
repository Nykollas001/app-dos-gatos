# 🛠️ Guia de Desenvolvimento

## Setup

```bash
# Clone
git clone https://github.com/Nykollas001/app-dos-gatos.git
cd app-dos-gatos

# Instale
./setup.sh
```

## Rodar Componentes

**Mobile:**
```bash
python main.py
```

**Backend:**
```bash
cd backend && npm start
```

**Docker:**
```bash
docker-compose -f infra/docker-compose.yml up
```

## Testes

```bash
python -m pytest test_main.py -v
```

## Estrutura

```
app-dos-gatos/
├── main.py              # App Mobile
├── backend/
│   ├── server.js        # API
│   └── package.json
├── infra/
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── buildozer.spec       # Config APK
├── setup.sh             # Setup automático
└── README.md
```
