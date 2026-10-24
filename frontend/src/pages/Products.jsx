import React, { useEffect, useState, useRef } from "react";
import FilterSidebar from "@/components/ui/FilterSidebar";
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/Pagination";
import toast from "react-hot-toast";
import { SlidersHorizontal, Search, X, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { useSearchParams } from "react-router-dom";

const ITEMS_PER_PAGE = 15;

const Products = () => {
  const { products } = useSelector((store) => store.product);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allProducts, setallProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize search & page from URL parameters if present
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  });

  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortOrder, setSortOrder] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const productsTopRef = useRef(null);
  const isInitialFilterRun = useRef(true);

  // Fetch all products on initial mount
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
      console.error("Error loading products:", error);
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Filter & Sort products when any criteria changes
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    // Enhanced text search across name, description, category, and brand
    if (search.trim() !== "") {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const nameMatch = p.productName?.toLowerCase().includes(q);
        const descMatch = p.productDesc?.toLowerCase().includes(q);
        const categoryMatch = p.category?.toLowerCase().includes(q);
        const brandMatch = p.brand?.toLowerCase().includes(q);
        return nameMatch || descMatch || categoryMatch || brandMatch;
      });
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

    // Reset to page 1 whenever search or filters change (except during initial load)
    if (isInitialFilterRun.current) {
      isInitialFilterRun.current = false;
    } else {
      setCurrentPage(1);
    }
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

  // Total and paginated items calculation
  const totalFilteredCount = products?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Sync state to URL search parameters cleanly
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (safeCurrentPage > 1) params.set("page", safeCurrentPage.toString());
    setSearchParams(params, { replace: true });
  }, [search, safeCurrentPage, setSearchParams]);

  // Slice exactly 15 products for the active page
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedProducts = products ? products.slice(startIndex, endIndex) : [];

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) return;
    setCurrentPage(page);

    // Smoothly scroll back to the top of the products grid
    if (productsTopRef.current) {
      const yOffset = -90; // offset for fixed navbar
      const y =
        productsTopRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  };

  const hasActiveFilters =
    search.trim() !== "" || category !== "All" || brand !== "All";

  const clearAllFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 100000]);
    setSortOrder("");
    setCurrentPage(1);
  };

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 pb-16 min-h-screen bg-gray-50/60">
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
          <div ref={productsTopRef} className="flex flex-col flex-1 w-full min-w-0">
            {/* Top Search Bar & Toolbar Container */}
            <div className="flex flex-col gap-3 mb-6">
              {/* Prominent Search Input */}
              <div className="relative w-full">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search products here"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white pl-10 pr-10 py-2.5 h-11 text-sm sm:text-base rounded-xl border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 shadow-2xs transition-all placeholder:text-gray-400"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Clear search text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Toolbar (Mobile Filter Button, Results Count, Sort Dropdown) */}
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                {/* Left Side: Product Count & Mobile Filter Trigger */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setMobileFilterOpen(true)}
                    variant="outline"
                    className="md:hidden flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm py-2 px-3 rounded-lg cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-pink-600" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-pink-600" />
                    )}
                  </Button>

                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    {totalFilteredCount > ITEMS_PER_PAGE ? (
                      <>
                        Showing{" "}
                        <span className="font-bold text-gray-900">
                          {startIndex + 1}–{Math.min(endIndex, totalFilteredCount)}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-gray-900">
                          {totalFilteredCount}
                        </span>{" "}
                        products
                      </>
                    ) : (
                      <>
                        Showing{" "}
                        <span className="font-bold text-gray-900">
                          {totalFilteredCount}
                        </span>{" "}
                        {totalFilteredCount === 1 ? "product" : "products"}
                      </>
                    )}
                  </p>
                </div>

                {/* Right Side: Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-xs text-gray-500 font-medium">
                    Sort:
                  </span>
                  <Select value={sortOrder} onValueChange={(val) => setSortOrder(val)}>
                    <SelectTrigger className="w-[160px] sm:w-[180px] h-9 text-xs sm:text-sm bg-gray-50 border-gray-200 cursor-pointer">
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

                {/* Active Filter Badges */}
                {hasActiveFilters && (
                  <div className="w-full flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
                    <span className="text-gray-400">Active:</span>

                    {search.trim() !== "" && (
                      <span className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full font-medium border border-pink-200">
                        Search: "{search}"
                        <X
                          className="w-3.5 h-3.5 cursor-pointer hover:text-pink-900"
                          onClick={() => setSearch("")}
                        />
                      </span>
                    )}

                    {category !== "All" && (
                      <span className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full font-medium border border-pink-200">
                        {category}
                        <X
                          className="w-3.5 h-3.5 cursor-pointer hover:text-pink-900"
                          onClick={() => setCategory("All")}
                        />
                      </span>
                    )}

                    {brand !== "All" && (
                      <span className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full font-medium border border-pink-200">
                        {brand.toUpperCase()}
                        <X
                          className="w-3.5 h-3.5 cursor-pointer hover:text-pink-900"
                          onClick={() => setBrand("All")}
                        />
                      </span>
                    )}

                    <button
                      onClick={clearAllFilters}
                      className="text-pink-600 hover:text-pink-700 hover:underline font-semibold ml-auto text-xs cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCT GRID (Current Page items only) */}
            {displayedProducts && displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                  {displayedProducts.map((product) => {
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

                {/* PAGINATION COMPONENT (15 items per page) */}
                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  totalItems={totalFilteredCount}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </>
            ) : loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
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
                  {search
                    ? `No products match your search "${search}". Try checking for typos or searching a different term.`
                    : "We couldn't find any products matching your current filters. Try resetting your search or adjusting filters."}
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
