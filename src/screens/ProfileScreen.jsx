import React, { useState } from "react";

export default function ProfileScreen({
  currentUser,
  currentVillage,
  onOpenLocationModal,
  onCallContact,
  onSwitchRole,
  onLogout,
  onShowToast
}) {
  const [language, setLanguage] = useState("en"); // "en" | "hi"

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    onShowToast({
      message: lang === "hi" ? "भाषा बदलकर हिन्दी कर दी गई है" : "Language set to English"
    });
  };

  const isOwner = currentUser?.role === "owner";

  return (
    <main className="w-full max-w-lg mx-auto pt-16 pb-24 px-4 flex-1 flex flex-col space-y-4 animate-fade-in">
      {/* Profile Header Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-2xl border-2 border-primary shrink-0 shadow-sm">
            {currentUser?.avatar || "KS"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-headline-sm font-bold text-on-surface truncate">
                {currentUser?.name || "Kisan User"}
              </h2>
              <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
            <p className="text-body-sm text-outline mt-0.5">
              ID: {currentUser?.farmerId || currentUser?.ownerId || "KCC-UP-9120"}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[11px] font-bold">
                <span className="material-symbols-outlined text-[12px]">check</span>
                <span>{isOwner ? "Verified Equipment Owner" : "Kisan Verified Tenant"}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold">
                <span>Aadhaar e-KYC</span>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Village & Specs Info */}
        <div className="mt-4 pt-3 border-t border-outline-variant grid grid-cols-2 gap-3 text-body-sm">
          <div className="p-2.5 bg-surface-bright rounded-xl border border-outline-variant">
            <span className="text-outline text-xs block font-semibold">Registered Location</span>
            <div className="font-bold text-on-surface truncate mt-0.5">
              {currentUser?.village || currentVillage?.name || "Rampur Village"}
            </div>
            <button 
              onClick={onOpenLocationModal}
              className="text-primary text-xs font-bold underline mt-1 block"
            >
              Change Location
            </button>
          </div>

          <div className="p-2.5 bg-surface-bright rounded-xl border border-outline-variant">
            <span className="text-outline text-xs block font-semibold">
              {isOwner ? "Machinery Revenue" : "Landholding"}
            </span>
            <div className="font-bold text-on-surface mt-0.5">
              {isOwner ? `₹${(currentUser?.totalEarnings || 28400).toLocaleString()}` : (currentUser?.landholding || "8.5 Acres")}
            </div>
            <span className="text-xs text-secondary font-semibold mt-1 block">
              {isOwner ? `${currentUser?.completedRentals || 48} Successful Rentals` : "Govt. Subsidy Eligible"}
            </span>
          </div>
        </div>

        {/* Quick Role Switcher Button */}
        <div className="mt-3 pt-3 border-t border-outline-variant flex items-center justify-between">
          <div className="text-xs text-outline">
            Active Mode: <strong className="text-on-surface">{isOwner ? "Equipment Owner" : "Tenant Farmer"}</strong>
          </div>
          <button
            onClick={onSwitchRole}
            className="px-3 py-1 bg-surface-bright border border-outline-variant text-primary text-xs font-bold rounded-lg hover:bg-surface-container active:scale-95 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
            <span>Switch to {isOwner ? "Tenant Mode" : "Owner Mode"}</span>
          </button>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
        <h3 className="text-label-md font-bold text-on-surface mb-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[20px]">translate</span>
          <span>App Language / भाषा चुनें</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => toggleLanguage("en")}
            className={`h-11 rounded-lg border font-bold text-sm flex items-center justify-center transition-all ${
              language === "en"
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-surface-bright text-on-surface border-outline-variant"
            }`}
          >
            English
          </button>
          <button
            onClick={() => toggleLanguage("hi")}
            className={`h-11 rounded-lg border font-bold text-sm flex items-center justify-center transition-all ${
              language === "hi"
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-surface-bright text-on-surface border-outline-variant"
            }`}
          >
            हिन्दी (Hindi)
          </button>
        </div>
      </div>

      {/* Account Actions & Support */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden divide-y divide-outline-variant/60 shadow-xs">
        <button
          onClick={() => onCallContact({ name: "KisanRent Farmer Support", phone: "1800-120-7890", role: "Toll-Free 24/7 Helpline" })}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[22px]">support_agent</span>
            <div>
              <span className="text-body-md font-bold text-on-surface block">24/7 Field Support Desk</span>
              <span className="text-xs text-outline">Toll-Free Helpline 1800-120-7890</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline">chevron_right</span>
        </button>

        <button
          onClick={() => onShowToast({ message: "Aadhaar e-KYC: Verified and linked with National Agritech Registry." })}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
            <div>
              <span className="text-body-md font-bold text-on-surface block">Kisan ID & Aadhaar KYC Details</span>
              <span className="text-xs text-secondary font-semibold">Active • Zero Deposit Eligible</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline">chevron_right</span>
        </button>

        <button
          onClick={() => onShowToast({ message: "Terms of Custom Hiring Center (CHC) verified." })}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[22px]">shield</span>
            <div>
              <span className="text-body-md font-bold text-on-surface block">Machine Insurance & Security Terms</span>
              <span className="text-xs text-outline">Govt. approved custom hiring center terms</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline">chevron_right</span>
        </button>

        {/* LOGOUT BUTTON */}
        <button
          onClick={onLogout}
          className="w-full p-4 flex items-center justify-between text-left text-red-600 hover:bg-red-50 transition-colors font-bold"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600 text-[22px]">logout</span>
            <div>
              <span className="text-body-md font-bold text-red-600 block">Log Out of Profile (लॉग आउट)</span>
              <span className="text-xs text-red-500 font-normal">Switch account or login with a different role</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-red-600">chevron_right</span>
        </button>
      </div>

      {/* App Version Info */}
      <div className="text-center text-xs text-outline pt-2 pb-4">
        <p className="font-semibold">KisanRent Farm Machinery v2.4.0</p>
        <p>Built with institutional reliability for Indian agriculture</p>
      </div>
    </main>
  );
}
