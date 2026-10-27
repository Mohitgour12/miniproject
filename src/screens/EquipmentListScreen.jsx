import React from "react";
import { CATEGORIES } from "../data/equipment";

export default function EquipmentListScreen({
  equipmentList,
  currentVillage,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenFilterModal,
  onSelectEquipment
}) {
  return (
    <main className="flex-1 px-4 pt-16 pb-24 flex flex-col space-y-4 max-w-lg mx-auto w-full animate-fade-in">
      {/* Title & Hub info */}
      <div className="pt-2">
        <h1 className="text-headline-md font-headline-md font-bold text-on-surface">
          Equipment Catalog
        </h1>
        <p className="text-body-sm text-outline">
          Machinery ready for dispatch around <strong className="text-on-surface">{currentVillage?.name || "Rampur Village"}</strong>
        </p>
      </div>

      {/* Search Input */}
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-3.5 text-outline pointer-events-none text-xl">
          search
        </span>
        <input 
          className="w-full h-12 pl-11 pr-10 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by name, brand, HP (e.g. Mahindra, 50 HP)..."
          type="search"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 text-outline hover:text-on-surface p-1"
          >
            <span className="material-symbols-outlined text-lg">cancel</span>
          </button>
        )}
      </div>

      {/* Category Pills & Filter Button */}
      <div className="flex items-center gap-2">
        <div className="overflow-x-auto no-scrollbar flex items-center space-x-2 flex-1 py-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`h-9 px-3.5 rounded-full font-label-md text-label-md flex items-center justify-center border shrink-0 transition-all ${
                  isActive
                    ? "bg-primary-container text-surface-container-lowest border-primary-container font-bold shadow-xs"
                    : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container"
                }`}
                type="button"
              >
                {cat}
              </button>
            );
          })}
        </div>
        <button
          onClick={onOpenFilterModal}
          className="h-9 px-3 rounded-full border border-outline-variant bg-surface-bright text-primary font-bold text-label-sm flex items-center gap-1 shrink-0 active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>Filter</span>
        </button>
      </div>

      {/* Equipment List */}
      <div className="space-y-3 pt-1">
        {equipmentList.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
            <h3 className="text-label-lg font-bold text-on-surface">No equipment found</h3>
            <p className="text-body-sm text-outline">No machines match your criteria in this radius.</p>
            <button
              onClick={() => {
                onSearchChange("");
                onSelectCategory("All");
              }}
              className="mt-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          equipmentList.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectEquipment(item)}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 flex gap-3 cursor-pointer hover:border-primary transition-all shadow-xs active:scale-[0.99]"
            >
              <div className="w-24 h-24 rounded-lg bg-surface-container overflow-hidden shrink-0 relative border border-outline-variant">
                <img 
                  src={item.cardImage || item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded backdrop-blur-xs">
                  {item.distance}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-label-md font-bold text-on-surface truncate">
                      {item.title}
                    </h3>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded shrink-0">
                      {item.hp}
                    </span>
                  </div>
                  <p className="text-body-sm text-outline line-clamp-1 mt-0.5">
                    {item.tagline}
                  </p>
                  <div className="text-[11px] text-secondary font-semibold mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">person</span>
                    <span>Owner: {item.owner.name} ({item.owner.rentalsCount} rentals)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-outline-variant/60">
                  <div className="text-price-display font-bold text-primary text-lg">
                    ₹{item.pricePerDay.toLocaleString()}
                    <span className="text-body-sm font-normal text-outline">/day</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEquipment(item);
                    }}
                    className="h-8 px-3 bg-primary text-white rounded-lg text-label-sm font-bold flex items-center gap-1 hover:bg-primary-container"
                    type="button"
                  >
                    <span>Rent</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
