import React, { useEffect, useState } from "react";
import FilterSidebar from "@/components/ui/FilterSidebar";
import ProductCard from "@/components/ui/ProductCard";
import toast from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";

const Products = () => {
  const { products } = useSelector((store) => store.product);
  const dispatch = useDispatch();

  const [allProducts, setallProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");

  const [priceRange, setPriceRange] = useState([0, 9999999]);
  const [sortOrder, setSortOrder] = useState("");

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/v1/product/getallproducts`,
      );

      if (res.data.success) {
        setallProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };


   useEffect(() =>{
  if(allProducts.length === 0)
    return;

    let filtered = [...allProducts]

    if(search.trim() !== ""){
      filtered = filtered.filter(p=>p.productName?.toLowerCase().includes(search.toLowerCase()))
    }

    if(category !== "All"){
      filtered = filtered.filter(p => p.category === category)
    }
  
     if(brand !== "All"){
      filtered = filtered.filter(p => p.brand === brand)
    }

     filtered = filtered.filter(p=>p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

     if(sortOrder === "lowToHigh"){
      filtered.sort((a,b) => a.productPrice - b.productPrice)
     }else if(sortOrder === "highToLow"){
      filtered.sort((a,b) => b.productPrice - a.productPrice)
     }

     dispatch(setProducts(filtered));

   }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch])


  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="pt-25 pb-10">
      <div className="flex gap-7 max-w-7xl mx-auto">

        {/* SIDEBAR */}
        <FilterSidebar
         search = {search}
         setSearch = {setSearch}
         brand = {brand}
         setBrand = {setBrand}
         category = {category}
         setCategory = {setCategory}
         allProducts={allProducts} 
         priceRange={priceRange}
         setPriceRange = {setPriceRange}
         />


        {/* MAIN PRODUCT SECTION */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4 ">
            <Select onValueChange={(value)=>setSortOrder(value)}>
              <SelectTrigger className="w-[200px] max-w-48 y-900">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                  <SelectItem value="highToLow">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* PRODUCT GRID */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {
            products?.map((product) => {
                if (!product) return null;
              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  loading={loading}
                />
               );
             })
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default Products;
