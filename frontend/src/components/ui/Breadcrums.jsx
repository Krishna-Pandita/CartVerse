import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Breadcrums = ({ product }) => {
  return (
    <div className="w-full overflow-hidden mb-4 sm:mb-6">
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap text-xs sm:text-sm text-gray-500 gap-1.5">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="hover:text-pink-600 transition-colors">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products" className="hover:text-pink-600 transition-colors">
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {product?.category && (
            <>
              <BreadcrumbItem>
                <span className="capitalize">{product.category}</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem className="min-w-0 max-w-[200px] sm:max-w-xs md:max-w-md">
            <BreadcrumbPage className="font-medium text-gray-800 truncate block">
              {product?.productName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrums;
