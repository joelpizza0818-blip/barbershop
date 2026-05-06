USE barberia2;
ALTER TABLE Cortes ADD tipo VARCHAR(50) DEFAULT 'normal';
GO
UPDATE Cortes SET tipo = 'normal' WHERE tipo IS NULL;
GO
INSERT INTO Cortes (nombre, precio, descripcion, foto_url, tipo) VALUES 
('Full Experience', 105.00, '👑 La experiencia definitiva. Todo incluido.', 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=400&h=300&fit=crop', 'vip'),
('The Executive', 75.00, '👨‍💼 Corte impecable y servicio de relajación premium.', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop', 'vip');
