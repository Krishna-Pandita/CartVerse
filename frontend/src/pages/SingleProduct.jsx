import Breadcrums from "@/components/ui/Breadcrums";
import ProductDesc from "@/components/ui/ProductDesc";
import ProductImg from "@/components/ui/ProductImg";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;
  const { products } = useSelector(store=>store.product);
  const product = products.find((item) => item._id === productId);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-25 py-20 max-w-7xl mx-auto">
      <Breadcrums product={product} />
      <div className="mt-10 grid grid-cols-2 items-start">
        <ProductImg images={product.productImg}/>
        <ProductDesc product={product}/>
      </div>
    </div>
  );
};

export default SingleProduct;
