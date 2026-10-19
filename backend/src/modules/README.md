# Módulos del backend

Un módulo por dominio. Adentro, siempre las mismas capas (RNF-09):

```
modules/auth/
├── auth.routes.js       endpoints y middlewares (autenticación, rol, validación)
├── auth.controller.js   lee la request, llama al service y arma la respuesta
├── auth.service.js      reglas de negocio del caso de uso (no conoce SQL)
├── auth.repository.js   única capa que escribe SQL contra PostgreSQL
└── auth.schemas.js      validación de los datos de entrada (Zod)
```

Reglas:

- El controller nunca habla con la base; el repository nunca tiene reglas de negocio.
- Si cambia una tabla, solo se toca el repository.
- Los errores de negocio se lanzan con `ErrorApp` (`shared/errors/ErrorApp.js`).
- Lo que usan varios módulos (autenticación, roles, validación) va en `shared/`, no en un módulo.
- Las rutas del módulo se registran en `src/routes.js`.
- Los tests del módulo van en `backend/tests/<modulo>/`.

Módulos previstos por fase:

| Fase | Módulos |
|------|---------|
| 1 | `auth`, `usuarios` |
| 2 | `productos`, `categorias`, `favoritos`, `newsletter`, `resenias`, `faq` |
| 3 | `carrito`, `pedidos`, `pagos`, `promociones`, `fidelizacion` |
| 4 | `stock`, `proveedores`, `envios`, `permisos`, `auditoria`, `estadisticas` |
