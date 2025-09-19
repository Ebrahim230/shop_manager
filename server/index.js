const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/database');
const http = require('http');
const { Server } = require('socket.io');
const Product = require('./models/productModel');
const costRoute = require('./routes/costRoutes');

const app = express();
const port = process.env.PORT || 5000;

const productRoute = require('./routes/productRoute');
const salesRoute = require('./routes/salesRoute');
const reportRoute = require('./routes/reportRoutes');
const alertRoute = require('./routes/alertRoutes');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/product', productRoute);
app.use('/api/sales', salesRoute);
app.use('/api/report', reportRoute);
app.use('/api/alert', alertRoute);
app.use('/api/costs',costRoute);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let alertInterval;

io.on('connection', (socket) => {
  if (!alertInterval) {
    alertInterval = setInterval(async () => {
      const today = new Date();
      const soon = new Date();
      soon.setDate(today.getDate() + 30);

      const lowStock = await Product.find({ stock: { $lte: 5 } });
      const expiry = await Product.find({ expiryDate: { $gte: today, $lte: soon } });

      io.emit('alerts', { lowStock: lowStock || [], expiry: expiry || [] });
    }, 10000);
  }

  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (io.sockets.sockets.size === 0) {
      clearInterval(alertInterval);
      alertInterval = null;
    }
  });
});

server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});