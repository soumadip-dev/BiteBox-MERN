import Item from '../model/item.model.js';
import Shop from '../model/shop.model.js';

//* Service for creating an item
const createItemService = async data => {
  // Destructure the data
  const { name, category, foodType, price, image, owner } = data;

  // Find the shop
  const shop = await Shop.findOne({ owner }).populate({
    path: 'items',
    option: { sort: { updatedAt: -1 } },
  });

  // Check if shop exists
  if (!shop) {
    throw new Error('Shop not found');
  }

  // Create item and add it to the shop
  const item = await Item.create({ name, category, foodType, price, image, shop: shop._id });

  // Add item to the shop
  shop.items.push(item._id);
  await shop.save();
  await shop.populate('items owner');

  // Return the shop
  return shop;
};

//* Service for editing an item
const editItemService = async data => {
  // Destructure the data
  const { itemId, name, category, foodType, price, image } = data;

  // Find and update the item
  const editedItem = await Item.findByIdAndUpdate(
    itemId,
    { name, category, foodType, price, image },
    { new: true }
  );

  // Check if item exists
  if (!editedItem) {
    throw new Error('Item not found');
  }
};

//* Service for getting an item by id
const getItemByIdService = async itemId => {
  // Find and return the item
  return await Item.findById(itemId);
};

//* Service for deleting an item
const deleteItemService = async (itemId, currentOwner) => {
  // Find and delete the item
  const item = await Item.findByIdAndDelete(itemId);

  // Check if item exists
  if (!item) {
    throw new Error('Item not found');
  }

  const shop = await Shop.findOne({ owner: currentOwner });

  shop.items = shop.items.filter(item => item._id !== itemId);

  await shop.save();

  await shop.populate({
    path: 'items',
    option: { sort: { updatedAt: -1 } },
  });

  return shop;
};

//* Export service
export { createItemService, editItemService, getItemByIdService, deleteItemService };
