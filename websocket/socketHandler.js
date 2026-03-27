// NEW FEATURE: WebSocket Real-Time Updates
const socketIO = require('socket.io');

let io = null;

function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

function emitSensorUpdate(data) {
  if (io) {
    io.emit('sensor_update', data);
  }
}

function emitAlertCreated(alert) {
  if (io) {
    io.emit('alert_created', alert);
  }
}

module.exports = { initializeSocket, emitSensorUpdate, emitAlertCreated };
