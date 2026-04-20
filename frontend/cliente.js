const io = require('socket.io-client');

const socket = io('http://localhost:3000');

// Registrar usuario
socket.emit('registrar', 'user123');

// Enviar ubicación cada 3 segundos
setInterval(() => {
  const lat = -17.78 + Math.random() * 0.01;
  const lng = -63.18 + Math.random() * 0.01;

  socket.emit('ubicacion', {
    usuarioId: 'user123',
    latitud: lat,
    longitud: lng
  });

}, 3000);

// Escuchar ubicaciones
socket.on('ubicacionActualizada', (data) => {
  console.log('Ubicación en tiempo real:', data);
});