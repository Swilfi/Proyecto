-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-04-2026 a las 07:03:15
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `institucion_primaria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencias`
--

CREATE TABLE `asistencias` (
  `id_asistencia` int(10) UNSIGNED NOT NULL,
  `id_estudiante` int(10) UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `estado` enum('Asistió','Inasistente','Justificado','Retraso') DEFAULT 'Asistió',
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asistencias`
--

INSERT INTO `asistencias` (`id_asistencia`, `id_estudiante`, `fecha`, `estado`, `observaciones`, `created_at`) VALUES
(21, 7, '2026-04-28', 'Asistió', NULL, '2026-04-28 04:46:31'),
(22, 8, '2026-04-28', 'Asistió', NULL, '2026-04-28 04:46:31'),
(23, 7, '2026-04-27', 'Inasistente', NULL, '2026-04-28 04:47:27'),
(24, 8, '2026-04-27', 'Asistió', NULL, '2026-04-28 04:47:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boleta`
--

CREATE TABLE `boleta` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_estudiante` int(10) UNSIGNED NOT NULL,
  `id_lapso` tinyint(3) UNSIGNED NOT NULL,
  `fecha_emision` date NOT NULL,
  `observaciones_generales` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificacion`
--

CREATE TABLE `calificacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_boleta` int(10) UNSIGNED NOT NULL,
  `id_materia` tinyint(3) UNSIGNED NOT NULL,
  `nota` decimal(4,2) NOT NULL,
  `literal` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo`
--

CREATE TABLE `cargo` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `nombre` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cargo`
--

INSERT INTO `cargo` (`id`, `nombre`) VALUES
(3, 'Administrativo'),
(1, 'Docente'),
(2, 'Obrero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante`
--

CREATE TABLE `estudiante` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `cedula_escolar` varchar(20) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `id_representante_principal` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ano_escolar` varchar(50) DEFAULT NULL,
  `seccion` varchar(20) DEFAULT NULL,
  `grado` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estudiante`
--

INSERT INTO `estudiante` (`id`, `nombre`, `apellido`, `fecha_nacimiento`, `cedula_escolar`, `direccion`, `id_representante_principal`, `created_at`, `ano_escolar`, `seccion`, `grado`) VALUES
(1, 'Ana', 'García', '0000-00-00', NULL, NULL, 1, '2026-04-17 19:02:43', '2023-2024', 'A', '1°'),
(7, 'Carlos', 'Mendoza', '2015-03-10', 'V-32111222', 'Valera, Sector Centro', NULL, '2026-04-28 03:12:03', '2025-2026', 'A', '1'),
(8, 'Elena', 'Rodríguez', '2015-07-22', 'V-32333444', 'Valera, Urb. La Beatriz', NULL, '2026-04-28 03:12:03', '2025-2026', 'A', '1'),
(9, 'Andrés', 'Briceño', '2015-01-15', 'V-32555666', 'San Luis', NULL, '2026-04-28 03:12:03', '2025-2026', 'B', '1'),
(10, 'Sofía', 'Uzcátegui', '2015-11-30', 'V-32777888', 'Plata III', NULL, '2026-04-28 03:12:03', '2025-2026', 'B', '1'),
(11, 'Miguel', 'Hernández', '2014-05-05', 'V-31999000', 'Carvajal', NULL, '2026-04-28 03:12:03', '2025-2026', 'A', '2'),
(12, 'Valeria', 'Castillo', '2010-09-12', 'V-29111222', 'Motatán', NULL, '2026-04-28 03:12:03', '2025-2026', 'C', '6');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante_representante`
--

CREATE TABLE `estudiante_representante` (
  `id_estudiante` int(10) UNSIGNED NOT NULL,
  `id_representante` int(10) UNSIGNED NOT NULL,
  `parentesco` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grado`
--

CREATE TABLE `grado` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `grado`
--

INSERT INTO `grado` (`id`, `nombre`) VALUES
(1, '1er grado'),
(2, '2do grado'),
(3, '3er grado'),
(4, '4to grado'),
(5, '5to grado'),
(6, '6to grado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grado_seccion`
--

CREATE TABLE `grado_seccion` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_grado` tinyint(3) UNSIGNED NOT NULL,
  `id_seccion` tinyint(3) UNSIGNED NOT NULL,
  `año_escolar` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `grado_seccion`
--

INSERT INTO `grado_seccion` (`id`, `id_grado`, `id_seccion`, `año_escolar`) VALUES
(3, 3, 1, '2026'),
(1, 3, 2, '2026'),
(2, 5, 1, '2026');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lapso`
--

CREATE TABLE `lapso` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `año_escolar` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materia`
--

CREATE TABLE `materia` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `observacion`
--

CREATE TABLE `observacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_estudiante` int(10) UNSIGNED NOT NULL,
  `id_personal_registra` int(10) UNSIGNED NOT NULL,
  `tipo` enum('Positiva','Negativa') NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal`
--

CREATE TABLE `personal` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `id_cargo` tinyint(3) UNSIGNED NOT NULL,
  `id_grado_seccion` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal`
--

INSERT INTO `personal` (`id`, `nombre`, `apellido`, `cedula`, `telefono`, `email`, `id_cargo`, `id_grado_seccion`, `created_at`) VALUES
(1, 'Test', 'Docente', 'V12345678', '5555555', 'test.docente@example.com', 1, 1, '2026-04-17 19:18:53'),
(2, 'lola', 'lolita', 'V1243451', '0141042314', 'juanitoalcachofa123@gmail.com', 1, 2, '2026-04-17 19:25:24'),
(3, 'Julieta', 'Macini', 'V15952888', '04245148475', 'mancini.julieta@gmail.com', 1, 3, '2026-04-19 17:57:33');

--
-- Disparadores `personal`
--
DELIMITER $$
CREATE TRIGGER `trg_personal_insert_check` BEFORE INSERT ON `personal` FOR EACH ROW BEGIN
    IF NEW.id_cargo = 1 AND NEW.id_grado_seccion IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Un Docente debe tener asignado un Grado y Sección.';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_personal_update_check` BEFORE UPDATE ON `personal` FOR EACH ROW BEGIN
    IF NEW.id_cargo = 1 AND NEW.id_grado_seccion IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Un Docente debe tener asignado un Grado y Sección.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `representante`
--

CREATE TABLE `representante` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `representante`
--

INSERT INTO `representante` (`id`, `nombre`, `apellido`, `cedula`, `telefono`, `email`, `direccion`, `created_at`) VALUES
(1, 'Juan', 'Pérez', 'V12345678', '04141234567', NULL, 'Calle 123', '2026-04-17 19:01:23'),
(4, 'Andres', 'Matheus', 'V31864918', '04247464817', NULL, 'La Comuna Antonio Nicolás Briceño', '2026-04-17 19:04:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seccion`
--

CREATE TABLE `seccion` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `nombre` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `seccion`
--

INSERT INTO `seccion` (`id`, `nombre`) VALUES
(1, 'A'),
(2, 'B'),
(3, 'C');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD KEY `fk_estudiante_asistencia` (`id_estudiante`);

--
-- Indices de la tabla `boleta`
--
ALTER TABLE `boleta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_boleta_estudiante_lapso` (`id_estudiante`,`id_lapso`),
  ADD KEY `id_lapso` (`id_lapso`);

--
-- Indices de la tabla `calificacion`
--
ALTER TABLE `calificacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_calificacion_boleta_materia` (`id_boleta`,`id_materia`),
  ADD KEY `id_materia` (`id_materia`);

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula_escolar` (`cedula_escolar`),
  ADD KEY `id_representante_principal` (`id_representante_principal`);

--
-- Indices de la tabla `estudiante_representante`
--
ALTER TABLE `estudiante_representante`
  ADD PRIMARY KEY (`id_estudiante`,`id_representante`),
  ADD KEY `id_representante` (`id_representante`);

--
-- Indices de la tabla `grado`
--
ALTER TABLE `grado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `grado_seccion`
--
ALTER TABLE `grado_seccion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_grado_seccion_año` (`id_grado`,`id_seccion`,`año_escolar`),
  ADD KEY `id_seccion` (`id_seccion`);

--
-- Indices de la tabla `lapso`
--
ALTER TABLE `lapso`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_lapso_año` (`nombre`,`año_escolar`);

--
-- Indices de la tabla `materia`
--
ALTER TABLE `materia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `observacion`
--
ALTER TABLE `observacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_estudiante` (`id_estudiante`),
  ADD KEY `id_personal_registra` (`id_personal_registra`);

--
-- Indices de la tabla `personal`
--
ALTER TABLE `personal`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD KEY `id_cargo` (`id_cargo`),
  ADD KEY `id_grado_seccion` (`id_grado_seccion`);

--
-- Indices de la tabla `representante`
--
ALTER TABLE `representante`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`);

--
-- Indices de la tabla `seccion`
--
ALTER TABLE `seccion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `id_asistencia` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `boleta`
--
ALTER TABLE `boleta`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `calificacion`
--
ALTER TABLE `calificacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cargo`
--
ALTER TABLE `cargo`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `grado`
--
ALTER TABLE `grado`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `grado_seccion`
--
ALTER TABLE `grado_seccion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `lapso`
--
ALTER TABLE `lapso`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `materia`
--
ALTER TABLE `materia`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `observacion`
--
ALTER TABLE `observacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `personal`
--
ALTER TABLE `personal`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `representante`
--
ALTER TABLE `representante`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `seccion`
--
ALTER TABLE `seccion`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD CONSTRAINT `fk_estudiante_asistencia` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `boleta`
--
ALTER TABLE `boleta`
  ADD CONSTRAINT `boleta_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `boleta_ibfk_2` FOREIGN KEY (`id_lapso`) REFERENCES `lapso` (`id`);

--
-- Filtros para la tabla `calificacion`
--
ALTER TABLE `calificacion`
  ADD CONSTRAINT `calificacion_ibfk_1` FOREIGN KEY (`id_boleta`) REFERENCES `boleta` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `calificacion_ibfk_2` FOREIGN KEY (`id_materia`) REFERENCES `materia` (`id`);

--
-- Filtros para la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`id_representante_principal`) REFERENCES `representante` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudiante_representante`
--
ALTER TABLE `estudiante_representante`
  ADD CONSTRAINT `estudiante_representante_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `estudiante_representante_ibfk_2` FOREIGN KEY (`id_representante`) REFERENCES `representante` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `grado_seccion`
--
ALTER TABLE `grado_seccion`
  ADD CONSTRAINT `grado_seccion_ibfk_1` FOREIGN KEY (`id_grado`) REFERENCES `grado` (`id`),
  ADD CONSTRAINT `grado_seccion_ibfk_2` FOREIGN KEY (`id_seccion`) REFERENCES `seccion` (`id`);

--
-- Filtros para la tabla `observacion`
--
ALTER TABLE `observacion`
  ADD CONSTRAINT `observacion_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `observacion_ibfk_2` FOREIGN KEY (`id_personal_registra`) REFERENCES `personal` (`id`);

--
-- Filtros para la tabla `personal`
--
ALTER TABLE `personal`
  ADD CONSTRAINT `personal_ibfk_1` FOREIGN KEY (`id_cargo`) REFERENCES `cargo` (`id`),
  ADD CONSTRAINT `personal_ibfk_2` FOREIGN KEY (`id_grado_seccion`) REFERENCES `grado_seccion` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
