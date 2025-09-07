import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.config.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Root Route
app.get('/', (req, res) => {
  res.send('Hello from BiteBox backend!');
});

const PORT = ENV.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
