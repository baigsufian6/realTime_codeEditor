import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';
import ACTIONS from './src/Actions.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'build' directory
const staticPath = path.resolve('build');
app.use(express.static(staticPath));

// Route all other requests to index.html
app.use((req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const userSocketMap = {};

function getAllConnectedClients(roomID) {
  return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId],
    };
  });
}

io.on('connection', (socket) => {
  console.log('Socket connection', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomID, username }) => {
    console.log('Received JOIN event with username:', username, 'and roomID:', roomID);
    userSocketMap[socket.id] = username;
    console.log('userSocketMap:', userSocketMap);

    socket.join(roomID);

    const clients = getAllConnectedClients(roomID);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomID, code }) => {
    socket.in(roomID).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, (data) => {
    if (data && data.socketId && data.code) {
      io.to(data.socketId).emit(ACTIONS.CODE_CHANGE, { code: data.code });
    } else {
      console.error('Invalid data received for SYNC_CODE event');
    }
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomID) => {
      socket.in(roomID).emit(ACTIONS.DISCONNECTED, {
        socketID: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
