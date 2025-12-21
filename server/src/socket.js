import User from './model/user.model.js';

export const socketHandler = async io => {
  io.on('connection', socket => {
    console.log('User connected:', socket.id);

    socket.on('identity', async data => {
      try {
        await User.findByIdAndUpdate(
          data.userId,
          { socketId: socket.id, isOnline: true },
          { new: true }
        );
        console.log('User online status updated ✅:', data.userId);
      } catch (error) {
        console.error('Identity event error ❌:', error);
      }
    });

    socket.on('disconnect', async () => {
      try {
        await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null, isOnline: false });
        console.log('User offline ✅:', socket.id);
      } catch (error) {
        console.error('Disconnect event error ❌:', error);
      }
    });
  });
};
