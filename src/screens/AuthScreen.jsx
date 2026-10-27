import React, { useState } from "react";
import confetti from "canvas-confetti";
import { DEMO_TENANT, DEMO_OWNER } from "../data/mockUsers";
import { AVAILABLE_VILLAGES } from "../data/villages";

export default function AuthScreen({ onLoginSuccess }) {
  // Mode: "login" | "register"
  const [authMode, setAuthMode] = useState("login");
  
  // Selected Role: "tenant" | "owner"
  const [selectedRole, setSelectedRole] = useState("tenant");

  // Login Form State
  const [loginPhone, setLoginPhone] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regVillage, setRegVillage] = useState(AVAILABLE_VILLAGES[0].name);
  const [regAadhaar, setRegAadhaar] = useState("");
  const [regLandholding, setRegLandholding] = useState("5.0 Acres");
  const [regMachineType, setRegMachineType] = useState("Mahindra Tractor (45 HP)");
  const [regExpectedRate, setRegExpectedRate] = useState("1800");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Send OTP Simulation
  const handleSendOtp = () => {
    if (!loginPhone || loginPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }
    setErrorMsg("");
    setOtpSent(true);
    setLoginOtp("1234"); // Auto-fill for friendly testing
  };

  // Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Determine user based on role or match demo
      let user;
      if (selectedRole === "owner") {
        user = {
          ...DEMO_OWNER,
          phone: loginPhone || DEMO_OWNER.phone
        };
      } else {
        user = {
          ...DEMO_TENANT,
          phone: loginPhone || DEMO_TENANT.phone
        };
      }

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}

      onLoginSuccess(user);
    }, 600);
  };

  // Register Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim()) {
      setErrorMsg("Please enter your full name");
      return;
    }
    if (!regPhone || regPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const isOwner = selectedRole === "owner";

      const newUser = {
        id: `user-${selectedRole}-${randomNum}`,
        name: regName.trim(),
        phone: regPhone,
        role: selectedRole,
        roleTitle: isOwner ? "Equipment Owner (मशीन मालिक)" : "Tenant Farmer (किरायेदार किसान)",
        village: regVillage,
        district: "Local Mandi Hub",
        farmerId: isOwner ? `CHC-OWNER-${randomNum}` : `KCC-UP-2026-${randomNum}`,
        landholding: isOwner ? "12 Acres" : regLandholding,
        primaryCrops: "Wheat, Paddy, Pulses",
        machineryOwned: isOwner ? regMachineType : null,
        expectedDailyRate: isOwner ? Number(regExpectedRate) : null,
        totalEarnings: isOwner ? 0 : null,
        completedRentals: 0,
        aadhaarVerified: true,
        avatar: regName.trim().slice(0, 2).toUpperCase(),
        memberSince: "Oct 2026"
      };

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}

      onLoginSuccess(newUser);
    }, 800);
  };

  // Instant Demo Login
  const handleQuickDemoLogin = (roleType) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (roleType === "owner") {
        onLoginSuccess(DEMO_OWNER);
      } else {
        onLoginSuccess(DEMO_TENANT);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#E5ECE7] flex flex-col justify-center items-center py-6 px-4 antialiased">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant overflow-hidden flex flex-col animate-fade-in">
        
        {/* Brand Header */}
        <div className="bg-primary-container text-white p-6 text-center relative overflow-hidden">
          {/* Subtle background graphic */}
          <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
            <span className="material-symbols-outlined text-[160px]">agriculture</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white text-primary flex items-center justify-center shadow-md mb-3">
              <span className="material-symbols-outlined text-[34px]">agriculture</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-bold mb-1 shadow-xs">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>National CHC Agri-Rental Portal</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight">KisanRent Portal</h1>
            <p className="text-body-sm text-on-primary-container mt-0.5 max-w-xs">
              India's Dependable Agricultural Machinery & Tractor Network
            </p>
          </div>
        </div>

        {/* Auth Mode Toggle Tabs (Login vs Register) */}
        <div className="flex border-b border-outline-variant bg-surface-bright">
          <button
            type="button"
            onClick={() => { setAuthMode("login"); setErrorMsg(""); }}
            className={`flex-1 py-3 text-label-md font-bold text-center border-b-2 transition-all ${
              authMode === "login"
                ? "border-primary text-primary bg-surface-container-lowest"
                : "border-transparent text-outline hover:text-on-surface"
            }`}
          >
            <span>Log In (लॉग इन)</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("register"); setErrorMsg(""); }}
            className={`flex-1 py-3 text-label-md font-bold text-center border-b-2 transition-all ${
              authMode === "register"
                ? "border-primary text-primary bg-surface-container-lowest"
                : "border-transparent text-outline hover:text-on-surface"
            }`}
          >
            <span>Create Account (नया खाता)</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Role Selection Segmented Cards */}
          <div>
            <label className="text-body-sm font-bold text-on-surface block mb-2">
              Select Your Role (अपनी भूमिका चुनें):
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Option 1: Tenant / Farmer */}
              <button
                type="button"
                onClick={() => setSelectedRole("tenant")}
                className={`p-3 rounded-xl border-2 text-left flex flex-col justify-between transition-all active:scale-[0.98] ${
                  selectedRole === "tenant"
                    ? "border-primary bg-primary-fixed/20 shadow-xs"
                    : "border-outline-variant bg-surface-bright hover:bg-surface-container-low"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedRole === "tenant" ? "bg-primary text-white" : "bg-surface-container text-outline"
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">person_pin_circle</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    selectedRole === "tenant" ? "bg-primary text-white" : "bg-outline-variant text-on-surface-variant"
                  }`}>
                    Renter
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-label-md font-bold text-on-surface">Tenant Farmer</div>
                  <div className="text-[11px] text-secondary font-semibold">किरायेदार किसान</div>
                  <div className="text-[10px] text-outline mt-0.5 leading-tight">Rent tractors & implements for fields</div>
                </div>
              </button>

              {/* Option 2: Equipment Owner */}
              <button
                type="button"
                onClick={() => setSelectedRole("owner")}
                className={`p-3 rounded-xl border-2 text-left flex flex-col justify-between transition-all active:scale-[0.98] ${
                  selectedRole === "owner"
                    ? "border-primary bg-primary-fixed/20 shadow-xs"
                    : "border-outline-variant bg-surface-bright hover:bg-surface-container-low"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedRole === "owner" ? "bg-primary text-white" : "bg-surface-container text-outline"
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    selectedRole === "owner" ? "bg-primary text-white" : "bg-outline-variant text-on-surface-variant"
                  }`}>
                    Owner
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-label-md font-bold text-on-surface">Equipment Owner</div>
                  <div className="text-[11px] text-secondary font-semibold">मशीन मालिक</div>
                  <div className="text-[10px] text-outline mt-0.5 leading-tight">List idle machinery & earn daily rent</div>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          {authMode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-body-sm font-semibold text-on-surface block mb-1">
                  Mobile Number (मोबाइल नंबर)
                </label>
                <div className="flex items-center">
                  <span className="h-11 px-3 bg-surface-container border border-r-0 border-outline-variant rounded-l-lg text-body-sm font-bold text-on-surface-variant flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 10-digit number (e.g. 9876543210)"
                    className="flex-1 h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-r-lg text-body-md focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {otpSent ? (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-body-sm font-semibold text-on-surface">
                      Enter 4-Digit OTP (ओटीपी)
                    </label>
                    <button
                      type="button"
                      onClick={() => setLoginOtp("1234")}
                      className="text-xs font-bold text-primary underline"
                    >
                      Autofill Demo OTP (1234)
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value)}
                    placeholder="1234"
                    className="w-full h-11 px-3 tracking-widest text-center font-bold text-lg bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <p className="text-[11px] text-secondary mt-1 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Demo OTP sent to +91 {loginPhone} (Use: 1234)</span>
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full h-10 border border-primary text-primary hover:bg-primary/5 rounded-lg text-label-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">sms</span>
                  <span>Get Login OTP via SMS</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary-container text-white font-label-lg font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-sm"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                    <span>Verifying Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Log In as {selectedRole === "owner" ? "Equipment Owner" : "Tenant Farmer"}</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Quick 1-Click Demo Profiles */}
              <div className="pt-2 border-t border-outline-variant/60">
                <span className="text-[11px] text-outline font-bold uppercase tracking-wider block text-center mb-2">
                  Instant One-Click Demo Access:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("tenant")}
                    className="p-2 rounded-lg border border-outline-variant bg-surface-bright hover:bg-surface-container text-left flex items-center gap-2 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-on-surface truncate">Baldev Singh</div>
                      <div className="text-[10px] text-outline">Tenant Farmer (किरायेदार)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("owner")}
                    className="p-2 rounded-lg border border-outline-variant bg-surface-bright hover:bg-surface-container text-left flex items-center gap-2 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-secondary text-[20px]">agriculture</span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-on-surface truncate">Ramesh Patel</div>
                      <div className="text-[10px] text-outline">Machine Owner (मालिक)</div>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ================= REGISTER FORM ================= */}
          {authMode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="text-body-sm font-semibold text-on-surface block mb-1">
                  Full Name (पूरा नाम)
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Ramesh Patel / Baldev Singh"
                  className="w-full h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-body-sm font-semibold text-on-surface block mb-1">
                  Mobile Number (मोबाइल नंबर)
                </label>
                <div className="flex items-center">
                  <span className="h-11 px-3 bg-surface-container border border-r-0 border-outline-variant rounded-l-lg text-body-sm font-bold text-on-surface-variant flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                    className="flex-1 h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-r-lg text-body-md focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-body-sm font-semibold text-on-surface block mb-1">
                  Village / Tehsil (गाँव / तहसील)
                </label>
                <select
                  value={regVillage}
                  onChange={(e) => setRegVillage(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {AVAILABLE_VILLAGES.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name} ({v.district})
                    </option>
                  ))}
                </select>
              </div>

              {/* Role-Specific Fields */}
              {selectedRole === "tenant" ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-body-sm font-semibold text-on-surface block mb-1">
                        Landholding
                      </label>
                      <input
                        type="text"
                        value={regLandholding}
                        onChange={(e) => setRegLandholding(e.target.value)}
                        placeholder="e.g. 5 Acres"
                        className="w-full h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-body-sm font-semibold text-on-surface block mb-1">
                        Aadhaar / KCC #
                      </label>
                      <input
                        type="text"
                        value={regAadhaar}
                        onChange={(e) => setRegAadhaar(e.target.value)}
                        placeholder="XXXX-XXXX-9012"
                        className="w-full h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                    <span>Aadhaar qualification entitles you to <strong>₹0 security deposit</strong> on all rentals.</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-body-sm font-semibold text-on-surface block mb-1">
                        Primary Machinery
                      </label>
                      <input
                        type="text"
                        value={regMachineType}
                        onChange={(e) => setRegMachineType(e.target.value)}
                        placeholder="e.g. Mahindra 575 DI"
                        className="w-full h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-body-sm font-semibold text-on-surface block mb-1">
                        Daily Rent (₹/day)
                      </label>
                      <input
                        type="number"
                        value={regExpectedRate}
                        onChange={(e) => setRegExpectedRate(e.target.value)}
                        placeholder="1800"
                        className="w-full h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">currency_rupee</span>
                    <span>Zero platform commission on first 5 rentals. Direct UPI escrow payouts.</span>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary-container text-white font-label-lg font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-sm mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Create My Kisan Profile</span>
                    <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Support */}
        <div className="p-3 bg-surface-container border-t border-outline-variant text-[11px] text-outline text-center flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-secondary">support_agent</span>
          <span>Toll Free Farmer Helpline: <strong>1800-120-7890</strong> (24/7 Field Support)</span>
        </div>
      </div>
    </div>
  );
}
