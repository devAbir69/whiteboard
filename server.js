const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (like the HTML, CSS, JS)
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// When a new user connects
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for drawing data and broadcast it to other users
  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data); // Send data to all other users
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
