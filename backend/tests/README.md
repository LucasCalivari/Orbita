# Tests del backend

Se usa el runner nativo de Node (`node:test`), sin dependencias extra.

```bash
npm test -w backend
```

Estructura: una carpeta por módulo, espejando `src/`:

```
tests/
├── shared/
├── auth/
└── promociones/
```

Prioridad: los services con reglas de negocio críticas.

| CU | Qué testear |
|----|-------------|
| CU-01 | Rechazo de email duplicado, DNI inválido, máximo 3 direcciones |
| CU-05 | Descuento de stock solo tras pago acreditado |
| CU-11 | Descuento que no viole el margen mínimo neto tolerable |
| CU-19 | Cálculo del nivel de fidelización |
