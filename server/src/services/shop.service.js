import Shop from '../model/shop.model.js';

//* Service for creating a new shop
const createAndEditShopService = async data => {
  // Destructure the data
  const { name, city, state, address, image, owner } = data;

  let shop;

  // Check if any shop is present for the owner
  shop = await Shop.findOne({ owner });

  // If a shop is present, update it
  if (shop) {
    shop = await Shop.findByIdAndUpdate(
      shop._id,
      { name, city, state, address, image },
      { new: true }
    );
  } else {
    // Or create a new shop
    shop = await Shop.create({ name, city, state, address, image, owner });
  }

  // Populate the owner field
  await shop.populate('owner');

  // Return the shop
  return shop;
};

//* Export service
export { createAndEditShopService };
