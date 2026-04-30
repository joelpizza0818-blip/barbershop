-- ============================================================
--  BARBERIA DATABASE SCHEMA
--  Motor: SQL Server (T-SQL)
--  Ultima revision: 2026-04-27
-- ============================================================

-- Crear base de datos (solo si no existe)

CREATE DATABASE barberia;
go

USE barberia;
go



CREATE TABLE Users (
        id             INT           IDENTITY(1,1) PRIMARY KEY,
        name           VARCHAR(100)  NOT NULL,
        email          VARCHAR(100)  NOT NULL UNIQUE,
        password       VARCHAR(255)  NOT NULL,
        fecha_registro DATE          NOT NULL DEFAULT GETDATE()
);
go

-- ============================================================
--  TABLA: Citas
--  Almacena las citas agendadas por los clientes.
--  La columna 'name' fue eliminada: se obtiene via JOIN con Users.
-- ============================================================

    CREATE TABLE Citas (
        id         INT          IDENTITY(1,1) PRIMARY KEY,
        id_usuario INT          NOT NULL,
        service    VARCHAR(100) NOT NULL,
        date       DATE         NOT NULL,
        time       TIME         NOT NULL,
        status     VARCHAR(20)  NOT NULL DEFAULT 'pendiente'
                                CHECK (status IN ('pendiente', 'completada', 'cancelada')),
        created_at DATETIME     NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_Citas_Usuario
            FOREIGN KEY (id_usuario) REFERENCES Users(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );
	go


select * from Users
select * from Citas

-- ============================================================
--  CONSULTAS UTILES (referencia / produccion)
-- ============================================================

-- Ver todas las citas con el nombre del cliente
-- SELECT
--     c.id,
--     u.name       AS cliente,
--     u.email,
--     c.service,
--     c.date,
--     c.time,
--     c.status,
--     c.created_at
-- FROM Citas c
-- JOIN Users u ON c.id_usuario = u.id
-- ORDER BY c.date ASC, c.time ASC;

-- Ver proximas citas de un usuario especifico
-- SELECT c.id, c.service, c.date, c.time, c.status
-- FROM Citas c
-- WHERE c.id_usuario = <id>
--   AND c.date >= CAST(GETDATE() AS DATE)
-- ORDER BY c.date ASC, c.time ASC;


-- ============================================================
--  SECCION DE DESARROLLO -- Solo ejecutar en entorno local
--  !! NO ejecutar en produccion !!
-- ============================================================

-- Ver todos los registros
-- SELECT * FROM Citas;
-- SELECT * FROM Users;

-- Resetear tablas (en orden correcto por la FK)
-- DROP TABLE IF EXISTS Citas;
-- DROP TABLE IF EXISTS Users;
