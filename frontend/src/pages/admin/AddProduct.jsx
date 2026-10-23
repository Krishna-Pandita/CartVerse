import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ui/ImageUpload';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '@/redux/productSlice';
import { Loader2, PlusCircle } from 'lucide-react';

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productDesc: "",
    productImg: [],
    brand: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!productData.productName || !productData.productPrice) {
      return toast.error("Product name and price are required");
    }

    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]));
        toast.success(res.data.message || "Product added successfully");
        setProductData({
          productName: "",
          productPrice: "",
          productDesc: "",
          productImg: [],
          brand: "",
          category: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:pl-72 lg:pl-80 px-4 sm:px-6 md:pr-8 pt-32 sm:pt-36 md:pt-28 pb-16 min-h-screen bg-gray-50/70 w-full">
      <div className="max-w-3xl mx-auto">
        <Card className="w-full bg-white border border-gray-200 rounded-2xl shadow-xs">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-pink-600" />
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                Add New Product
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm text-gray-500">
              Provide product details, pricing, category, and pictures below.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-gray-700">
                  Product Name *
                </Label>
                <Input
                  type="text"
                  name="productName"
                  value={productData.productName}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 15 Pro Max"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700">
                  Price (₹) *
                </Label>
                <Input
                  type="number"
                  name="productPrice"
                  value={productData.productPrice}
                  onChange={handleChange}
                  placeholder="e.g. 129999"
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-700">
                    Brand *
                  </Label>
                  <Input
                    type="text"
                    name="brand"
                    value={productData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Apple"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-700">
                    Category *
                  </Label>
                  <Input
                    type="text"
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    placeholder="e.g. Mobile"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700">
                  Product Description
                </Label>
                <Textarea
                  name="productDesc"
                  value={productData.productDesc}
                  onChange={handleChange}
                  placeholder="Enter detailed description of the product features..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <ImageUpload
                  productData={productData}
                  setProductData={setProductData}
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 rounded-lg cursor-pointer shadow-md transition-all"
                >
                  {loading ? (
                    <span className="flex gap-2 items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" /> Adding Product...
                    </span>
                  ) : (
                    "Publish Product"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;