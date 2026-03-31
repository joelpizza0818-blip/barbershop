create database barberia 
use barberia


create table Users (
	id INT IDENTITY(1,1) PRIMARY KEY,
	name varchar(100) not null,
	email VARCHAR(100) UNIQUE not null,
    password VARCHAR(255) not null

	)

CREATE TABLE Citas (
    id INT IDENTITY(1,1) PRIMARY KEY, -- Identificador único
    name VARCHAR(100) NOT NULL,
    service VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    
    -- Esto evita que dos personas agenden a la misma fecha Y misma hora
    CONSTRAINT UC_Cita_Unica UNIQUE (date, time) 
)
-- Para ver los datos
SELECT * FROM Citas;
drop table Citas

ALTER TABLE users 
ADD fecha_registro DATETIME DEFAULT GETDATE();

		