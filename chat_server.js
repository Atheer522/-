const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('مستخدم متصل:', socket.id);

  socket.on('join-room', (roomId, user) => {
    socket.join(roomId);
    console.log(`${user} انضم للغرفة ${roomId}`);
  });

  socket.on('send-message', ({ roomId, user, text, time }) => {
    io.to(roomId).emit('receive-message', { user, text, time });
  });

  socket.on('disconnect', () => {
    console.log('مستخدم قطع الاتصال:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));