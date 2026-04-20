const express = require('express');
const router = express.Router();

const {
  guardarUbicacion,
  obtenerUbicaciones,
  ultimaUbicacion
} = require('../controllers/ubicacionController');

// Guardar ubicación
router.post('/', guardarUbicacion);

// Obtener todas las ubicaciones de un usuario
router.get('/:usuarioId', obtenerUbicaciones);

// Obtener última ubicación
router.get('/ultima/:usuarioId', ultimaUbicacion);

module.exports = router;