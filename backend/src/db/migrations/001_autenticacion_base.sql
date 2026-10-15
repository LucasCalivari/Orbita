-- Fase 1: Capa base y autenticación (CU-01, CU-02)
-- Entidades del diagrama de clases: Rol, Usuario, Direccion.
-- Requerimientos: RF-01, RF-02, RNF-06.

CREATE TABLE rol (
  id_rol       SERIAL PRIMARY KEY,
  nombre_rol   VARCHAR(50)  NOT NULL UNIQUE,
  descripcion  VARCHAR(255)
);

CREATE TABLE usuario (
  id_usuario          SERIAL PRIMARY KEY,
  id_rol              INT          NOT NULL REFERENCES rol (id_rol),
  -- RF-01: autenticación únicamente mediante redes sociales
  proveedor_social    VARCHAR(20)  NOT NULL
                      CHECK (proveedor_social IN ('google', 'facebook', 'instagram')),
  social_id           VARCHAR(255) NOT NULL,
  -- RF-02: datos provistos por la red social
  nombre              VARCHAR(100) NOT NULL,
  apellido            VARCHAR(100) NOT NULL,
  email               VARCHAR(255) NOT NULL UNIQUE,
  -- RF-02: dato complementario obligatorio
  dni                 VARCHAR(10)  NOT NULL UNIQUE CHECK (dni ~ '^[0-9]{7,8}$'),
  -- RF-21 / CU-19: se calcula automáticamente en la Fase 3
  nivel_fidelizacion  VARCHAR(30)  NOT NULL DEFAULT 'inicial',
  -- CU-02: cuenta suspendida o inactiva
  activo              BOOLEAN      NOT NULL DEFAULT TRUE,
  fecha_alta          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (proveedor_social, social_id)
);

-- RF-02: domicilio exacto de entrega y referencia.
-- Multiplicidad del diagrama: un usuario tiene de 1 a 3 direcciones
-- (el máximo de 3 se valida en la capa de servicios).
CREATE TABLE direccion (
  id_direccion  SERIAL PRIMARY KEY,
  id_usuario    INT          NOT NULL REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  calle         VARCHAR(150) NOT NULL,
  numero        INT          NOT NULL CHECK (numero > 0),
  localidad     VARCHAR(100) NOT NULL,
  provincia     VARCHAR(100) NOT NULL,
  cod_postal    INT          NOT NULL,
  referencia    VARCHAR(255) NOT NULL,
  es_principal  BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_usuario_rol ON usuario (id_rol);
CREATE INDEX idx_direccion_usuario ON direccion (id_usuario);
-- Solo una dirección principal por usuario
CREATE UNIQUE INDEX uq_direccion_principal ON direccion (id_usuario) WHERE es_principal;
