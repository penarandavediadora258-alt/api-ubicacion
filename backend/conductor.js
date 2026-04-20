const io = require('socket.io-client');

const socket = io('http://192.168.0.25:3000');

socket.on('connect', () => {
  console.log('Conductor conectado');
});

// Escuchar viajes
socket.on('viajeDisponible', (viaje) => {
  console.log(' Nuevo viaje recibido:', viaje);
});