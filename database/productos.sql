CREATE TABLE IF NOT EXISTS productos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    plataforma VARCHAR(50) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    imagen_url VARCHAR(500) NULL,
    descripcion VARCHAR(300) NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_producto_costo CHECK (costo >= 0),
    CONSTRAINT chk_producto_precio CHECK (precio > 0)
);
