export const socketHandler = async io => {
  try {
    io.on('connection', socket => {
      console.log('A user connected');
    });
  } catch (error) {
    console.error('Socket handler error:', error);
  }
};


