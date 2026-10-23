import Breadcrums from "@/components/ui/Breadcrums";
import ProductDesc from "@/components/ui/ProductDesc";
import ProductImg from "@/components/ui/ProductImg";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { setProducts } from "@/redux/productSlice";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;
  const { products } = useSelector((store) => store.product);
  const [product, setProduct] = useState(
    products?.find((item) => item._id === productId) || null
  );
  const [loading, setLoading] = useState(!product);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // If not in redux, fetch all products or the single product
    const fetchProduct = async () => {
      const found = products?.find((item) => item._id === productId);
      if (found) {
        setProduct(found);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/product/getallproducts`
        );
        if (res.data.success) {
          dispatch(setProducts(res.data.products));
          const match = res.data.products.find((p) => p._id === productId);
          setProduct(match || null);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, products, dispatch]);

  if (loading) {
    return (
      <div className="pt-28 pb-16 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
          <p className="text-sm text-gray-500 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6 max-w-md text-sm">
          The product you are looking for does not exist or may have been removed.
        </p>
        <Button
          onClick={() => navigate("/products")}
          className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrums product={product} />
      <div className="mt-4 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-start">
        <ProductImg images={product.productImg} />
        <ProductDesc product={product} />
      </div>
    </div>
  );
};

export default SingleProduct;
