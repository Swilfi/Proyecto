CREATE DATABASE IF NOT EXISTS institucion_primaria DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE institucion_primaria;

CREATE TABLE IF NOT EXISTS representante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(15) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estudiante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    ano_escolar VARCHAR(50) NOT NULL,
    seccion VARCHAR(20) NOT NULL,
    grado VARCHAR(10) NOT NULL,
    cedula_escolar VARCHAR(15) UNIQUE,
    id_representante_principal INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_representante_principal) REFERENCES representante(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS personal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(15) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    cargo VARCHAR(50) NOT NULL,
    grado_asignado VARCHAR(10),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cargo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT IGNORE INTO cargo (nombre) VALUES ('Administrativo'), ('Obrero'), ('Docente');
