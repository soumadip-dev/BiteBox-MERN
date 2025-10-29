import Shop from '../model/shop.model.js';

//* Service for creating a new shop
const createAndEditShopService = async data => {
  // Destructure the data
  const { name, city, state, address, image, owner } = data;

  let shop = await Shop.findOne({ owner });

  if (shop) {
    // If no new image provided, keep the existing one
    const updateData = { name, city, state, address };
    if (image) {
      updateData.image = image;
    }

    // Otherwise, image remains unchanged
    shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
  } else {
    // For new shop, image is required
    if (!image) {
      throw new Error('Image is required for new shop');
    }
    shop = await Shop.create({ name, city, state, address, image, owner });
  }

  await shop.populate('owner');
  return shop;
};

//* Service for getting my shop
const getMyShopService = async owner => {
  // Find the shop
  const shop = await Shop.findOne({ owner })
    .populate('items') // Add this line to populate items
    .populate('owner');

  // Check if shop exists
  if (!shop) {
    return null;
  }

  // Return the shop
  return shop;
};
//* Export service
export { createAndEditShopService, getMyShopService };
