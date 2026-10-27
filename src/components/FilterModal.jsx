import React, { useState } from "react";
import { CATEGORIES } from "../data/equipment";

export default function FilterModal({ isOpen, filters, onClose, onApplyFilters }) {
  const [category, setCategory] = useState(filters.category || "All");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || 6000);
  const [fastDispatchOnly, setFastDispatchOnly] = useState(filters.fastDispatchOnly || false);
  const [sortBy, setSortBy] = useState(filters.sortBy || "relevance");

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({
      category,
      maxPrice: Number(maxPrice),
      fastDispatchOnly,
      sortBy
    });
    onClose();
  };

  const handleReset = () => {
    setCategory("All");
    setMaxPrice(6000);
    setFastDispatchOnly(false);
    setSortBy("relevance");
    onApplyFilters({
      category: "All",
      maxPrice: 6000,
      fastDispatchOnly: false,
      sortBy: "relevance"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl border border-outline-variant shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        role="dialog"
      >
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-bright">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">tune</span>
            <h3 className="text-headline-sm font-bold text-on-surface">Filter Equipment</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Category */}
          <div>
            <label className="text-label-md font-bold text-on-surface block mb-2">
              Machinery Type
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`h-9 px-3.5 rounded-full text-label-sm font-semibold border transition-all active:scale-95 ${
                    category === cat
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-label-md font-bold text-on-surface">
                Maximum Daily Rate
              </label>
              <span className="text-price-display font-bold text-primary">₹{maxPrice.toLocaleString()} / day</span>
            </div>
            <input 
              type="range"
              min="500"
              max="6000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[11px] text-outline mt-1 font-semibold">
              <span>₹500/day</span>
              <span>₹3,000/day</span>
              <span>₹6,000/day</span>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-label-md font-bold text-on-surface block mb-2">
              Sort By
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: "relevance", label: "Distance (Nearest)" },
                { id: "price_asc", label: "Price: Low to High" },
                { id: "price_desc", label: "Price: High to Low" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSortBy(opt.id)}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                    sortBy === opt.id
                      ? "border-primary bg-primary-fixed/20 text-primary"
                      : "border-outline-variant bg-surface-container-lowest text-on-surface-variant"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fast Dispatch Toggle */}
          <div className="p-3 rounded-xl border border-outline-variant bg-surface-bright">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">bolt</span>
                <div>
                  <div className="text-label-md font-bold text-on-surface">Fast Dispatch Today</div>
                  <div className="text-[11px] text-outline">Show machines located within 4 km of your village</div>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={fastDispatchOnly}
                onChange={(e) => setFastDispatchOnly(e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary border-outline"
              />
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 border-t border-outline-variant bg-surface-bright flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 h-11 border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-md font-semibold rounded-lg hover:bg-surface-container active:scale-95"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 h-11 bg-primary text-white font-label-md font-semibold rounded-lg active:scale-95 shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
