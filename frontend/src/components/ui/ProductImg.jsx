import React, { useState, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductImg = ({ images = [] }) => {
  const [mainImg, setMainImg] = useState(images?.[0]?.url || "");

  useEffect(() => {
    if (images && images.length > 0) {
      setMainImg(images[0]?.url || "");
    }
  }, [images]);

  return (
    <div className="w-full flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-start">
      {/* Thumbnails Row on mobile / Column on tablet & desktop */}
      {images && images.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[460px] w-full sm:w-20 shrink-0 py-1 sm:py-0 pr-1">
          {images.map((img, idx) => {
            const isSelected = mainImg === img.url;
            return (
              <button
                key={img.public_id || img.url || idx}
                type="button"
                onClick={() => setMainImg(img.url)}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all p-0.5 shrink-0 bg-white ${
                  isSelected
                    ? "border-pink-600 ring-2 ring-pink-100"
                    : "border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image with Zoom */}
      <div className="flex-1 w-full max-w-lg sm:max-w-none mx-auto aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xs flex items-center justify-center p-2">
        {mainImg ? (
          <Zoom>
            <img
              src={mainImg}
              alt="Product preview"
              className="w-full h-full object-contain max-h-[460px] rounded-xl transition-all cursor-zoom-in"
            />
          </Zoom>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            No image available
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImg;