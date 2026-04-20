const mongoose = require('mongoose');

const viajeSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conductorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  origen: {
    lat: Number,
    lng: Number
  },
  destino: {
    lat: Number,
    lng: Number
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aceptado', 'en_camino', 'finalizado', 'cancelado'],
    default: 'pendiente'
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Viaje', viajeSchema);