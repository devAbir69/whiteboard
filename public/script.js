const socket = io(); // Connect to the server
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

// Set canvas size to match the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false; // Whether the user is currently drawing
let x = 0;
let y = 0;
let currentColor = '#000000';  // Default color is black

const colorPicker = document.getElementById('color-picker');

// Update color when user selects a new color
colorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
});

const clearBtn = document.getElementById('clear-btn');
clearBtn.addEventListener('click', () => {
  // Clear the canvas for everyone
  socket.emit('clear');

  // Also clear locally for the current user
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
  const imageUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'whiteboard.png';
  link.click();
});

// Start drawing on mouse down
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  [x, y] = [e.clientX, e.clientY];
});

// Stop drawing on mouse up
canvas.addEventListener('mouseup', () => {
  drawing = false;
});

// Draw as the user moves the mouse
canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;

  const newX = e.clientX;
  const newY = e.clientY;

  // Set the current drawing color
  ctx.strokeStyle = currentColor;

  // Send the drawing data to the server
  socket.emit('drawing', { x, y, newX, newY });

  // Draw on the canvas
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(newX, newY);
  ctx.stroke();

  // Update the current position
  [x, y] = [newX, newY];
});

// Listen for drawing data from other users
socket.on('drawing', (data) => {
  const { x, y, newX, newY } = data;

  // Set the current drawing color
  ctx.strokeStyle = currentColor;

  // Draw on the canvas when receiving data from others
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(newX, newY);
  ctx.stroke();
});

// Listen for the clear event
socket.on('clear', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
