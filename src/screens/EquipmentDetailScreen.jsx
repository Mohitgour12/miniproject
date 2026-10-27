import React, { useState } from "react";

export default function EquipmentDetailScreen({
  equipment,
  currentVillage,
  onBack,
  onOpenBookingModal,
  onCallContact,
  onShowToast
}) {
  const [selectedDays, setSelectedDays] = useState(1);
  const [hasDriver, setHasDriver] = useState(false);

  if (!equipment) return null;

  const driverRate = equipment.driverCostPerDay || 400;
  const totalDailyRate = equipment.pricePerDay + (hasDriver ? driverRate : 0);
  const grandTotal = totalDailyRate * selectedDays;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${equipment.fullName || equipment.title} - KisanRent`,
        text: `Rent ${equipment.title} at ₹${equipment.pricePerDay}/day from ${equipment.owner.name} on KisanRent!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      onShowToast({ message: "Equipment link copied to clipboard!" });
    }
  };

  const handleBookNow = () => {
    onOpenBookingModal({
      equipment,
      selectedDays,
      hasDriver,
      totalCost: grandTotal
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-surface-container-lowest min-h-screen relative flex flex-col border-x border-outline-variant pb-36 animate-fade-in">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest flex items-center justify-between px-4 h-14 border-b border-outline-variant">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onBack}
            className="flex items-center text-primary font-label-md text-label-md py-2 pr-1 active:opacity-75 transition-opacity font-bold"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px] mr-1">arrow_back</span>
            <span>Back to Equipment</span>
          </button>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleShare}
            aria-label="Share listing" 
            className="p-2 text-on-surface-variant hover:text-primary active:scale-95 transition-all rounded-full"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">share</span>
          </button>
          <button 
            onClick={() => onCallContact({
              name: equipment.owner.name,
              phone: equipment.owner.phone,
              role: "Equipment Owner"
            })}
            aria-label="Quick call owner" 
            className="p-2 text-primary hover:text-primary-container active:scale-95 transition-all rounded-full"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">call</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 px-4 pt-4 space-y-4">
        {/* Hero Machinery Media Card */}
        <div className="relative rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low shadow-sm">
          <div className="aspect-[16/10] w-full overflow-hidden relative">
            <img 
              className="w-full h-full object-cover" 
              src={equipment.image || equipment.cardImage}
              alt={equipment.fullName || equipment.title}
            />
            {/* Availability Pill Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-primary-container text-surface-container-lowest px-3 py-1 rounded-full text-label-sm font-label-sm shadow-sm font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
              <span>Available Today</span>
            </div>
            {/* Machinery Model Tag */}
            <div className="absolute bottom-3 right-3 bg-inverse-surface/80 backdrop-blur-sm text-surface-container-lowest px-2.5 py-1 rounded-lg text-body-sm font-body-sm font-semibold">
              <span>Verified Asset {equipment.assetId}</span>
            </div>
          </div>

          {/* Location strip inside card */}
          <div className="px-4 py-2 bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant">
            <div className="flex items-center text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-primary text-[18px] mr-1">location_on</span>
              <span className="text-on-surface font-semibold">{equipment.village || currentVillage?.name || "Rampur Village"}</span>
              <span className="text-outline mx-1.5">•</span>
              <span className="text-body-sm font-body-sm text-on-surface-variant">{equipment.distance}</span>
            </div>
            <span className="text-label-sm font-label-sm text-primary uppercase tracking-wider font-bold">
              Fast Dispatch
            </span>
          </div>
        </div>

        {/* Equipment Title and Primary Status */}
        <div className="pt-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-headline-sm font-headline-sm text-on-surface font-bold tracking-tight">
                {equipment.fullName || equipment.title}
              </h1>
              <p className="text-body-md font-body-md text-on-surface-variant mt-0.5">
                {equipment.tagline}
              </p>
            </div>
            {equipment.hp && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-label-sm font-bold bg-surface-container text-primary border border-outline-variant shrink-0">
                {equipment.hp}
              </span>
            )}
          </div>
        </div>

        {/* Rental Pricing Highlight Card */}
        <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-body-sm font-body-sm text-on-surface-variant uppercase font-bold tracking-wide">
                Base Rental Rate
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-price-display font-price-display text-primary font-bold">
                  ₹{equipment.pricePerDay.toLocaleString()}
                </span>
                <span className="text-body-md font-body-md text-on-surface-variant font-medium">/ day</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-secondary-container/30 text-on-secondary-container font-label-sm text-label-sm font-bold border border-secondary-container">
                Zero Commission
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant flex flex-col gap-1 text-body-sm font-body-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-outline">local_gas_station</span>
              <span>Fuel not included in standard rate (Return with same fuel level)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              <span className="text-on-surface font-medium">Security deposit: Nil with Aadhaar authentication</span>
            </div>
          </div>
        </div>

        {/* Owner / Operator Profile Strip Card */}
        <div className="p-3.5 rounded-xl border border-outline-variant bg-surface-container-lowest flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-outline-variant bg-surface-container">
              <img 
                className="w-full h-full object-cover" 
                src={equipment.owner.photo} 
                alt={equipment.owner.name}
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h2 className="text-label-md font-label-md text-on-surface font-bold">
                  {equipment.owner.name}
                </h2>
              </div>
              <div className="flex items-center gap-1 text-body-sm font-body-sm text-secondary font-semibold">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span>Kisan Verified</span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium">
                Owner • {equipment.owner.rentalsCount} Successful Rentals
              </p>
            </div>
          </div>
          <button 
            onClick={() => onCallContact({
              name: equipment.owner.name,
              phone: equipment.owner.phone,
              role: "Verified Equipment Owner"
            })}
            className="h-10 px-3.5 bg-secondary hover:bg-primary-container active:scale-95 text-on-primary font-label-md text-label-md rounded-lg flex items-center gap-1.5 transition-all font-semibold shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>Call Owner</span>
          </button>
        </div>

        {/* Key Specifications Bento Grid */}
        <div className="space-y-2">
          <h3 className="text-label-lg font-label-lg text-on-surface font-bold">
            Key Specifications
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {equipment.specs.map((spec, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-lg border border-outline-variant bg-surface-bright flex flex-col justify-between"
              >
                <div className="flex items-center text-on-surface-variant mb-1">
                  <span className="material-symbols-outlined text-[18px] text-primary mr-1">
                    {spec.icon}
                  </span>
                  <span className="text-body-sm font-body-sm">{spec.label}</span>
                </div>
                <p className="text-label-md font-label-md text-on-surface font-bold">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>

          {/* Suitable Applications Pill Row */}
          {equipment.applications && (
            <div className="p-3 rounded-lg border border-outline-variant bg-surface-bright">
              <span className="text-body-sm font-body-sm text-on-surface-variant font-bold block mb-1.5">
                Suitable Farming Operations
              </span>
              <div className="flex flex-wrap gap-1.5">
                {equipment.applications.map((app, i) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 bg-surface-container rounded-md text-body-sm font-body-sm text-on-surface font-medium border border-outline-variant"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Included Attachments Section */}
        {equipment.attachments && (
          <div className="space-y-2">
            <h3 className="text-label-lg font-label-lg text-on-surface font-bold">
              Included Attachments
            </h3>
            <div className="p-3.5 rounded-xl border border-outline-variant bg-surface-bright">
              <ul className="space-y-2">
                {equipment.attachments.map((att, i) => (
                  <li key={i} className="flex items-center text-body-md font-body-md text-on-surface">
                    <span className="material-symbols-outlined text-secondary mr-2 text-[20px]">
                      check
                    </span>
                    <span>{att}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Interactive Duration Stepper */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-label-lg font-label-lg text-on-surface font-bold">
              Select Rental Duration
            </h3>
            <span className="text-body-sm font-semibold text-primary">
              10 working hours/day
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-outline-variant bg-surface-bright flex items-center justify-between">
            <div>
              <span className="text-label-md font-bold text-on-surface block">
                Number of Days
              </span>
              <span className="text-body-sm text-outline">
                ₹{totalDailyRate.toLocaleString()} × {selectedDays} {selectedDays === 1 ? 'day' : 'days'}
              </span>
            </div>

            <div className="flex items-center space-x-3 bg-surface-container-lowest border border-outline-variant rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSelectedDays(prev => Math.max(1, prev - 1))}
                disabled={selectedDays <= 1}
                className="w-10 h-10 rounded-md bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-primary disabled:opacity-40 transition-colors"
                aria-label="Decrease days"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <span className="text-headline-sm font-bold text-on-surface w-8 text-center">
                {selectedDays}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDays(prev => Math.min(30, prev + 1))}
                className="w-10 h-10 rounded-md bg-primary text-white hover:bg-primary-container flex items-center justify-center font-bold active:scale-95 transition-transform"
                aria-label="Increase days"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Driver Selection Option Tile */}
        <div className="space-y-2">
          <h3 className="text-label-lg font-label-lg text-on-surface font-bold">
            Operator Preference
          </h3>
          <div className="space-y-2" id="operator-options">
            {/* Option 1: Without Driver */}
            <label 
              onClick={() => setHasDriver(false)}
              className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all ${
                !hasDriver 
                  ? "border-2 border-primary bg-primary-fixed/20 shadow-xs" 
                  : "border border-outline-variant bg-surface-bright hover:bg-surface-container-low"
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  checked={!hasDriver}
                  onChange={() => setHasDriver(false)}
                  className="w-5 h-5 text-primary focus:ring-primary border-outline" 
                  name="operator_choice" 
                  type="radio"
                />
                <div>
                  <p className="text-label-md font-label-md text-on-surface font-bold">
                    Self-Driven (Without Driver)
                  </p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    Farmer drives personally
                  </p>
                </div>
              </div>
              <span className="text-label-md font-label-md font-bold text-primary">₹0 extra</span>
            </label>

            {/* Option 2: With Driver */}
            <label 
              onClick={() => setHasDriver(true)}
              className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all ${
                hasDriver 
                  ? "border-2 border-primary bg-primary-fixed/20 shadow-xs" 
                  : "border border-outline-variant bg-surface-bright hover:bg-surface-container-low"
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  checked={hasDriver}
                  onChange={() => setHasDriver(true)}
                  className="w-5 h-5 text-primary focus:ring-primary border-outline" 
                  name="operator_choice" 
                  type="radio"
                />
                <div>
                  <p className="text-label-md font-label-md text-on-surface font-bold">
                    With Experienced Driver
                  </p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    Professional operator provided
                  </p>
                </div>
              </div>
              <span className="text-label-md font-label-md font-bold text-secondary">
                +₹{driverRate} / day
              </span>
            </label>
          </div>
        </div>

        {/* Rental Terms & Rules */}
        <div className="space-y-2 pb-6">
          <h3 className="text-label-lg font-label-lg text-on-surface font-bold">
            Rental Terms & Handover
          </h3>
          <div className="p-3.5 rounded-xl border border-outline-variant bg-surface-container-lowest space-y-2.5 shadow-xs">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                local_shipping
              </span>
              <p className="text-body-md font-body-md text-on-surface">
                <strong>Free delivery within 5 km</strong> of Rampur village center. ₹35/km applies beyond radius.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                badge
              </span>
              <p className="text-body-md font-body-md text-on-surface">
                <strong>Government ID proof required</strong> (Aadhaar or Voter card) during field handover.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                schedule
              </span>
              <p className="text-body-md font-body-md text-on-surface">
                Daily slot spans <strong>10 working hours</strong> from initial ignition log.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Booking Action Bar (Docked right above BottomNavBar) */}
      <section className="fixed bottom-16 left-0 w-full z-40 bg-surface-container-lowest border-t border-outline-variant shadow-sheet max-w-lg mx-auto right-0">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <span className="text-body-sm font-body-sm text-on-surface-variant block">
              Total Rent ({selectedDays} {selectedDays === 1 ? 'day' : 'days'})
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-price-display font-price-display text-primary font-bold">
                ₹{grandTotal.toLocaleString()}
              </span>
              <span className="text-body-sm font-body-sm text-on-surface-variant">total</span>
            </div>
          </div>
          <button 
            onClick={handleBookNow}
            className="flex-1 h-12 bg-primary hover:bg-primary-container active:scale-[0.98] text-on-primary font-label-lg text-label-lg rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm font-bold"
            type="button"
          >
            <span>Book Equipment Now</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
}
