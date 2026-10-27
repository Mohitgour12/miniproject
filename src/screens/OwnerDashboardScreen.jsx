import React, { useState } from "react";

export default function OwnerDashboardScreen({
  currentUser,
  bookings,
  equipmentList,
  onCallContact,
  onApproveBooking,
  onAddNewMachine,
  onSwitchToTenantView,
  onShowToast
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Tractors");
  const [newRate, setNewRate] = useState("1800");
  const [newHp, setNewHp] = useState("45 HP");

  // Filter requests that belong to this owner or are pending
  const pendingRequests = bookings.filter(b => b.status === "Pending" || b.status === "Confirmed");
  const ownerMachines = equipmentList.slice(0, 3); // Owner's fleet

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    onAddNewMachine({
      id: "machine-" + Date.now(),
      title: newTitle,
      fullName: newTitle,
      tagline: `${newHp} agricultural equipment owned by ${currentUser.name}`,
      category: newCategory,
      pricePerDay: Number(newRate),
      hp: newHp,
      village: currentUser.village || "Rampur Village",
      distance: "At owner hub",
      fastDispatch: true,
      available: true,
      driverCostPerDay: 400,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiJO_bXLL-vUZWU0fkiHYeH4e0YoXqNU5FnYAPh-z7EqiSMPYgIASGb5eFnMnum9ZNOIUTT5BgTs8MEwqgyubk-fKB-45g2kBJs9o_kv6oncMt40gvm5eUvatIsSVmBRNF0ljO-MY-v7TJdUE9xfqeTWEayVztrUT2p6E1FPtxxOXhml0PkGs0h95d3Uqh7el7gAzM2E5YQksmVK8ThP-Il3OBy1LUCmLgrR7lq-Z9hNYK7KQ5Q-R7",
      owner: {
        name: currentUser.name,
        phone: currentUser.phone,
        verified: true,
        rentalsCount: 0
      },
      specs: [
        { label: "Power Rating", value: newHp, icon: "speed" },
        { label: "Dispatch Hub", value: currentUser.village || "Local Mandi", icon: "location_on" }
      ]
    });

    setShowAddModal(false);
    setNewTitle("");
    onShowToast({ message: `Successfully listed ${newTitle} for rent!` });
  };

  return (
    <main className="w-full max-w-lg mx-auto pt-16 pb-24 px-4 flex-1 flex flex-col space-y-4 animate-fade-in">
      {/* Owner Profile Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {currentUser.avatar || "RP"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-headline-sm font-bold text-on-surface">
                  {currentUser.name}
                </h2>
                <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
              </div>
              <p className="text-body-sm text-outline">
                Owner ID: {currentUser.farmerId || "CHC-OWNER-4412"} • {currentUser.village}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
            Verified Partner
          </span>
        </div>

        {/* Earnings & Stats Bento */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-outline-variant text-center">
          <div className="p-2.5 bg-surface-bright rounded-xl border border-outline-variant">
            <span className="text-[11px] text-outline block font-semibold">Total Revenue</span>
            <div className="text-label-lg font-bold text-primary mt-0.5">
              ₹{(currentUser.totalEarnings || 28400).toLocaleString()}
            </div>
          </div>
          <div className="p-2.5 bg-surface-bright rounded-xl border border-outline-variant">
            <span className="text-[11px] text-outline block font-semibold">Rentals Done</span>
            <div className="text-label-lg font-bold text-on-surface mt-0.5">
              {currentUser.completedRentals || 48}
            </div>
          </div>
          <div className="p-2.5 bg-surface-bright rounded-xl border border-outline-variant">
            <span className="text-[11px] text-outline block font-semibold">Rating</span>
            <div className="text-label-lg font-bold text-amber-600 mt-0.5 flex items-center justify-center gap-0.5">
              <span>★</span>
              <span>4.9</span>
            </div>
          </div>
        </div>
      </div>

      {/* Switch to Browse as Tenant Shortcut */}
      <div className="p-3 bg-primary-container text-white rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px]">storefront</span>
          <div className="text-xs">
            <div className="font-bold">Browse Tenant Marketplace</div>
            <div className="text-on-primary-container text-[11px]">Check market rental rates near your fields</div>
          </div>
        </div>
        <button
          onClick={onSwitchToTenantView}
          className="px-3 py-1.5 bg-white text-primary rounded-lg text-xs font-bold active:scale-95"
        >
          View Catalog
        </button>
      </div>

      {/* Incoming Booking Requests from Tenants */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-label-lg font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">mark_email_unread</span>
            <span>Tenant Booking Requests ({pendingRequests.length})</span>
          </h3>
          <span className="text-xs text-outline font-semibold">Active Season</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-xl text-center text-outline text-body-sm">
            No pending requests at the moment.
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingRequests.map((req) => (
              <div 
                key={req.id} 
                className="p-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl space-y-2.5 shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-outline">{req.bookingRef}</span>
                    <h4 className="text-label-md font-bold text-on-surface">{req.equipmentTitle}</h4>
                    <p className="text-body-sm text-outline mt-0.5">
                      Rented by: <strong>{req.farmer?.name || "Baldev Singh"}</strong> ({req.days} Day)
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      📍 {req.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-label-lg font-bold text-primary">
                      ₹{req.estimatedTotal?.toLocaleString()}
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                      req.status === "Confirmed" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {req.status === "Confirmed" ? "Dispatch Ready" : "Awaiting Confirmation"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant flex gap-2">
                  <button
                    onClick={() => onCallContact({
                      name: req.farmer?.name || "Tenant Farmer",
                      phone: req.farmer?.phone || "9876543210",
                      role: "Tenant Farmer"
                    })}
                    className="flex-1 h-9 bg-surface-bright border border-outline-variant rounded-lg text-xs font-bold flex items-center justify-center gap-1 text-on-surface hover:bg-surface-container active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>Call Tenant</span>
                  </button>

                  {req.status === "Pending" ? (
                    <button
                      onClick={() => onApproveBooking(req.id)}
                      className="flex-1 h-9 bg-primary text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 active:scale-95 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Accept & Book</span>
                    </button>
                  ) : (
                    <span className="flex-1 h-9 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-emerald-200">
                      <span className="material-symbols-outlined text-[16px]">done_all</span>
                      <span>Confirmed</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Owner Equipment Fleet */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-label-lg font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">garage_home</span>
            <span>My Machinery Fleet</span>
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Add Machinery</span>
          </button>
        </div>

        <div className="space-y-2">
          {ownerMachines.map((m) => (
            <div 
              key={m.id}
              className="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img 
                  src={m.cardImage || m.image} 
                  alt={m.title}
                  className="w-14 h-14 rounded-lg object-cover border border-outline-variant shrink-0" 
                />
                <div className="min-w-0">
                  <h4 className="text-label-md font-bold text-on-surface truncate">{m.title}</h4>
                  <p className="text-xs text-outline">{m.hp} • ₹{m.pricePerDay}/day</p>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span>Ready for Rental</span>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={() => onShowToast({ message: `Status updated for ${m.title}` })}
                  className="px-2.5 py-1 text-xs font-bold border border-outline-variant rounded-lg hover:bg-surface-container text-on-surface-variant active:scale-95"
                >
                  Edit Rate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Machinery Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-headline-sm font-bold text-on-surface">List New Machinery</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-outline">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Machinery Model Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Swaraj 744 FE Tractor"
                  className="w-full h-10 px-3 bg-surface-container-lowest border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-10 px-2 bg-surface-container-lowest border rounded-lg text-xs"
                  >
                    <option value="Tractors">Tractor</option>
                    <option value="Rotavators">Rotavator</option>
                    <option value="Seed Drills">Seed Drill</option>
                    <option value="Harvesters">Harvester</option>
                    <option value="Threshers">Thresher</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Horsepower / Spec</label>
                  <input
                    type="text"
                    value={newHp}
                    onChange={(e) => setNewHp(e.target.value)}
                    placeholder="e.g. 48 HP"
                    className="w-full h-10 px-3 bg-surface-container-lowest border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Daily Rent Rate (₹/day)</label>
                <input
                  type="number"
                  required
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="1800"
                  className="w-full h-10 px-3 bg-surface-container-lowest border rounded-lg text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-primary text-white font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Publish to KisanRent Hub</span>
                <span className="material-symbols-outlined text-[18px]">publish</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
