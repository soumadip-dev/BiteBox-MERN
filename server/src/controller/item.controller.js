import uploadOnCloudinary from '../config/cloudinary.config.js';
import { createItemService, editItemService } from '../services/item.service.js';

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

    // Call the service to create item
    const item = await createItemService({ name, category, foodType, price, image, owner });

    // Send success response
    res.status(200).json({ message: 'Item created successfully', success: true, item });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Something went wrong', success: false });
  }
};


//* Export controller
export { addItem };
