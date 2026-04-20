const Ubicacion = require('../models/Ubicacion');

// Guardar ubicación
exports.guardarUbicacion = async (req, res) => {
  try {
    const { usuarioId, latitud, longitud } = req.body;

    if (!usuarioId || latitud == null || longitud == null) {
      return res.status(400).json({ msg: 'Datos incompletos' });
    }

    const nuevaUbicacion = new Ubicacion({
      usuarioId,
      latitud,
      longitud
    });

    await nuevaUbicacion.save();

    res.status(201).json(nuevaUbicacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener ubicaciones por usuario
exports.obtenerUbicaciones = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const ubicaciones = await Ubicacion.find({ usuarioId })
      .sort({ timestamp: -1 });

    res.json(ubicaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Última ubicación
exports.ultimaUbicacion = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const ubicacion = await Ubicacion.findOne({ usuarioId })
      .sort({ timestamp: -1 });

    res.json(ubicacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};