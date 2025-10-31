//* Schema definition
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Snacks',
        'Main Course',
        'Desserts',
        'Pizza',
        'Burgers',
        'Sandwiches',
        'South Indian',
        'North Indian',
        'Chinese',
        'Fast Food',
        'Others',
      ],
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    foodType: {
      type: String,
      enum: ['veg', 'non veg'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//* Create the model
const Item = mongoose.model('Item', itemSchema);

//* Export the model
export default Item;
