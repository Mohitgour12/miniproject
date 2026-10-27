import React, { useState } from "react";
import { CATEGORIES } from "../data/equipment";

export default function HomeScreen({
  equipmentList,
  currentVillage,
  onOpenLocationModal,
  onSelectEquipment,
  onOpenFilterModal,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}) {
  return (
    <main className="flex-1 px-4 pt-16 pb-24 flex flex-col space-y-4 max-w-lg mx-auto w-full">
      {/* Location Selector Bar */}
      <section className="bg-surface-container-lowest rounded-lg border border-outline-variant px-3 py-2 flex items-center justify-between min-h-[48px] shadow-xs">
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">location_on</span>
          <div className="truncate">
            <span className="text-body-sm font-body-sm text-outline block leading-none">
              Current Delivery Village
            </span>
            <span className="text-label-md font-label-md text-on-surface font-semibold truncate block mt-0.5">
              {currentVillage?.name || "Rampur Village, Block 4"}
            </span>
          </div>
        </div>
        <button 
          onClick={onOpenLocationModal}
          className="text-primary font-label-sm text-label-sm underline flex-shrink-0 min-h-[44px] flex items-center px-1 font-bold active:opacity-75"
          type="button"
        >
          Edit
        </button>
      </section>

      {/* Welcome Banner */}
      <section className="bg-primary-container text-surface-container-lowest rounded-xl p-4 shadow-none">
        <div className="flex flex-col space-y-1">
          <span className="inline-flex items-center space-x-1 bg-secondary-container text-on-secondary-fixed text-label-sm font-label-sm px-2.5 py-0.5 rounded-full w-max font-bold">
            <span className="material-symbols-outlined text-xs">verified</span>
            <span>Government Verified Hub</span>
          </span>
          <h1 className="text-headline-md font-headline-md text-surface-container-lowest tracking-tight pt-1 font-bold">
            Rent Equipment for Your Farm
          </h1>
          <p className="text-body-md font-body-md text-on-primary-container leading-snug pt-0.5">
            Verified tractors, harvesters & tools near you at standard daily rates.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section>
        <label className="sr-only" htmlFor="machinery-search">
          Search tractors, seed drills, rotavators
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-outline pointer-events-none text-xl">
            search
          </span>
          <input 
            className="w-full h-12 pl-11 pr-10 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-lg font-body-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-xs"
            id="machinery-search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tractors, seed drills, rotavators..."
            type="search"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 text-outline hover:text-on-surface p-1"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-lg">cancel</span>
            </button>
          )}
        </div>
      </section>

      {/* Horizontally Scrollable Category Chips */}
      <section className="overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
        <div className="flex items-center space-x-2 w-max">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`h-9 px-4 rounded-full font-label-md text-label-md flex items-center justify-center border min-w-[48px] active:scale-95 transition-all ${
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
      </section>

      {/* Available Equipment Section Header */}
      <section className="pt-2">
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-center space-x-1.5">
            <h2 className="text-headline-sm font-headline-sm text-primary font-bold">
              Available Equipment
            </h2>
            <span className="text-label-md font-label-md text-on-surface-variant font-medium">
              ({equipmentList.length} Near You)
            </span>
          </div>
          <button 
            onClick={onOpenFilterModal}
            className="text-primary font-label-sm text-label-sm flex items-center space-x-0.5 min-h-[44px] px-2 rounded-lg hover:bg-surface-container font-bold active:scale-95 transition-transform"
            type="button"
          >
            <span className="material-symbols-outlined text-base">tune</span>
            <span>Filter</span>
          </button>
        </div>

        {/* 2-Column Mobile Grid for Machinery Cards */}
        {equipmentList.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
            <h3 className="text-label-lg font-bold text-on-surface">No machines matched</h3>
            <p className="text-body-sm text-outline">Try clearing filters or search with another term.</p>
            <button
              onClick={() => {
                onSearchChange("");
                onSelectCategory("All");
              }}
              className="mt-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {equipmentList.map((item) => (
              <article 
                key={item.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col justify-between shadow-xs hover:border-primary/50 transition-colors"
              >
                <div>
                  <div className="relative w-full aspect-[16/10] bg-surface-container overflow-hidden">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      src={item.cardImage || item.image}
                      alt={item.title}
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-primary-container text-surface-container-lowest text-label-sm font-label-sm px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse"></span>
                      <span>Available</span>
                    </span>
                    {item.fastDispatch && (
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {item.distance}
                      </span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-label-md font-label-md text-on-surface font-bold leading-tight line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-body-sm font-body-sm text-outline mt-0.5 truncate">
                      {item.hp || item.tagline}
                    </p>
                    <div className="mt-2 text-price-display font-price-display text-primary leading-none font-bold">
                      ₹{item.pricePerDay.toLocaleString()}
                      <span className="text-body-sm font-body-sm text-outline font-normal">/day</span>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 pt-0">
                  <button 
                    onClick={() => onSelectEquipment(item)}
                    className="w-full h-11 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold flex items-center justify-center active:bg-primary-container active:scale-[0.98] transition-all shadow-xs"
                    type="button"
                  >
                    View
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 'How It Works' 3-Step Section */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mt-3 shadow-xs">
        <h2 className="text-headline-sm font-headline-sm text-primary font-bold mb-3">
          How It Works
        </h2>
        <div className="space-y-3">
          {/* Step 1 */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-container text-surface-container-lowest flex items-center justify-center font-label-md text-label-md font-bold flex-shrink-0">
              1
            </div>
            <div className="pt-0.5">
              <h4 className="text-label-md font-label-md text-on-surface font-semibold">
                Find Near Village
              </h4>
              <p className="text-body-sm font-body-sm text-outline leading-tight mt-0.5">
                Choose tractors and implements located within your local radius.
              </p>
            </div>
          </div>
          {/* Divider */}
          <div className="ml-4 border-l border-outline-variant h-2"></div>
          {/* Step 2 */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-container text-surface-container-lowest flex items-center justify-center font-label-md text-label-md font-bold flex-shrink-0">
              2
            </div>
            <div className="pt-0.5">
              <h4 className="text-label-md font-label-md text-on-surface font-semibold">
                Book with Phone Number
              </h4>
              <p className="text-body-sm font-body-sm text-outline leading-tight mt-0.5">
                Direct OTP verification without complex registration forms.
              </p>
            </div>
          </div>
          {/* Divider */}
          <div className="ml-4 border-l border-outline-variant h-2"></div>
          {/* Step 3 */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-container text-surface-container-lowest flex items-center justify-center font-label-md text-label-md font-bold flex-shrink-0">
              3
            </div>
            <div className="pt-0.5">
              <h4 className="text-label-md font-label-md text-on-surface font-semibold">
                Pay at Delivery
              </h4>
              <p className="text-body-sm font-body-sm text-outline leading-tight mt-0.5">
                Inspect equipment at your farm field before UPI or cash payment.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Anchor strip */}
        <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
          <div className="flex items-center space-x-1">
            <span className="material-symbols-outlined text-base text-secondary">shield</span>
            <span className="font-semibold text-xs">100% Machine Inspection</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="material-symbols-outlined text-base text-secondary">support_agent</span>
            <span className="font-semibold text-xs">24/7 Field Support</span>
          </div>
        </div>
      </section>
    </main>
  );
}
