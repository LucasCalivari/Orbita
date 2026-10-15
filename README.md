# Orbita

E-commerce de auriculares — Proyecto final del **Taller de Integración** (Licenciatura en Sistemas de Información, FCyT – UADER, 2026).

**Equipo:** Calivari, Lucas Joaquín · Colazo, Ana Lucía · Mas Duarte, María Melina

## Arquitectura

Arquitectura desacoplada (frontend y backend separados), según el Entregable N°3:

| Capa | Tecnología | Carpeta |
|------|-----------|---------|
| Presentación | React + Vite | `frontend/` |
| Lógica de negocio | Node.js + Express (API REST) | `backend/` |
| Persistencia | PostgreSQL | `backend/src/db/` |

El backend sigue capas `routes → controllers → services → repositories` para desacoplar la lógica de negocio del modelo físico de la base (RNF-09).

```
Orbita/
├── backend/
│   └── src/
│       ├── config/          variables de entorno
│       ├── db/              pool de conexión, migraciones SQL y seeds
│       ├── middlewares/     manejo de errores, autenticación, roles
│       ├── modules/         un módulo por dominio (auth, usuarios, productos…)
│       └── routes/          registro de rutas de la API
├── frontend/
│   └── src/
│       ├── components/      componentes reutilizables (layout, UI)
│       ├── pages/           una página por pantalla
│       └── services/        cliente HTTP hacia la API
└── docker-compose.yml       PostgreSQL local
```

## Requisitos

- Node.js 20 o superior
- PostgreSQL 16 (instalado localmente o con Docker)

## Puesta en marcha

```bash
# 1. Instalar dependencias (backend y frontend)
npm install

# 2. Levantar PostgreSQL (opción Docker)
docker compose up -d

# 3. Configurar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Crear tablas y datos iniciales
npm run db:migrate
npm run db:seed

# 5. Levantar backend (puerto 4000) y frontend (puerto 5173)
npm run dev
```

Verificar la API: http://localhost:4000/api/health

## Forma de trabajo

Ver [CONTRIBUTING.md](CONTRIBUTING.md): ramas, commits, Pull Requests y tablero Kanban.

**Nunca se trabaja directamente sobre `main`.**
