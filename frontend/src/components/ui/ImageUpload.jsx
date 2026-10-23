import React from 'react';
import { Label } from './label';
import { Input } from './input';
import { Button } from './button';
import { Card, CardContent } from "./card";
import { X, UploadCloud } from "lucide-react";

const ImageUpload = ({ productData, setProductData }) => {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...(prev.productImg || []), ...files],
      }));
    }
  };

  const removeImage = (idx) => {
    setProductData((prev) => ({
      ...prev,
      productImg: (prev.productImg || []).filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="grid gap-2">
      <Label className="text-xs font-semibold text-gray-700">Product Images</Label>
      <Input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFiles}
      />

      <label
        htmlFor="file-upload"
        className="border-2 border-dashed border-gray-300 hover:border-pink-500 rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 bg-gray-50/60 hover:bg-pink-50/30"
      >
        <UploadCloud className="w-8 h-8 text-pink-600" />
        <span className="text-sm font-semibold text-gray-700">
          Click to upload product images
        </span>
        <span className="text-xs text-gray-400">
          Upload high quality PNG, JPG, or WEBP photos
        </span>
      </label>

      {/* IMAGE PREVIEW */}
      {productData?.productImg?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
          {productData.productImg.map((file, idx) => {
            let preview;
            if (file instanceof File) {
              preview = URL.createObjectURL(file);
            } else if (typeof file === "string") {
              preview = file;
            } else if (file?.url) {
              preview = file.url;
            } else {
              return null;
            }

            return (
              <Card key={idx} className="relative group overflow-hidden border border-gray-200">
                <CardContent className="p-1">
                  <img
                    src={preview}
                    alt=""
                    className="object-cover rounded-md h-24 sm:h-28 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;