const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');

const {
  crearViaje,
  viajesPendientes,
  aceptarViaje,
  finalizarViaje
} = require('../controllers/viajeController');

// Cliente crea viaje
router.post('/', auth, crearViaje);

// Conductores ven viajes
router.get('/pendientes', auth, viajesPendientes);

// Conductor acepta
router.put('/aceptar/:id', auth, aceptarViaje);

// Finalizar viaje
router.put('/finalizar/:id', auth, finalizarViaje);

module.exports = router;