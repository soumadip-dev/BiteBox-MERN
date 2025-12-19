import { Router } from 'express';
import {
  addItem,
  editItem,
  getItemById,
  deleteItem,
  getItemsByCity,
  getItemByRestaurant,
  searchItems,
} from '../controller/item.controller.js';
import { isAuth } from '../middleware/user.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/add-item', isAuth, upload.single('image'), addItem);
router.post('/edit-item/:id', isAuth, upload.single('image'), editItem);
router.delete('/delete-item/:id', isAuth, deleteItem);
router.get('/get-by-id/:itemId', isAuth, getItemById);
router.get('/get-by-city/:city', isAuth, getItemsByCity);
router.get('/get-by-restaurant/:restaurantId', isAuth, getItemByRestaurant);
router.get('/search-items', isAuth, searchItems);

//* Export the router
export default router;
