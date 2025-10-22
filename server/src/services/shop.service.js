import Shop from '../model/shop.model.js';

//* Service for creating a new shop
const createShopService = async data => {
  // Destructure the data
  const { name, city, state, address, image, owner } = data;

  // Create a new shop
  const shop = await Shop.create({ name, city, state, address, image, owner });

  // Populate the owner field
  await shop.populate('owner');

  // Return the shop
  return shop;
};

//* Export service
export { createShopService };
