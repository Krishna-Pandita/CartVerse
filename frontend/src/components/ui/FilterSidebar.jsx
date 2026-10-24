import React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Search, RotateCcw, X, SlidersHorizontal } from "lucide-react";

const FilterSidebar = ({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  setPriceRange,
  allProducts,
  priceRange,
  isMobile = false,
  onClose,
}) => {
  const Categories = allProducts.map((p) => p.category).filter(Boolean);
  const uniqueCategory = ["All", ...new Set(Categories)];

  const Brands = allProducts.map((p) => p.brand).filter(Boolean);
  const uniqueBrands = ["All", ...new Set(Brands)];

  const maxProductPrice = Math.max(
    ...allProducts.map((p) => Number(p.productPrice || 0)),
    100000
  );

  const handleCategoryClick = (val) => {
    setCategory(val);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]]);
    }
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange[0]) {
      setPriceRange([priceRange[0], value]);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, maxProductPrice]);
  };

  const containerClasses = isMobile
    ? "w-full p-4 sm:p-6 bg-white overflow-y-auto max-h-[80vh]"
    : "bg-white border border-gray-200 mt-2 p-5 rounded-xl h-max hidden md:block w-64 lg:w-72 shrink-0 shadow-xs sticky top-24";

  return (
    <aside className={containerClasses}>
      {/* Mobile Drawer Header */}
      {isMobile && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-pink-600" />
            <h2 className="font-bold text-lg text-gray-900">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
          Search
        </label>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-50 pr-9 rounded-lg border-gray-200 w-full text-sm"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
          )}
        </div>
      </div>

      {/* CATEGORY */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-2.5">
          Categories
        </h3>
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
          {uniqueCategory.map((item, index) => (
            <label
              key={index}
              htmlFor={`category-${isMobile ? "m-" : ""}${index}`}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm ${
                category === item
                  ? "bg-pink-50 text-pink-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                id={`category-${isMobile ? "m-" : ""}${index}`}
                type="radio"
                name={`category-group-${isMobile ? "m" : "d"}`}
                checked={category === item}
                onChange={() => handleCategoryClick(item)}
                className="accent-pink-600 w-4 h-4 cursor-pointer"
              />
              <span className="truncate">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* BRANDS */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-2">
          Brand
        </h3>
        <select
          className="text-sm bg-gray-50 w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-pink-500 text-gray-700 cursor-pointer"
          value={brand}
          onChange={handleBrandChange}
        >
          {uniqueBrands.map((item, index) => (
            <option key={index} value={item}>
              {item === "All" ? "All Brands" : item.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE RANGE */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500">
            Price Range
          </h3>
          <span className="text-xs font-medium text-pink-600">
            ₹{priceRange[0]} - ₹{priceRange[1] >= maxProductPrice ? "Max" : priceRange[1]}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center text-xs">
            <div className="flex-1">
              <span className="text-[10px] text-gray-400 block mb-0.5">Min (₹)</span>
              <input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={handleMinChange}
                className="w-full p-1.5 border border-gray-200 rounded-md text-xs bg-gray-50"
              />
            </div>
            <span className="text-gray-400 pt-3">-</span>
            <div className="flex-1">
              <span className="text-[10px] text-gray-400 block mb-0.5">Max (₹)</span>
              <input
                type="number"
                min={priceRange[0]}
                max={maxProductPrice}
                value={priceRange[1]}
                onChange={handleMaxChange}
                className="w-full p-1.5 border border-gray-200 rounded-md text-xs bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <input
              type="range"
              min="0"
              max={maxProductPrice}
              step="500"
              className="w-full accent-pink-600 cursor-pointer"
              value={priceRange[0]}
              onChange={handleMinChange}
            />
            <input
              type="range"
              min="0"
              max={maxProductPrice}
              step="500"
              className="w-full accent-pink-600 cursor-pointer"
              value={priceRange[1]}
              onChange={handleMaxChange}
            />
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
        <Button
          onClick={resetFilters}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer py-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </Button>

        {isMobile && (
          <Button
            onClick={onClose}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white text-sm py-2 cursor-pointer font-medium"
          >
            Apply & View Results
          </Button>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
