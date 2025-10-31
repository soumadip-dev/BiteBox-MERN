import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.config.js';
import { connectDB } from './config/db.config.js';
import cookieParser from 'cookie-parser';
import auth_routes from './routes/auth.routes.js';
import user_routes from './routes/user.routes.js';
import shop_routes from './routes/shop.routes.js';
import item_routes from './routes/item.routes.js';
import morgan from 'morgan';

const app = express();
const PORT = ENV.PORT || 8080;

app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true, // If true, allows cookies
  })
);
app.use(express.json()); // If we don't use this, we won't be able to access req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // If we don't use this, we won't be able to access req.cookies
app.use(morgan('dev')); // used for logging requests to the console

//* Root Route
app.get('/', (req, res) => {
  res.send('Hello from BiteBox backend!');
});

//* Routes
app.use('/api/v1/auth', auth_routes);
app.use('/api/v1/user', user_routes);
app.use('/api/v1/shop', shop_routes);
app.use('/api/v1/item', item_routes);

//* Function to connect the DB and start the server
const startServer = async () => {
  try {
    await connectDB(); // Ensure DB is connected before starting the server
    app.listen(PORT, () => {
      console.info(`✔️ Server is up and running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
