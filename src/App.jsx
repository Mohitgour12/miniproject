import React, { useState, useMemo } from "react";
import { EQUIPMENT_LIST } from "./data/equipment";
import { INITIAL_BOOKINGS } from "./data/bookings";
import { AVAILABLE_VILLAGES } from "./data/villages";
import { DEMO_TENANT, DEMO_OWNER } from "./data/mockUsers";

import TopAppBar from "./components/TopAppBar";
import BottomNavBar from "./components/BottomNavBar";
import LocationModal from "./components/LocationModal";
import BookingModal from "./components/BookingModal";
import ReceiptModal from "./components/ReceiptModal";
import FilterModal from "./components/FilterModal";
import DialerModal from "./components/DialerModal";
import HelpModal from "./components/HelpModal";
import Toast from "./components/Toast";

import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import EquipmentListScreen from "./screens/EquipmentListScreen";
import EquipmentDetailScreen from "./screens/EquipmentDetailScreen";
import BookingsScreen from "./screens/BookingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OwnerDashboardScreen from "./screens/OwnerDashboardScreen";

export default function App() {
  // User Authentication State (Starts as null so Login/Register screen is shown first)
  const [currentUser, setCurrentUser] = useState(null);

  // Equipment Fleet State (Allows owners to add new machinery)
  const [equipmentList, setEquipmentList] = useState(EQUIPMENT_LIST);

  // Navigation State
  const [currentTab, setCurrentTab] = useState("home"); // "home" | "owner_dash" | "equipment" | "bookings" | "profile"
  const [currentScreen, setCurrentScreen] = useState("main"); // "main" | "detail"
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Village / Location State
  const [currentVillage, setCurrentVillage] = useState(AVAILABLE_VILLAGES[0]);

  // Inventory & Filter State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    maxPrice: 6000,
    fastDispatchOnly: false,
    sortBy: "relevance"
  });

  // Bookings State
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  // Modals & Overlay State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingConfig, setBookingConfig] = useState(null);
  const [receiptBooking, setReceiptBooking] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [dialerContact, setDialerContact] = useState(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Show Toast helper
  const showToast = (toastObj) => {
    setToast(toastObj);
    setTimeout(() => {
      setToast((prev) => (prev === toastObj ? null : prev));
    }, 3200);
  };

  // Login handler
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === "owner") {
      setCurrentTab("owner_dash");
    } else {
      setCurrentTab("home");
    }
    setCurrentScreen("main");
    showToast({
      type: "success",
      message: `Namaste, ${user.name}! Logged in as ${user.role === "owner" ? "Equipment Owner" : "Tenant Farmer"}.`
    });
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen("main");
    setCurrentTab("home");
    showToast({
      message: "You have been logged out. Select role to log in."
    });
  };

  // Switch role helper
  const handleSwitchRole = () => {
    if (!currentUser) return;
    const isNowOwner = currentUser.role === "tenant";
    const switchedUser = isNowOwner ? {
      ...DEMO_OWNER,
      name: currentUser.name
    } : {
      ...DEMO_TENANT,
      name: currentUser.name
    };
    setCurrentUser(switchedUser);
    setCurrentTab(isNowOwner ? "owner_dash" : "home");
    setCurrentScreen("main");
    showToast({
      type: "success",
      message: `Switched to ${isNowOwner ? "Equipment Owner (मालिक)" : "Tenant Farmer (किरायेदार)"} mode.`
    });
  };

  // Filter & Search Logic
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      if (filters.maxPrice && item.pricePerDay > filters.maxPrice) {
        return false;
      }
      if (filters.fastDispatchOnly && !item.fastDispatch) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q) || item.fullName?.toLowerCase().includes(q);
        const matchesTagline = item.tagline?.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesHp = item.hp?.toLowerCase().includes(q);
        const matchesApp = item.applications?.some(a => a.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTagline && !matchesCategory && !matchesHp && !matchesApp) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price_asc") return a.pricePerDay - b.pricePerDay;
      if (filters.sortBy === "price_desc") return b.pricePerDay - a.pricePerDay;
      return 0; // relevance
    });
  }, [equipmentList, selectedCategory, searchQuery, filters]);

  // Tab switching
  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    setCurrentScreen("main");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Equipment view detail
  const handleSelectEquipment = (item) => {
    setSelectedEquipment(item);
    setCurrentScreen("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Back from detail screen
  const handleBackToCatalog = () => {
    setCurrentScreen("main");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Booking initiation
  const handleOpenBookingModal = (config) => {
    setBookingConfig(config);
    setIsBookingModalOpen(true);
  };

  // Confirm booking
  const handleConfirmBooking = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast({
      type: "success",
      message: `Booking #${newBooking.bookingRef} confirmed successfully!`
    });
    setCurrentTab("bookings");
    setCurrentScreen("main");
  };

  // Owner approves a booking request
  const handleApproveBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "Confirmed" } : b))
    );
    showToast({
      type: "success",
      message: `Booking #${bookingId} approved! Tenant notified via SMS.`
    });
  };

  // Cancel booking
  const handleCancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
    );
    showToast({
      type: "error",
      message: `Booking #${bookingId} has been cancelled.`
    });
  };

  // Owner adds new equipment to the platform
  const handleAddNewMachine = (newMachine) => {
    setEquipmentList((prev) => [newMachine, ...prev]);
  };

  // View booking receipt
  const handleDownloadReceipt = (booking) => {
    setReceiptBooking(booking);
  };

  // Book again shortcut from completed bookings
  const handleBookAgain = (equipmentId) => {
    const found = equipmentList.find((eq) => eq.id === equipmentId) || equipmentList[0];
    handleSelectEquipment(found);
  };

  // Active bookings count for bottom nav badge
  const activeBookingsCount = bookings.filter(
    (b) => b.status === "Confirmed" || b.status === "Pending"
  ).length;

  // IF USER IS NOT LOGGED IN -> RENDER AUTH SCREEN FIRST
  if (!currentUser) {
    return (
      <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  const isOwner = currentUser.role === "owner";

  return (
    <div className="min-h-screen bg-[#E5ECE7] flex flex-col justify-between antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Main Centered Mobile Viewport Frame */}
      <div className="w-full max-w-lg mx-auto bg-[#F1F5F2] min-h-screen flex flex-col relative shadow-xl border-x border-outline-variant/60">
        {/* Top App Bar */}
        <TopAppBar
          currentScreen={currentScreen}
          title={
            currentTab === "owner_dash" 
              ? "Owner Dashboard" 
              : currentTab === "bookings" 
              ? "My Bookings" 
              : currentTab === "profile" 
              ? "Kisan Profile" 
              : "KisanRent"
          }
          currentUser={currentUser}
          onBack={handleBackToCatalog}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          onCallSupport={(contact) => setDialerContact(contact)}
          onLogout={handleLogout}
        />

        {/* Dynamic Screen View */}
        {currentScreen === "detail" ? (
          <EquipmentDetailScreen
            equipment={selectedEquipment}
            currentVillage={currentVillage}
            onBack={handleBackToCatalog}
            onOpenBookingModal={handleOpenBookingModal}
            onCallContact={(contact) => setDialerContact(contact)}
            onShowToast={showToast}
          />
        ) : (
          <>
            {/* Owner Hub Screen */}
            {currentTab === "owner_dash" && (
              <OwnerDashboardScreen
                currentUser={currentUser}
                bookings={bookings}
                equipmentList={equipmentList}
                onCallContact={(contact) => setDialerContact(contact)}
                onApproveBooking={handleApproveBooking}
                onAddNewMachine={handleAddNewMachine}
                onSwitchToTenantView={() => setCurrentTab("equipment")}
                onShowToast={showToast}
              />
            )}

            {/* Tenant Home Screen */}
            {currentTab === "home" && (
              <HomeScreen
                equipmentList={filteredEquipment}
                currentVillage={currentVillage}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
                onSelectEquipment={handleSelectEquipment}
                onOpenFilterModal={() => setIsFilterModalOpen(true)}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}

            {/* Catalog Screen (Accessible to both Tenant and Owner) */}
            {currentTab === "equipment" && (
              <EquipmentListScreen
                equipmentList={filteredEquipment}
                currentVillage={currentVillage}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onOpenFilterModal={() => setIsFilterModalOpen(true)}
                onSelectEquipment={handleSelectEquipment}
              />
            )}

            {/* Bookings & Rental Requests Screen */}
            {currentTab === "bookings" && (
              <BookingsScreen
                bookings={bookings}
                onCallContact={(contact) => setDialerContact(contact)}
                onViewBookingDetails={(booking) => {
                  const eq = equipmentList.find((e) => e.id === booking.equipmentId) || equipmentList[0];
                  handleSelectEquipment(eq);
                }}
                onBookAgain={handleBookAgain}
                onCancelBooking={handleCancelBooking}
                onDownloadReceipt={handleDownloadReceipt}
                onExploreEquipment={() => setCurrentTab("equipment")}
                onShowToast={showToast}
              />
            )}

            {/* Profile Screen */}
            {currentTab === "profile" && (
              <ProfileScreen
                currentUser={currentUser}
                currentVillage={currentVillage}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
                onCallContact={(contact) => setDialerContact(contact)}
                onSwitchRole={handleSwitchRole}
                onLogout={handleLogout}
                onShowToast={showToast}
              />
            )}
          </>
        )}

        {/* Fixed Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={currentScreen === "detail" ? "equipment" : currentTab}
          onSelectTab={handleSelectTab}
          bookingsCount={activeBookingsCount}
          userRole={currentUser?.role}
        />
      </div>

      {/* Modals & Dialogs */}
      <LocationModal
        isOpen={isLocationModalOpen}
        currentVillage={currentVillage}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectVillage={(v) => {
          setCurrentVillage(v);
          showToast({ message: `Delivery Village updated to ${v.name}` });
        }}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        equipment={bookingConfig?.equipment}
        selectedDays={bookingConfig?.selectedDays || 1}
        hasDriver={bookingConfig?.hasDriver || false}
        totalCost={bookingConfig?.totalCost}
        currentVillage={currentVillage}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirmBooking={handleConfirmBooking}
      />

      <ReceiptModal
        booking={receiptBooking}
        onClose={() => setReceiptBooking(null)}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        filters={filters}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          setSelectedCategory(newFilters.category);
          showToast({ message: "Equipment filters applied" });
        }}
      />

      <DialerModal
        contact={dialerContact}
        onClose={() => setDialerContact(null)}
        onShowToast={showToast}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onCallHelpline={() => {
          setDialerContact({
            name: "KisanRent Farmer Helpline",
            phone: "1800-120-7890",
            role: "24/7 Field Support"
          });
        }}
      />
    </div>
  );
}
