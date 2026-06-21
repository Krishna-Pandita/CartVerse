import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";

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
  const [sortOrder,setSortOrder] = useState("")

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
        `http://localhost:5000/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p,
        );
        dispatch(setProducts(updateProducts));
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  let filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter(
        (product) => product._id !== productId,
      );
      const res = await axios.delete(
        `http://localhost:5000/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setProducts(remainingProducts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  if(sortOrder === "lowToHigh"){
    filteredProducts = [...filteredProducts].sort((a,b)=>a.productPrice - b.productPrice)
  }

   if(sortOrder === "hoghToLow"){
    filteredProducts = [...filteredProducts].sort((a,b)=>b.productPrice - a.productPrice)
  }

  return (
    <div className="pl-[365px] py-25 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100">
      <div className="flex justify-between">
        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Products"
            className="w-[400px] h-[40px] items-center"
          />
          <Search className=" absolute right-3 top-1.5 text-gray-500" />
        </div>

        <Select onValueChange={(value)=>setSortOrder(value)}>
          <SelectTrigger className="w-[200px] bg-white">
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

      {filteredProducts?.map((product, idx) => {
        if (!product) return null;
        return (
          <Card key={idx} className="px-4">
            <div className="flex items-center justify-between">
              <div className=" flex gap-2 items-center">
                <img
                  src={product?.productImg[0].url || "/placeholder.png"}
                  alt=""
                  className="w-25 h-25 "
                />
                <h1 className="font-bold w-96  txt-gr">
                  {product.productName}
                </h1>
              </div>
              <h1 className="font-semibold text-gray-800">
                ₹{product.productPrice}
              </h1>
              <div className="flex gap-3">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Edit
                      className="text-green-500 cursor-pointer"
                      onClick={() => {
                        (setOpen(true), setEditProduct(product));
                      }}
                    />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px] max-h-[740px] overflow-y-scroll">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                      <DialogDescription>
                        Make changes to your product here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label>Product Name</Label>
                        <Input
                          value={editProduct?.productName}
                          onChange={handleChange}
                          type="text"
                          name="productName"
                          placeholder="Ex-Iphone"
                          required
                        />
                      </Field>
                      <Field>
                        <Label>Price</Label>
                        <Input
                          value={editProduct?.productPrice}
                          onChange={handleChange}
                          type="number"
                          name="productPrice"
                          required
                        />
                      </Field>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Brand</Label>
                          <Input
                            value={editProduct?.brand}
                            onChange={handleChange}
                            type="text"
                            name="brand"
                            required
                            placeholder="Ex-apple"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Category</Label>
                          <Input
                            value={editProduct?.category}
                            onChange={handleChange}
                            type="text"
                            name="category"
                            required
                            placeholder="Ex-Mobile"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label>Description</Label>
                        </div>
                        <Textarea
                          value={editProduct?.productDesc}
                          onChange={handleChange}
                          name="productDesc"
                          placeholder="Enter brief Description of product"
                        />
                      </div>

                      <ImageUpload
                        productData={editProduct}
                        setProductData={setEditProduct}
                      />
                    </FieldGroup>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleSave} type="submit">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2 className="text-red-500 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProductHandler(product._id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminProduct;
