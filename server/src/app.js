import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';

import { ENV } from './config/env.config.js';

import auth_routes from './routes/auth.routes.js';
import user_routes from './routes/user.routes.js';
import shop_routes from './routes/shop.routes.js';
import item_routes from './routes/item.routes.js';
import order_routes from './routes/order.routes.js';

const app = express();

// create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO and bind it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: ENV.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  },
});

// Set the io instance on the app
app.set('io', io);

// Middlewares
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Root route
app.get('/', (req, res) => {
  res.send('Hello from BiteBox backend!');
});

// API routes
app.use('/api/v1/auth', auth_routes);
app.use('/api/v1/user', user_routes);
app.use('/api/v1/shop', shop_routes);
app.use('/api/v1/item', item_routes);
app.use('/api/v1/order', order_routes);

export { server, io };
