 const Viaje = require('../models/Viaje');

//  Crear viaje (cliente)
exports.crearViaje = async (req, res) => {
  try {
    const { origen, destino } = req.body;

    const viaje = new Viaje({
      clienteId: req.user.id,
      origen,
      destino
    });

    await viaje.save();

    res.status(201).json(viaje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Ver viajes pendientes (conductores)
exports.viajesPendientes = async (req, res) => {
  try {
    const viajes = await Viaje.find({ estado: 'pendiente' });
    res.json(viajes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Aceptar viaje
exports.aceptarViaje = async (req, res) => {
  try {
    const viaje = await Viaje.findById(req.params.id);

    if (!viaje) {
      return res.status(404).json({ msg: 'Viaje no encontrado' });
    }

    viaje.conductorId = req.user.id;
    viaje.estado = 'aceptado';

    await viaje.save();

    res.json(viaje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Finalizar viaje
exports.finalizarViaje = async (req, res) => {
  try {
    const viaje = await Viaje.findById(req.params.id);

    viaje.estado = 'finalizado';
    await viaje.save();

    res.json(viaje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};