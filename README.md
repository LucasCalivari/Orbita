# Orbita

E-commerce de auriculares — Proyecto final del **Taller de Integración** (Licenciatura en Sistemas de Información, FCyT – UADER, 2026).

**Equipo:** Calivari, Lucas Joaquín · Colazo, Ana Lucía · Mas Duarte, María Melina

## Arquitectura

Arquitectura desacoplada (frontend y backend separados), según el Entregable N°3:

| Capa | Tecnología | Carpeta |
|------|-----------|---------|
| Presentación | React 18 + Vite 7 + React Router 7 | `frontend/` |
| Lógica de negocio | Node.js + Express (API REST) | `backend/` |
| Persistencia | PostgreSQL | `backend/src/db/` |

El backend se organiza en módulos por dominio; dentro de cada uno, capas `routes → controller → service → repository` para desacoplar la lógica de negocio del modelo físico de la base (RNF-09).

```
Orbita/
├── backend/
│   ├── src/
│   │   ├── config/          variables de entorno
│   │   ├── db/              pool de conexión, migraciones SQL y seeds
│   │   ├── modules/         un módulo por dominio (auth, productos, carrito…)
│   │   │   └── <modulo>/    routes · controller · service · repository · schemas
│   │   ├── shared/          middlewares, errores y utilidades comunes
│   │   ├── routes.js        junta las rutas de todos los módulos
│   │   ├── app.js           arma Express
│   │   └── server.js        levanta el puerto
│   └── tests/               tests con node:test (npm test -w backend)
├── frontend/
│   └── src/
│       ├── app/             App, providers y router (rutas protegidas por rol)
│       ├── features/        una carpeta por funcionalidad (auth, catalogo, carrito…)
│       ├── shared/          layout, componentes comunes y cliente HTTP
│       └── styles/          tokens de diseño (Figma) y estilos globales
└── docker-compose.yml       PostgreSQL local
```

## Requisitos

- Node.js 20.19 o superior (o 22.12+), requerido por Vite 7
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

```bash
# Correr los tests del backend
npm test -w backend
```

## Forma de trabajo

Ver [CONTRIBUTING.md](CONTRIBUTING.md): ramas, commits, Pull Requests y tablero Kanban.

**Nunca se trabaja directamente sobre `main`.**
