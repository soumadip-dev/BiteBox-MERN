import { Router } from 'express';
import { createAndEditShop, getMyShop, getShopsByCity } from '../controller/shop.controller.js';
import { isAuth } from '../middleware/user.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/create-edit', isAuth, upload.single('image'), createAndEditShop);
router.get('/get-my', isAuth, getMyShop);
router.get('/get-by-city:city', isAuth, getShopsByCity);

//* Export the router
export default router;
