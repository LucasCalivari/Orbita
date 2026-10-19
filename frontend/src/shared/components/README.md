# shared/components

Componentes de UI que usan **dos o más features** (Boton, Input, Modal, TarjetaProducto…).

Regla: un componente nace dentro de su feature (`features/<feature>/components/`) y se mueve acá recién cuando otra feature lo necesita.

Las carpetas `shared/hooks/` y `shared/utils/` se crean cuando aparezca el primer hook o función genérica, con la misma regla.
