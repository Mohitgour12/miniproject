import React from "react";

export default function BottomNavBar({ activeTab, onSelectTab, bookingsCount, userRole }) {
  const isOwner = userRole === "owner";

  const tabs = isOwner ? [
    { id: "owner_dash", label: "Owner Hub", icon: "dashboard" },
    { id: "equipment", label: "Catalog", icon: "agriculture" },
    { id: "bookings", label: "Requests", icon: "calendar_month", badge: bookingsCount },
    { id: "profile", label: "Profile", icon: "person" }
  ] : [
    { id: "home", label: "Home", icon: "home" },
    { id: "equipment", label: "Equipment", icon: "agriculture" },
    { id: "bookings", label: "My Bookings", icon: "calendar_month", badge: bookingsCount },
    { id: "profile", label: "Profile", icon: "person" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-3 h-16 bg-surface-container-lowest border-t border-outline-variant max-w-lg mx-auto right-0 shadow-[0_-2px_6px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] relative transition-transform active:scale-95 duration-100 ${
              isActive 
                ? "text-primary font-bold after:content-[''] after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-0.5" 
                : "text-on-surface-variant font-medium hover:text-primary"
            }`}
            type="button"
          >
            <div className="relative flex items-center justify-center">
              <span 
                className={`material-symbols-outlined text-[24px] ${isActive ? "fill-icon" : ""}`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-secondary text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-label-sm font-label-sm mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
