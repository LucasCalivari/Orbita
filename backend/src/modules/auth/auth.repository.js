import { query, transaccion } from '../../db/pool.js';

// Única capa del módulo que escribe SQL (RNF-09).

const SELECT_USUARIO = `
  SELECT u.id_usuario AS id, u.nombre, u.apellido, u.email, u.activo, r.nombre_rol AS rol
  FROM usuario u
  JOIN rol r ON r.id_rol = u.id_rol
`;

export async function buscarPorEmail(email) {
  const { rows } = await query(`${SELECT_USUARIO} WHERE lower(u.email) = lower($1)`, [email]);
  return rows[0] ?? null;
}

export async function buscarPorId(id) {
  const { rows } = await query(`${SELECT_USUARIO} WHERE u.id_usuario = $1`, [id]);
  return rows[0] ?? null;
}

export async function existeDni(dni) {
  const { rowCount } = await query('SELECT 1 FROM usuario WHERE dni = $1', [dni]);
  return rowCount > 0;
}

/**
 * Crea el usuario con rol "usuario" y su dirección principal en una sola transacción:
 * si falla cualquiera de los dos INSERT no queda nada guardado.
 */
export async function crearUsuarioConDireccion({ proveedor, socialId, nombre, apellido, email, dni, direccion }) {
  return transaccion(async (cliente) => {
    const { rows } = await cliente.query(
      `INSERT INTO usuario (id_rol, proveedor_social, social_id, nombre, apellido, email, dni)
       VALUES ((SELECT id_rol FROM rol WHERE nombre_rol = 'usuario'), $1, $2, $3, $4, $5, $6)
       RETURNING id_usuario AS id`,
      [proveedor, socialId, nombre, apellido, email, dni],
    );
    const id = rows[0].id;

    await cliente.query(
      `INSERT INTO direccion (id_usuario, calle, numero, localidad, provincia, cod_postal, referencia, es_principal)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)`,
      [id, direccion.calle, direccion.numero, direccion.localidad, direccion.provincia, direccion.codPostal, direccion.referencia ?? null],
    );

    return { id, nombre, apellido, email, rol: 'usuario' };
  });
}
