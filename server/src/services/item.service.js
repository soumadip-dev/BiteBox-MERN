import Item from '../model/item.model';
import Shop from '../model/shop.model';

//* Service for creating an item
const createItemService = async data => {
  // Destructure the data
  const { name, category, foodType, price, image, owner } = data;

  // Find the shop
  const shop = await Shop.findOne({ owner });

  // Check if shop exists
  if (!shop) {
    throw new Error('Shop not found');
  }

  // Create item and add it to the shop
  const item = await Item.create({ name, category, foodType, price, image, shop: shop._id });
};

//* Export service
export { createItemService };
