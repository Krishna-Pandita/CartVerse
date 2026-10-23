import React, { useEffect, useState } from "react";
import FilterSidebar from "@/components/ui/FilterSidebar";
import ProductCard from "@/components/ui/ProductCard";
import toast from "react-hot-toast";
import { SlidersHorizontal, ArrowUpDown, X, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortOrder, setSortOrder] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/product/getallproducts`
      );

      if (res.data.success) {
        setallProducts(res.data.products);
        dispatch(setProducts(res.data.products));

        // Dynamically initialize price range from loaded products
        const maxPrice = Math.max(
          ...res.data.products.map((p) => Number(p.productPrice || 0)),
          100000
        );
        setPriceRange([0, maxPrice]);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
    );

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

  useEffect(() => {
    getAllProducts();
  }, []);

  const hasActiveFilters =
    search.trim() !== "" || category !== "All" || brand !== "All";

  const clearAllFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 100000]);
    setSortOrder("");
  };

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 pb-12 min-h-screen bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            brand={brand}
            setBrand={setBrand}
            category={category}
            setCategory={setCategory}
            allProducts={allProducts}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          {/* MAIN PRODUCT SECTION */}
          <div className="flex flex-col flex-1 w-full min-w-0">
            {/* Top Toolbar (Sort, Filter Toggle on Mobile, Results Count) */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 mb-5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              {/* Left Side: Product Count & Mobile Filter Trigger */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setMobileFilterOpen(true)}
                  variant="outline"
                  className="md:hidden flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm py-2 px-3 rounded-lg"
                >
                  <SlidersHorizontal className="w-4 h-4 text-pink-600" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-pink-600" />
                  )}
                </Button>

                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {products?.length || 0}
                  </span>{" "}
                  products
                </p>
              </div>

              {/* Right Side: Sort dropdown */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-gray-500 font-medium">
                  Sort:
                </span>
                <Select value={sortOrder} onValueChange={(val) => setSortOrder(val)}>
                  <SelectTrigger className="w-[160px] sm:w-[180px] h-9 text-xs sm:text-sm bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                      <SelectItem value="highToLow">Price: High to Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filter Badges on Mobile & Tablet */}
              {hasActiveFilters && (
                <div className="w-full flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
                  <span className="text-gray-400">Active:</span>
                  {category !== "All" && (
                    <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full font-medium">
                      {category}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setCategory("All")}
                      />
                    </span>
                  )}
                  {brand !== "All" && (
                    <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full font-medium">
                      {brand.toUpperCase()}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setBrand("All")}
                      />
                    </span>
                  )}
                  {search.trim() !== "" && (
                    <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full font-medium">
                      "{search}"
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSearch("")}
                      />
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-pink-600 hover:underline font-semibold ml-auto text-xs"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* PRODUCT GRID */}
            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {products.map((product) => {
                  if (!product) return null;
                  return (
                    <ProductCard
                      key={product._id}
                      product={product}
                      loading={loading}
                    />
                  );
                })}
              </div>
            ) : loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {[...Array(10)].map((_, i) => (
                  <ProductCard key={i} product={{}} loading={true} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center my-6">
                <PackageX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">
                  We couldn't find any products matching your current filters. Try
                  resetting your search or adjusting filters.
                </p>
                <Button
                  onClick={clearAllFilters}
                  className="bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm px-5 py-2 cursor-pointer"
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white rounded-t-2xl shadow-2xl z-10 w-full max-h-[85vh] flex flex-col">
            <FilterSidebar
              search={search}
              setSearch={setSearch}
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              allProducts={allProducts}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              isMobile={true}
              onClose={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
