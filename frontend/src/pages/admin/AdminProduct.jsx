import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2, Package } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { setProducts } from "@/redux/productSlice";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("productName", editProduct.productName);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("category", editProduct.category);
    formData.append("brand", editProduct.brand);

    // ADD EXISTING IMAGES PUBLIC IDs
    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));

    // ADD NEW FILES
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files", file);
      });

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p
        );
        dispatch(setProducts(updateProducts));
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    }
  };

  let filteredProducts = (products || []).filter(
    (product) =>
      product &&
      (product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter(
        (product) => product._id !== productId
      );
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message || "Product deleted successfully");
        dispatch(setProducts(remainingProducts));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    }
  };

  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.productPrice - b.productPrice
    );
  } else if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.productPrice - a.productPrice
    );
  }

  return (
    <div className="md:pl-72 lg:pl-80 px-4 sm:px-6 md:pr-8 pt-32 sm:pt-36 md:pt-28 pb-16 min-h-screen bg-gray-50/70 w-full">
      <div className="max-w-6xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Manage Products
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Search, edit, sort, and manage all your store products ({products?.length || 0})
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title, brand, or category..."
              className="bg-gray-50 pr-10 text-xs sm:text-sm w-full h-10 border-gray-200"
            />
            <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>

          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger className="w-full sm:w-[190px] h-10 text-xs sm:text-sm bg-gray-50 border-gray-200">
              <SelectValue placeholder="Sort By Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                <SelectItem value="highToLow">Price: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Product Cards List */}
        {filteredProducts?.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center my-6 shadow-2xs">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-gray-800">No products found</h3>
            <p className="text-gray-500 text-xs mt-1">
              Try adjusting your search query or add a new product.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              if (!product) return null;
              return (
                <Card
                  key={product._id}
                  className="p-3.5 sm:p-4 border-gray-200 bg-white shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Image + Title */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={product?.productImg?.[0]?.url || "/placeholder.png"}
                        alt={product.productName}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shrink-0 border border-gray-100 bg-gray-50"
                      />
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 leading-snug">
                          {product.productName}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">
                            {product.brand}
                          </span>
                          <span>•</span>
                          <span>{product.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
                      <span className="font-bold text-base sm:text-lg text-gray-900">
                        ₹{Number(product.productPrice || 0).toLocaleString("en-IN")}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Edit Dialog */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditProduct(product);
                            setOpen(true);
                          }}
                          className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        {/* Delete Dialog */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove "{product.productName}"? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProductHandler(product._id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Global Edit Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-xl md:max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-5 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Edit Product</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-500">
                Update product information, pricing, and images below.
              </DialogDescription>
            </DialogHeader>

            {editProduct && (
              <form onSubmit={handleSave} className="space-y-4 pt-2">
                <FieldGroup className="space-y-3">
                  <Field>
                    <Label className="text-xs font-semibold">Product Name</Label>
                    <Input
                      value={editProduct?.productName || ""}
                      onChange={handleChange}
                      type="text"
                      name="productName"
                      placeholder="Product name"
                      required
                    />
                  </Field>

                  <Field>
                    <Label className="text-xs font-semibold">Price (₹)</Label>
                    <Input
                      value={editProduct?.productPrice || ""}
                      onChange={handleChange}
                      type="number"
                      name="productPrice"
                      required
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field>
                      <Label className="text-xs font-semibold">Brand</Label>
                      <Input
                        value={editProduct?.brand || ""}
                        onChange={handleChange}
                        type="text"
                        name="brand"
                        required
                      />
                    </Field>
                    <Field>
                      <Label className="text-xs font-semibold">Category</Label>
                      <Input
                        value={editProduct?.category || ""}
                        onChange={handleChange}
                        type="text"
                        name="category"
                        required
                      />
                    </Field>
                  </div>

                  <Field>
                    <Label className="text-xs font-semibold">Description</Label>
                    <Textarea
                      value={editProduct?.productDesc || ""}
                      onChange={handleChange}
                      name="productDesc"
                      placeholder="Product description..."
                      rows={3}
                    />
                  </Field>

                  <div className="pt-1">
                    <ImageUpload
                      productData={editProduct}
                      setProductData={setEditProduct}
                    />
                  </div>
                </FieldGroup>

                <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white">
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminProduct;
