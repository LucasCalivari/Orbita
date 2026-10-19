# Guía de trabajo del equipo

## Ramas

| Rama | Uso |
|------|-----|
| `main` | Versión estable y entregable. **Nadie trabaja ni hace push directo acá.** Solo recibe merges desde `develop` al cerrar una fase. |
| `develop` | Rama de integración. Recibe los Pull Requests de cada caso de uso. |
| `feature/CU-XX-descripcion-corta` | Una rama por caso de uso (ítem del tablero). Sale de `develop` y vuelve a `develop` por Pull Request. |
| `feature/fase-N-descripcion` | Tareas técnicas de una fase que no son un CU (por ejemplo, la estructura base). |
| `fix/descripcion` | Corrección de un error ya integrado en `develop`. |

Ejemplos: `feature/CU-01-registro-social`, `feature/CU-02-login-roles`, `feature/CU-03-catalogo-busqueda`.

### Flujo para tomar un ítem del tablero

```bash
git checkout develop
git pull origin develop
git checkout -b feature/CU-01-registro-social
# ... trabajar y commitear ...
git push -u origin feature/CU-01-registro-social
# abrir Pull Request hacia develop en GitHub
```

## Commits

Mensajes en español, en presente, con prefijo de tipo y el CU entre paréntesis cuando corresponda:

```
feat(CU-01): agregar formulario de datos complementarios
fix(CU-02): redirigir al panel según rol de soporte
chore: configurar eslint
docs: actualizar README con pasos de instalación
```

Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`.

## Tablero Kanban ↔ Git

| Columna del tablero | Qué pasa en Git |
|---------------------|-----------------|
| Nuevo | Todavía no hay rama. |
| En Proceso | Se creó la rama `feature/CU-XX-...` y hay commits. |
| Bloqueado | Se deja un comentario en el ítem explicando la causa. |
| Revisión de Código | Hay un Pull Request abierto hacia `develop`, con otro integrante como revisor. |
| Pruebas | El PR fue aprobado; se verifica contra los criterios de aceptación del CU. |
| Merge Pendiente | Aprobado en revisión y pruebas, esperando merge. |
| Hecho | El PR está mergeado en `develop`. |

Límite WIP: cada integrante tiene como máximo **un** ítem en "En Proceso".

## Pull Requests

- Siempre hacia `develop` (nunca hacia `main`).
- Al menos **una aprobación** de otro integrante antes del merge.
- Completar la plantilla del PR (CU, requerimientos cubiertos, cómo probarlo).
- Usar "Squash and merge" para mantener el historial limpio.

## Variables de entorno

Nunca se suben archivos `.env` ni credenciales (Google, Facebook, Mercado Pago). Cada variable nueva se documenta en el `.env.example` correspondiente.
