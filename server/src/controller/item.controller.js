import uploadOnCloudinary from '../config/cloudinary.config.js';
import {
  createItemService,
  editItemService,
  getItemByIdService,
  deleteItemService,
  getItemsByCityService,
} from '../services/item.service.js';
import Shop from '../model/shop.model.js';

//* Controller for creating an item
const addItem = async (req, res) => {
  try {
    // Get fields from the request body
    const { name, category, foodType, price } = req.body;

    // Upload image to Cloudinary
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // Get user ID from the request (added by middleware)
    const owner = req.userId;

    // Call the service to create item and get shop
    const shop = await createItemService({ name, category, foodType, price, image, owner });

    // Send success response
    res.status(200).json({ message: 'Item created successfully', success: true, shop });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Controller for editing item
const editItem = async (req, res) => {
  try {
    // Get the item ID from the request params
    const { id } = req.params;

    // Get fields from the request body
    const { name, category, foodType, price } = req.body;

    // Upload image to Cloudinary
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // Call the service to edit item
    await editItemService({
      itemId: id,
      name,
      category,
      foodType,
      price,
      image,
    });

    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: 'items',
      option: { sort: { updatedAt: -1 } },
    });

    // Send success response
    res.status(200).json({ message: 'Item edited successfully', success: true, shop });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Controller for geting item by id
const getItemById = async (req, res) => {
  try {
    // Get the item ID from the request params
    const { itemId } = req.params;

    // Call the service to get item by id
    const item = await getItemByIdService(itemId);

    // Check if item exists
    if (!item) {
      throw new Error('Item not found');
    }

    // Send success response
    res.status(200).json({ message: 'Item fetched successfully', success: true, item });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Controller for deleting item
const deleteItem = async (req, res) => {
  try {
    // Get the item ID from the request params
    const { id } = req.params;

    const currentOwner = req.userId;

    // Call the service to delete item
    const shop = await deleteItemService(id, currentOwner);

    // Send success response
    res.status(200).json({ message: 'Item deleted successfully', success: true, shop });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Controller for getting all items in current city
const getItemsByCity = async (req, res) => {
  try {
    // Get the city from the request params
    const { city } = req.params;

    // Call the service to get items by city
    const items = await getItemsByCityService(city);

    // Send success response
    res.status(200).json({ message: 'Items fetched successfully', success: true, items });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Export controllers
export { addItem, editItem, getItemById, deleteItem, getItemsByCity };
