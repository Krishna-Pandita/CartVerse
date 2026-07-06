import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: [],
    addresses: [],
    selectedAddress: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    setCart: (state, action) => {
      state.cart = action.payload;
    },

    addAddress: (state, action) => {
      if (!state.addresses) state.addresses = [];
      state.addresses.push(action.payload);
    },

    setSelectedAddress: (state, action) => {
        state.selectedAddress = action.payload
    },

    deleteAddress: (state, action) => {
        state.addresses = state.addresses.filter((_, index)=> index !== action.payload )

        if(state.selectedAddress == action.payload){
          state.selectedAddress = null
        }
    },

  },
});

export const { setProducts, setCart, addAddress, setSelectedAddress, deleteAddress } = productSlice.actions;
export default productSlice.reducer;
