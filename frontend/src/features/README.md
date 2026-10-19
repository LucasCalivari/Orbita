# Features del frontend

Una carpeta por funcionalidad, espejando `backend/src/modules/`:

```
features/auth/
├── components/      componentes propios de la feature
├── pages/           pantallas (se registran en app/router.jsx)
├── api.js           llamadas a /api/auth usando shared/services/http.js
├── AuthContext.jsx  estado global, solo si la feature lo necesita
└── useAuth.js       hook para consumir el contexto
```

Reglas:

- Las páginas nunca llaman a `fetch`: usan el `api.js` de su feature.
- Una feature no importa archivos internos de otra; lo compartido va a `shared/`.
  (Excepción: `auth`, cuyo `useAuth` y `roles` usa toda la app.)
- Los colores, tipografías y espaciados salen de `styles/tokens.css`, nunca valores sueltos.

| Feature | Casos de uso |
|---------|--------------|
| `auth` | CU-01, CU-02 |
| `catalogo` | CU-03, CU-15, CU-20 |
| `wishlist` | CU-13 |
| `carrito` | CU-04 |
| `checkout` | CU-05 |
| `pedidos` | CU-10, CU-12 |
| `admin` | CU-06, CU-07, CU-08, CU-09, CU-11, CU-21 |
| `soporte` | CU-16, CU-17, CU-18 |
