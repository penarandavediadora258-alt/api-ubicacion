require('dotenv').config();
require('.socket.io');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const app = express();

// Conectar DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/ubicaciones', require('./routes/ubicacionRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/viajes', require('./routes/viajeRoutes'));

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

// Usuarios conectados
let usuarios = {};

// Conexión de sockets
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  socket.on('nuevoViaje', (viaje) => {
  // enviar a todos los conductores
  socket.broadcast.emit('viajeDisponible', viaje);
});
socket.on('viajeAceptado', (viaje) => {
  io.emit('viajeConfirmado', viaje);
});
useEffect(() => {
  socket.on('viajeConfirmado', (viaje) => {
    alert(' Un conductor aceptó tu viaje');
    console.log(viaje);
  });
}, []);

  // Registrar usuario
  socket.on('registrar', (usuarioId) => {
    usuarios[usuarioId] = socket.id;
    console.log('Usuario registrado:', usuarioId);
  });

  //  Recibir ubicación en tiempo real
  socket.on('ubicacion', (data) => {
    const { usuarioId, latitud, longitud } = data;

    console.log('Ubicación recibida:', data);

    // Emitir a todos (puedes mejorar esto luego)
    io.emit('ubicacionConductor', {
      usuarioId,
      latitud,
      longitud
    });
  });
  useEffect(() => {
  socket.on('ubicacionConductor', (data) => {
    //  SOLO si es el conductor del viaje
    if (data.usuarioId === conductorId) {
      setConductorLocation({
        latitude: data.latitud,
        longitude: data.longitud
      });
    }
  });
}, [conductorId]);

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);

    // eliminar usuario
    for (let id in usuarios) {
      if (usuarios[id] === socket.id) {
        delete usuarios[id];
      }
    }
  });
});

// Ruta base
app.get('/', (req, res) => {
  res.send('API con tiempo real funcionando');
});

// Puerto
const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});