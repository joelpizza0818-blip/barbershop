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
	id_usuario int,
    name VARCHAR(100) NOT NULL,
    service VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
	foreign key (id_usuario) references Users(id)
	
    
    
)
-- Para ver los datos
SELECT * FROM Citas;
select * from users;
drop table Citas;
drop table Users;

ALTER TABLE users 
ADD fecha_registro DATE DEFAULT GETDATE();


-- Ver citas con el nombre del usuario
SELECT 
    c.id,
    u.name AS cliente,
    c.service,
    c.date,
    c.time
FROM Citas c
JOIN Users u ON c.id_usuario = u.id;
		