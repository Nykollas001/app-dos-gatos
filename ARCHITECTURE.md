# 🏗️ Arquitetura - App dos Gatos v2.0

## Visão Geral

Ecossistema full-stack profissional com:
- **Mobile**: Python + KivyMD
- **Backend**: Node.js + Express + JWT
- **Frontend**: React + Tailwind (em desenvolvimento)
- **Infraestrutura**: Docker + Compose

## Componentes

### 1. App Mobile (main.py)
- Interface Material Design
- Temas dinâmicos
- Console F8
- Pronto para APK

### 2. Backend API (backend/server.js)
- Autenticação JWT
- 10+ endpoints REST
- Mock database
- CORS configurado

### 3. Infraestrutura
- Docker para containerização
- docker-compose para orquestração
- Scripts de automação

## Fluxo de Dados

```
Mobile App → API Backend → Mock Database
Web Frontend → API Backend → Mock Database
```

## Próximos Passos

- PostgreSQL real
- Frontend Web completo
- Testes E2E
- CI/CD com GitHub Actions
