import uploadOnCloudinary from '../config/cloudinary.config.js';
import { createShopService } from '../services/shop.service.js';

//* Controller for creating a new shop
const createShop = async (req, res) => {
  try {
    // Get fields from the request body
    const { name, city, state, address } = req.body;

    // Upload image to Cloudinary
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // Get user ID from the request (added by middleware)
    const owner = req.userId;

    // Call the service to create a new shop
    const shop = await createShopService({ name, city, state, address, image, owner });

    // Send success response
    res.status(200).json({ message: 'Shop created successfully', success: true, shop });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Export controller
export { createShop };
