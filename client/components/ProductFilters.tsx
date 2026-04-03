"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface FilterOptions {
  category: string[];
  priceRange: [number, number];
  sortBy: string;
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  minPrice: number;
  maxPrice: number;
  onReset: () => void;
}

export default function ProductFilters({
  onFilterChange,
  categories,
  minPrice,
  maxPrice,
  onReset,
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    priceRange: [minPrice, maxPrice],
    sortBy: "featured",
    inStockOnly: false,
  });

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    category: true,
    price: true,
    sort: true,
    stock: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCategory = (cat: string) => {
    const newCategories = filters.category.includes(cat)
      ? filters.category.filter((c) => c !== cat)
      : [...filters.category, cat];

    const newFilters = { ...filters, category: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    let newRange: [number, number] = filters.priceRange;

    if (type === "min") {
      newRange = [
        Math.min(value, filters.priceRange[1]),
        filters.priceRange[1],
      ];
    } else {
      newRange = [
        filters.priceRange[0],
        Math.max(value, filters.priceRange[0]),
      ];
    }

    const newFilters = { ...filters, priceRange: newRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value: string) => {
    const newFilters = { ...filters, sortBy: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStockChange = (checked: boolean) => {
    const newFilters = { ...filters, inStockOnly: checked };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.priceRange[0] !== minPrice ||
    filters.priceRange[1] !== maxPrice ||
    filters.inStockOnly;

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      category: [],
      priceRange: [minPrice, maxPrice],
      sortBy: "featured",
      inStockOnly: false,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    onReset();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-primary hover:underline font-semibold flex items-center gap-1"
          >
            <X size={16} />
            Reset
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="mb-8 pb-8 border-b border-border">
        <button
          onClick={() => toggleSection("sort")}
          className="w-full flex items-center justify-between mb-4 hover:text-primary transition-colors"
        >
          <h4 className="font-semibold text-foreground">Sort By</h4>
          <ChevronDown
            size={18}
            className={`transition-transform ${expandedSections.sort ? "rotate-180" : ""}`}
          />
        </button>

        {expandedSections.sort && (
          <div className="space-y-3">
            {[
              { value: "featured", label: "Featured" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={filters.sortBy === option.value}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-4 h-4 text-primary cursor-pointer"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-8 pb-8 border-b border-border">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between mb-4 hover:text-primary transition-colors"
        >
          <h4 className="font-semibold text-foreground">Price Range</h4>
          <ChevronDown
            size={18}
            className={`transition-transform ${expandedSections.price ? "rotate-180" : ""}`}
          />
        </button>

        {expandedSections.price && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-semibold mb-2 block">
                Min: ${filters.priceRange[0].toFixed(2)}
              </label>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={10}
                value={filters.priceRange[0]}
                onChange={(e) =>
                  handlePriceChange("min", Number(e.target.value))
                }
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-semibold mb-2 block">
                Max: ${filters.priceRange[1].toFixed(2)}
              </label>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={10}
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handlePriceChange("max", Number(e.target.value))
                }
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-semibold text-foreground">
                ${filters.priceRange[0].toFixed(2)} - $
                {filters.priceRange[1].toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Category */}
      <div className="mb-8 pb-8 border-b border-border">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between mb-4 hover:text-primary transition-colors"
        >
          <h4 className="font-semibold text-foreground">Category</h4>
          <ChevronDown
            size={18}
            className={`transition-transform ${expandedSections.category ? "rotate-180" : ""}`}
          />
        </button>

        {expandedSections.category && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.category.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 text-primary rounded cursor-pointer"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Stock Availability */}
      <div>
        <button
          onClick={() => toggleSection("stock")}
          className="w-full flex items-center justify-between mb-4 hover:text-primary transition-colors"
        >
          <h4 className="font-semibold text-foreground">Availability</h4>
          <ChevronDown
            size={18}
            className={`transition-transform ${expandedSections.stock ? "rotate-180" : ""}`}
          />
        </button>

        {expandedSections.stock && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => handleStockChange(e.target.checked)}
              className="w-4 h-4 text-primary rounded cursor-pointer"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              In Stock Only
            </span>
          </label>
        )}
      </div>
    </div>
  );
}
