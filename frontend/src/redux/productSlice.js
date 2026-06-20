import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const productSlice = createSlice({
  name:"product",
  initialState:{
    products:[],
    cart:[],
  },
  reducers:{
    setProducts:(state,action)=>{
      state.products = action.payload
    }, setCart:(state, action) =>{
      state.cart = action.payload
    }
  }
})

export const {setProducts, setCart} = productSlice.actions;
export default productSlice.reducer

