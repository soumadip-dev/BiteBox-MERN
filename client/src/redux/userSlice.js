import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null,
  city: null,
  state: null,
  address: null,
  shopsInMyCity: [],
  ItemsInMyCity: [],
  cartItems: [],
  cartTotal: 0,
  myOrders: [],
  searchItems: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.ItemsInMyCity = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find(item => item.id === cartItem.id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      state.cartTotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
      state.cartTotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== id);
      state.cartTotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },

    addMyOrder: (state, action) => {
      const currentOrders = Array.isArray(state.myOrders) ? state.myOrders : [];
      state.myOrders = [action.payload, ...currentOrders];
    },

    updateShopOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;

      // Find the order
      const order = state.myOrders.find(order => order._id.toString() === orderId.toString());

      if (order && order.shopOrders) {
        // Find the specific shop order within the array
        const shopOrder = order.shopOrders.find(
          so => so.shop?._id?.toString() === shopId.toString()
        );

        if (shopOrder) {
          shopOrder.status = status;
        }
      }
    },
    setSearchItems: (state, action) => {
      state.searchItems = action.payload;
    },
  },
});

export const {
  setUserData,
  setCity,
  setState,
  setAddress,
  setShopsInMyCity,
  setItemsInMyCity,
  addToCart,
  updateQuantity,
  removeFromCart,
  setMyOrders,
  addMyOrder,
  updateShopOrderStatus,
  setSearchItems,
} = userSlice.actions;
export default userSlice.reducer;
