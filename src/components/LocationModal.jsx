import React, { useState } from "react";
import { AVAILABLE_VILLAGES } from "../data/villages";

export default function LocationModal({ isOpen, currentVillage, onClose, onSelectVillage }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customVillage, setCustomVillage] = useState("");

  if (!isOpen) return null;

  const filtered = AVAILABLE_VILLAGES.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customVillage.trim()) {
      onSelectVillage({
        id: "custom-" + Date.now(),
        name: customVillage.trim(),
        distance: "Local field",
        district: "Local Mandi Hub",
        hubAvailable: true
      });
      setCustomVillage("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl border border-outline-variant shadow-xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        role="dialog" 
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-bright">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">location_on</span>
            <h3 className="text-headline-sm font-bold text-on-surface">Select Delivery Village</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Search & Custom Input */}
        <div className="p-4 border-b border-outline-variant space-y-3 bg-surface-container-low/40">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">search</span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search village or district..."
              className="w-full h-11 pl-10 pr-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input 
              type="text"
              value={customVillage}
              onChange={(e) => setCustomVillage(e.target.value)}
              placeholder="Or enter your village name..."
              className="flex-1 h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!customVillage.trim()}
              className="h-10 px-3 bg-primary text-white rounded-lg text-label-sm font-semibold disabled:opacity-50 flex items-center gap-1 active:scale-95"
            >
              Set
            </button>
          </form>
        </div>

        {/* List of Villages */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          <span className="text-[12px] font-bold text-outline px-2 uppercase tracking-wider block">
            Government Verified Hub Centers ({filtered.length})
          </span>

          {filtered.map((v) => {
            const isSelected = currentVillage?.name === v.name;
            return (
              <button
                key={v.id}
                onClick={() => {
                  onSelectVillage(v);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all active:scale-[0.99] ${
                  isSelected 
                    ? "border-primary bg-primary-container/10 font-bold" 
                    : "border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`material-symbols-outlined text-[20px] mt-0.5 ${isSelected ? "text-primary" : "text-outline"}`}>
                    {isSelected ? "check_circle" : "storefront"}
                  </span>
                  <div>
                    <div className="text-body-md text-on-surface font-semibold">{v.name}</div>
                    <div className="text-body-sm text-outline flex items-center gap-2 mt-0.5">
                      <span>{v.district}</span>
                      <span>•</span>
                      <span>{v.distance} from nearest depot</span>
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <span className="text-primary text-xs font-bold bg-primary-fixed px-2 py-0.5 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="text-outline text-xs">
                    Select
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-surface-container border-t border-outline-variant text-[12px] text-outline text-center">
          🚜 All machinery rates include free dispatch within 5 km of chosen village center.
        </div>
      </div>
    </div>
  );
}
