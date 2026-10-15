# Módulos del backend

Cada dominio tiene su carpeta con la misma estructura en capas (RNF-09):

```
modules/auth/
├── auth.routes.js       define endpoints y middlewares
├── auth.controller.js   lee la request, llama al servicio y arma la respuesta
├── auth.service.js      reglas de negocio del caso de uso (no conoce SQL)
└── auth.repository.js   única capa que escribe SQL contra PostgreSQL
```

Reglas:

- El controller nunca habla con la base; el repository nunca tiene reglas de negocio.
- Si cambia una tabla, solo se toca el repository.
- Los errores de negocio se lanzan con `ErrorApp` (ver `middlewares/manejadorErrores.js`).

Módulos previstos por fase:

| Fase | Módulos |
|------|---------|
| 1 | `auth`, `usuarios` |
| 2 | `productos`, `categorias`, `favoritos`, `newsletter`, `resenias` |
| 3 | `carrito`, `pedidos`, `pagos`, `promociones` |
| 4 | `stock`, `proveedores`, `envios`, `auditoria`, `estadisticas` |
