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
      } catch (error) {
        console.error('Identity event error ❌:', error);
      }
    });

    socket.on('disconnect', async () => {
      try {
        await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null, isOnline: false });
      } catch (error) {
        console.error('Disconnect event error ❌:', error);
      }
    });

    socket.on('updateLocation', async data => {
      try {
        const { latitude, longitude, userId } = data;
        const user = await User.findByIdAndUpdate(userId, {
          location: { type: 'Point', coordinates: [longitude, latitude] },
          socketId: socket.id,
          isOnline: true,
        });
        if (user) {
          io.emit('updateDeliveryBoyLocation', { deliveryBoyId: userId, latitude, longitude });
        }
      } catch (error) {
        console.error('Update location error ❌:', error);
      }
    });
  });
};
