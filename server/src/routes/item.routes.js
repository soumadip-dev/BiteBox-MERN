import { Router } from 'express';
import { addItem, editItem } from '../controller/item.controller.js';
import { isAuth } from '../middleware/user.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/add-item', isAuth, upload.single('image'), addItem);
router.post('/edit-item/:id', isAuth, upload.single('image'), editItem);

//* Export the router
export default router;
