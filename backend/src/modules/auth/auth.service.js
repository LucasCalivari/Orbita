import { ErrorApp } from '../../shared/errors/ErrorApp.js';
import * as repositorioReal from './auth.repository.js';

// Reglas de negocio de CU-01 (Registrar usuario). No conoce SQL ni HTTP.
// Se arma con crearAuthService(repositorio) para poder testearlo con un repositorio falso.

export const PROVEEDOR = 'google';

const errorDniRepetido = () =>
  new ErrorApp(409, 'Ya existe una cuenta con ese DNI', [
    { campo: 'dni', mensaje: 'Ya existe una cuenta con ese DNI' },
  ]);

const errorCuentaExistente = () =>
  new ErrorApp(409, 'La cuenta ya existe. Iniciá sesión con tu cuenta de Google.', [
    { campo: 'email', mensaje: 'La cuenta ya existe' },
  ]);

export function crearAuthService(repositorio = repositorioReal) {
  return {
    /**
     * Paso 4-5 del CU-01: con el perfil de Google decide qué sigue.
     *  - 'cuenta-existente' → flujo alternativo "correo ya registrado" (se deriva a CU-02).
     *  - 'registro-pendiente' → hay que pedir los datos complementarios.
     */
    async procesarPerfilGoogle(perfil) {
      if (!perfil.socialId || !perfil.email || !perfil.emailVerificado) {
        throw new ErrorApp(403, 'La cuenta de Google no tiene un correo verificado');
      }

      const existente = await repositorio.buscarPorEmail(perfil.email);
      if (existente) return { tipo: 'cuenta-existente', usuario: existente };

      return {
        tipo: 'registro-pendiente',
        pendiente: {
          socialId: perfil.socialId,
          email: perfil.email.toLowerCase(),
          nombre: perfil.nombre,
          apellido: perfil.apellido,
        },
      };
    },

    /**
     * Pasos 6-7 del CU-01: valida reglas de negocio y crea la cuenta con rol "usuario".
     * `pendiente` son los datos de Google (cookie firmada); `datos` es el formulario ya validado por Zod.
     */
    async registrar(pendiente, datos) {
      if (await repositorio.buscarPorEmail(pendiente.email)) throw errorCuentaExistente();
      if (await repositorio.existeDni(datos.dni)) throw errorDniRepetido();

      try {
        return await repositorio.crearUsuarioConDireccion({
          proveedor: PROVEEDOR,
          socialId: pendiente.socialId,
          email: pendiente.email,
          nombre: datos.nombre,
          apellido: datos.apellido,
          dni: datos.dni,
          direccion: datos.direccion,
        });
      } catch (error) {
        // 23505 = unique_violation: dos registros simultáneos con el mismo dato.
        if (error.code === '23505') {
          if (String(error.constraint).includes('dni')) throw errorDniRepetido();
          throw errorCuentaExistente();
        }
        throw error;
      }
    },

    /** Datos del usuario logueado para /auth/me. */
    async obtenerUsuarioDeSesion(id) {
      const usuario = await repositorio.buscarPorId(id);
      if (!usuario || !usuario.activo) throw new ErrorApp(401, 'Necesitás iniciar sesión');
      const { activo, ...datos } = usuario;
      return datos;
    },
  };
}

export const authService = crearAuthService();
