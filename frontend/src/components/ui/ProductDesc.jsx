import React from 'react'
import { Input } from './input'
import { Button } from './button'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import { useDispatch } from 'react-redux'
import { toast } from "sonner";

const ProductDesc = ({product}) => {
  const accessToken  = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  const addToCart = async(productId)=>{
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/cart/add`, {productId},{
        headers:{
          Authorization: `Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        toast.success("Product added to cart");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='font-bold text-3xl text-gray-800'>{product.productName}</h1>
      <p className='text-gray-800 '>{product.category} | {product.brand}</p>
      <h2 className='text-pink-500 text-2xl font-bold'>₹{product.productPrice}</h2>
      <p className='text-muted-foreground'>{product.productDesc}</p>
      <div className='flex gap-2 items-center w-[300px]'>
        <p className='text-gray-800 font-semibold'>Quantity : </p>
          <Input type="number" className="w-14" defaultValue={ 1}/>
      </div>
      <Button onClick={()=>addToCart(product._id)} className="bg-pink-600 w-max">Add To Cart</Button>
    </div>
  )
}

export default ProductDesc