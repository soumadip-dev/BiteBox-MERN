import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.config.js';
import { connectDB } from './config/db.config.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Root Route
app.get('/', (req, res) => {
  res.send('Hello from BiteBox backend!');
});

const PORT = ENV.PORT || 8080;

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
