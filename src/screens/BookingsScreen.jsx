import React, { useState } from "react";

export default function BookingsScreen({
  bookings,
  onCallContact,
  onViewBookingDetails,
  onBookAgain,
  onCancelBooking,
  onDownloadReceipt,
  onExploreEquipment,
  onShowToast
}) {
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "upcoming" | "completed" | "cancelled"
  const [forceEmptyPreview, setForceEmptyPreview] = useState(false);

  const upcomingCount = bookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length;
  const completedCount = bookings.filter(b => b.status === "Completed").length;
  const cancelledCount = bookings.filter(b => b.status === "Cancelled").length;

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === "upcoming") return b.status === "Confirmed" || b.status === "Pending";
    if (activeFilter === "completed") return b.status === "Completed";
    if (activeFilter === "cancelled") return b.status === "Cancelled";
    return true;
  });

  const handleRemindOwner = (booking) => {
    onShowToast({
      message: `SMS reminder sent to owner ${booking.owner?.name || ''} to confirm #${booking.bookingRef}!`
    });
  };

  return (
    <main className="w-full max-w-lg mx-auto pt-16 pb-24 px-4 flex-1 flex flex-col animate-fade-in">
      {/* Subheader Summary & Sync Status */}
      <div className="pt-2 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-headline-md text-on-surface font-bold">
            Bookings History
          </h1>
          <p className="text-body-sm font-body-sm text-outline">
            Manage and track your agricultural machinery rentals
          </p>
        </div>
        <button 
          onClick={() => setForceEmptyPreview(prev => !prev)}
          className="px-2.5 py-1 text-label-sm font-label-sm rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container flex items-center gap-1 active:scale-95 transition-transform font-semibold"
          title="Toggle Empty State Preview"
          type="button"
        >
          <span className="material-symbols-outlined text-[14px]">tune</span>
          <span>{forceEmptyPreview ? "View List" : "View Empty"}</span>
        </button>
      </div>

      {/* Tabs Filter Row */}
      <section className="py-2 mb-2 -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center space-x-2">
        <button 
          onClick={() => { setActiveFilter("all"); setForceEmptyPreview(false); }}
          className={`h-9 px-4 rounded-full font-label-md text-label-md shrink-0 flex items-center transition-all ${
            activeFilter === "all" && !forceEmptyPreview
              ? "bg-primary-container text-surface-container-lowest font-bold shadow-xs"
              : "bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container"
          }`}
          type="button"
        >
          <span>All Bookings ({bookings.length})</span>
        </button>

        <button 
          onClick={() => { setActiveFilter("upcoming"); setForceEmptyPreview(false); }}
          className={`h-9 px-4 rounded-full font-label-md text-label-md shrink-0 flex items-center transition-all ${
            activeFilter === "upcoming" && !forceEmptyPreview
              ? "bg-primary-container text-surface-container-lowest font-bold shadow-xs"
              : "bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container"
          }`}
          type="button"
        >
          <span>Upcoming ({upcomingCount})</span>
        </button>

        <button 
          onClick={() => { setActiveFilter("completed"); setForceEmptyPreview(false); }}
          className={`h-9 px-4 rounded-full font-label-md text-label-md shrink-0 flex items-center transition-all ${
            activeFilter === "completed" && !forceEmptyPreview
              ? "bg-primary-container text-surface-container-lowest font-bold shadow-xs"
              : "bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container"
          }`}
          type="button"
        >
          <span>Completed ({completedCount})</span>
        </button>

        <button 
          onClick={() => { setActiveFilter("cancelled"); setForceEmptyPreview(false); }}
          className={`h-9 px-4 rounded-full font-label-md text-label-md shrink-0 flex items-center transition-all ${
            activeFilter === "cancelled" && !forceEmptyPreview
              ? "bg-primary-container text-surface-container-lowest font-bold shadow-xs"
              : "bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container"
          }`}
          type="button"
        >
          <span>Cancelled ({cancelledCount})</span>
        </button>
      </section>

      {/* Bookings List Container */}
      {!forceEmptyPreview && filteredBookings.length > 0 ? (
        <div className="space-y-4 flex flex-col" id="bookingsList">
          {filteredBookings.map((item) => {
            const isConfirmed = item.status === "Confirmed";
            const isPending = item.status === "Pending";
            const isCompleted = item.status === "Completed";
            const isCancelled = item.status === "Cancelled";

            return (
              <article 
                key={item.id}
                className="bg-surface-container-lowest border border-[#E2E8F0] rounded-[16px] overflow-hidden flex flex-col shadow-xs"
              >
                {/* Card Header Strip */}
                <div className="p-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-surface-container-low/40">
                  <div className="flex items-center space-x-2">
                    <span className="text-body-sm font-body-sm font-bold text-on-surface tracking-tight">
                      {item.bookingRef}
                    </span>
                    <span className="text-outline text-body-sm">•</span>
                    <span className="text-body-sm font-body-sm text-outline">
                      {item.categoryType}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {isConfirmed && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-label-sm font-label-sm font-bold">
                      <span className="material-symbols-outlined text-[14px] text-[#059669]">
                        check_circle
                      </span>
                      <span>Confirmed</span>
                    </div>
                  )}

                  {isPending && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-label-sm font-label-sm font-bold">
                      <span className="material-symbols-outlined text-[14px] text-[#D97706]">
                        hourglass_top
                      </span>
                      <span>Pending</span>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569] text-label-sm font-label-sm font-bold">
                      <span className="material-symbols-outlined text-[14px] text-[#64748B]">
                        task_alt
                      </span>
                      <span>Completed</span>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-label-sm font-label-sm font-bold">
                      <span className="material-symbols-outlined text-[14px] text-red-600">
                        cancel
                      </span>
                      <span>Cancelled</span>
                    </div>
                  )}
                </div>

                {/* Equipment Details Body */}
                <div className="p-4 flex gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-[#E2E8F0] relative">
                    <img 
                      className="w-full h-full object-cover" 
                      src={item.image} 
                      alt={item.equipmentTitle}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-primary/80 py-0.5 text-center">
                      <span className="text-[10px] text-surface-container-lowest font-bold tracking-wider">
                        {item.hpBadge}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold leading-tight line-clamp-1">
                        {item.equipmentTitle}
                      </h2>
                      <div className="mt-1 flex items-center gap-1.5 text-body-sm font-body-sm text-outline">
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          calendar_month
                        </span>
                        <span>{item.dates}</span>
                        <span className="bg-surface-container px-1.5 py-0.2 rounded font-semibold text-on-surface-variant text-[11px]">
                          {item.days} {item.days === 1 ? 'Day' : 'Days'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant truncate">
                      <span className="material-symbols-outlined text-[16px] text-tertiary-container shrink-0">
                        location_on
                      </span>
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Payment Summary Strip */}
                <div className="mx-4 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <div className="text-body-sm font-body-sm text-outline">
                      {isCompleted ? "Total Paid" : "Estimated Total"}
                    </div>
                    <div className="text-headline-sm font-headline-sm font-bold text-primary">
                      ₹{item.estimatedTotal?.toLocaleString()}
                    </div>
                  </div>

                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold border ${
                    item.paymentStatus?.includes("Paid") || item.paidAmount > 0
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : isCompleted 
                      ? "bg-slate-100 border-slate-300 text-slate-700" 
                      : "bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]"
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {item.paymentStatus?.includes("Paid") ? "verified" : "payments"}
                    </span>
                    <span>{item.paymentStatus}</span>
                  </div>
                </div>

                {/* Notice Strip for Pending */}
                {isPending && (
                  <div className="px-4 pt-3">
                    <div className="w-full py-2.5 px-3.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-between text-[#B45309]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] animate-pulse">schedule</span>
                        <span className="text-label-md font-label-md font-semibold">
                          Waiting for Owner Confirmation
                        </span>
                      </div>
                      <button 
                        onClick={() => handleRemindOwner(item)}
                        className="text-label-sm font-label-sm font-bold text-[#92400E] underline active:scale-95"
                        type="button"
                      >
                        Remind
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons based on status */}
                <div className="p-4 pt-3 flex flex-col gap-2">
                  {/* Confirmed actions */}
                  {isConfirmed && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => onCallContact({
                            name: item.owner?.name || "Equipment Owner",
                            phone: item.owner?.phone || "+91 98765 43210",
                            role: "Machine Owner"
                          })}
                          className="h-11 px-3 rounded-lg bg-[#15803D] hover:bg-[#14532D] text-white flex items-center justify-center gap-1.5 text-label-md font-label-md transition-colors shadow-none font-semibold active:scale-95"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">call</span>
                          <span className="truncate">Call {item.owner?.name?.split(" ")[0] || "Owner"}</span>
                        </button>
                        <button 
                          onClick={() => onViewBookingDetails(item)}
                          className="h-11 px-3 rounded-lg bg-white border border-[#CBD5E1] text-on-surface hover:bg-surface-container-low flex items-center justify-center gap-1 text-label-md font-label-md transition-colors font-semibold active:scale-95"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px] text-outline">visibility</span>
                          <span>View Details</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => onCancelBooking(item.id)}
                        className="w-full py-2 text-center text-body-sm font-body-sm text-error hover:underline flex items-center justify-center gap-1 transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[15px]">cancel</span>
                        <span>Cancel Booking</span>
                      </button>
                    </>
                  )}

                  {/* Pending actions */}
                  {isPending && (
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => onViewBookingDetails(item)}
                        className="h-11 px-3 rounded-lg bg-white border border-[#CBD5E1] text-on-surface hover:bg-surface-container-low flex items-center justify-center gap-1 text-label-md font-label-md font-semibold active:scale-95"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">visibility</span>
                        <span>View Details</span>
                      </button>
                      <button 
                        onClick={() => onCancelBooking(item.id)}
                        className="h-11 px-3 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 flex items-center justify-center gap-1 text-label-md font-label-md font-semibold active:scale-95"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                        <span>Withdraw</span>
                      </button>
                    </div>
                  )}

                  {/* Completed actions */}
                  {isCompleted && (
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => onBookAgain(item.equipmentId)}
                        className="h-11 px-3 rounded-lg bg-primary-container text-white hover:bg-[#0F3F22] flex items-center justify-center gap-1.5 text-label-md font-label-md transition-colors font-semibold active:scale-95"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">replay</span>
                        <span>Book Again</span>
                      </button>
                      <button 
                        onClick={() => onDownloadReceipt(item)}
                        className="h-11 px-3 rounded-lg bg-surface-container-lowest border border-[#CBD5E1] text-on-surface-variant hover:bg-surface-container-low flex items-center justify-center gap-1.5 text-label-md font-label-md transition-colors font-semibold active:scale-95"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">receipt_long</span>
                        <span>Download Receipt</span>
                      </button>
                    </div>
                  )}

                  {/* Cancelled actions */}
                  {isCancelled && (
                    <div className="pt-1">
                      <button 
                        onClick={() => onBookAgain(item.equipmentId)}
                        className="w-full h-11 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-primary font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-container active:scale-95"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">replay</span>
                        <span>Re-book Machine</span>
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Clean Empty State Preview Banner */
        <section className="mt-6 p-6 rounded-[16px] bg-surface-container-lowest border border-[#CBD5E1] text-center shadow-xs transition-all duration-200" id="emptyStateBanner">
          <div className="w-14 h-14 rounded-full bg-surface-container mx-auto flex items-center justify-center text-primary mb-3">
            <span className="material-symbols-outlined text-[30px]">manage_search</span>
          </div>
          <h3 className="text-headline-sm font-headline-sm text-on-surface font-bold">
            No active bookings?
          </h3>
          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1 max-w-xs mx-auto">
            Search nearby tractors, harvesters, and rotavators in your village and save booking costs.
          </p>
          <div className="mt-5">
            <button 
              onClick={onExploreEquipment}
              className="w-full h-12 px-5 rounded-lg bg-primary-container hover:bg-[#0F3F22] text-white font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.99] shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              <span>Explore Equipment</span>
            </button>
          </div>
        </section>
      )}

      {/* Trust / Helpline Strip */}
      <div className="mt-6 mb-2 py-3 px-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/60 flex items-center justify-between text-body-sm shadow-xs">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-[18px]">support_agent</span>
          <span className="font-medium text-body-sm">Need help with booking dispute?</span>
        </div>
        <button 
          onClick={() => onCallContact({ name: "KisanRent Dispute Desk", phone: "1800-120-7890", role: "Toll-Free Helpline" })}
          className="text-primary font-bold text-label-sm hover:underline active:scale-95"
          type="button"
        >
          Toll Free Call
        </button>
      </div>
    </main>
  );
}
