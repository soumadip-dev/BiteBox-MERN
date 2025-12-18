import app from './app.js';
import { ENV } from './config/env.config.js';
import { connectDB } from './config/db.config.js';

const PORT = ENV.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.info(`✔️ Server listening at http://localhost:${PORT}`);
    });

    server.on('error', error => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `⚠️ Port ${PORT} is already in use. Please stop the running process or use a different port.`
        );
      } else {
        console.error('❌ Failed to start the server:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
