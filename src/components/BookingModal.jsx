import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import { buildUPIUrl, DEFAULT_UPI_CONFIG, generateMockUTR } from "../utils/upi";

export default function BookingModal({
  isOpen,
  equipment,
  selectedDays,
  hasDriver,
  totalCost,
  currentVillage,
  onClose,
  onConfirmBooking
}) {
  // Form State
  const [farmerName, setFarmerName] = useState("Baldev Singh");
  const [farmerPhone, setFarmerPhone] = useState("9876543210");
  const [fieldAddress, setFieldAddress] = useState("East Field near Canal Gate, Plot 14");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [aadhaarVerified, setAadhaarVerified] = useState(true);
  const [paymentChoice, setPaymentChoice] = useState("upi"); // Default to UPI (Option 2)

  // Gateway & Flow Steps: "form" | "upi_gateway" | "success"
  const [modalStep, setModalStep] = useState("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // UPI Gateway State
  const [merchantVpa, setMerchantVpa] = useState(DEFAULT_UPI_CONFIG.upiId);
  const [isEditingVpa, setIsEditingVpa] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [utrError, setUtrError] = useState("");
  const [activeBookingRef, setActiveBookingRef] = useState("");
  const [upiTimer, setUpiTimer] = useState(300); // 5 minutes countdown

  // Timer countdown for UPI QR
  useEffect(() => {
    let interval = null;
    if (modalStep === "upi_gateway" && upiTimer > 0) {
      interval = setInterval(() => {
        setUpiTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [modalStep, upiTimer]);

  if (!isOpen || !equipment) return null;

  const baseEquipmentTotal = equipment.pricePerDay * selectedDays;
  const driverTotal = hasDriver ? equipment.driverCostPerDay * selectedDays : 0;
  const grandTotal = totalCost || (baseEquipmentTotal + driverTotal);

  // Format countdown mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Generate UPI deep-link URL
  const upiIntentUrl = buildUPIUrl({
    upiId: merchantVpa,
    payeeName: "KisanRent Agri Hub",
    amount: grandTotal,
    transactionNote: `Rent ${equipment.title.slice(0, 20)} (${selectedDays}d)`,
    transactionRef: activeBookingRef || "KR-ADVANCE"
  });

  const handleCopyVpa = () => {
    try {
      navigator.clipboard.writeText(merchantVpa);
      setCopiedVpa(true);
      setTimeout(() => setCopiedVpa(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const handleAutoFillDemoUtr = () => {
    setUtrNumber(generateMockUTR());
    setUtrError("");
  };

  // Step 1 Submit: Form -> UPI or POD
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!farmerName || !farmerPhone) return;

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const generatedRef = `#KR-2026-${randomId}`;
    setActiveBookingRef(generatedRef);

    if (paymentChoice === "upi") {
      // Transition to interactive Dynamic UPI Gateway
      setUpiTimer(300);
      setUtrNumber("");
      setUtrError("");
      setModalStep("upi_gateway");
    } else {
      // Pay on Delivery instant confirmation
      processFinalBooking({
        bookingRef: generatedRef,
        isUpiPaid: false,
        utr: null
      });
    }
  };

  // Step 2 Submit: Verify UPI & Finalize
  const handleVerifyUpiPayment = (e) => {
    e?.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (cleanUtr && cleanUtr.length < 8) {
      setUtrError("Please enter a valid 12-digit UPI UTR number or use Quick Demo.");
      return;
    }

    const finalUtr = cleanUtr || generateMockUTR();
    setIsSubmitting(true);

    setTimeout(() => {
      processFinalBooking({
        bookingRef: activeBookingRef || `#KR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        isUpiPaid: true,
        utr: finalUtr
      });
    }, 800);
  };

  const processFinalBooking = ({ bookingRef, isUpiPaid, utr }) => {
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const newBooking = {
      id: bookingRef.replace("#", ""),
      bookingRef: bookingRef,
      equipmentId: equipment.id,
      equipmentTitle: equipment.fullName || equipment.title,
      categoryType: `${equipment.category.slice(0, -1) || equipment.category} Rental`,
      hpBadge: equipment.hp || "Verified",
      status: "Confirmed",
      dates: `${startDate} (${selectedDays} ${selectedDays === 1 ? "Day" : "Days"})`,
      days: selectedDays,
      location: `${currentVillage?.name || "Rampur Village"} (${fieldAddress})`,
      ratePerDay: equipment.pricePerDay,
      driverCostPerDay: hasDriver ? equipment.driverCostPerDay : 0,
      hasDriver: hasDriver,
      estimatedTotal: grandTotal,
      paidAmount: isUpiPaid ? grandTotal : 0,
      paymentStatus: isUpiPaid ? "Paid via UPI" : "Pay on Delivery",
      paymentMethod: isUpiPaid ? `Dynamic UPI (${merchantVpa})` : "Cash on Field Delivery",
      upiUtr: isUpiPaid ? utr : null,
      image: equipment.image || equipment.cardImage,
      owner: equipment.owner,
      farmer: {
        name: farmerName,
        phone: farmerPhone,
        aadhaarVerified: aadhaarVerified
      },
      createdDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      notes: isUpiPaid
        ? `100% Advance payment verified via UPI (UTR: ${utr}). Zero deposit hold applied.`
        : "Zero security deposit verified via Aadhaar KYC. Field inspection scheduled."
    };

    setBookingSuccess(newBooking);
    setIsSubmitting(false);
    setModalStep("success");
    onConfirmBooking(newBooking);
  };

  const handleFinish = () => {
    setBookingSuccess(null);
    setModalStep("form");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl border border-outline-variant shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-slide-up"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-primary-container text-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">
              {modalStep === "upi_gateway" ? "qr_code_scanner" : modalStep === "success" ? "task_alt" : "agriculture"}
            </span>
            <div>
              <h3 className="text-headline-sm font-bold leading-tight">
                {modalStep === "upi_gateway"
                  ? "UPI Payment Gateway"
                  : modalStep === "success"
                  ? "Booking Confirmed!"
                  : "Book Farm Machinery"}
              </h3>
              {modalStep === "upi_gateway" && (
                <p className="text-[11px] text-white/80">0% Transaction Fee • NPCI UPI Deep Link</p>
              )}
            </div>
          </div>
          {modalStep !== "success" && (
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          )}
        </div>

        {/* STEP 1: FORM VIEW */}
        {modalStep === "form" && (
          <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Equipment Snapshot Card */}
            <div className="p-3 rounded-xl bg-surface-bright border border-outline-variant flex items-center gap-3">
              <img 
                src={equipment.image || equipment.cardImage} 
                alt={equipment.title}
                className="w-16 h-16 rounded-lg object-cover border border-outline-variant shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-label-md font-bold text-on-surface truncate">{equipment.title}</h4>
                  <span className="text-[11px] font-bold px-1.5 py-0.2 bg-primary/10 text-primary rounded">
                    {equipment.hp}
                  </span>
                </div>
                <p className="text-body-sm text-outline mt-0.5 truncate">
                  Owner: {equipment.owner.name} • {equipment.distance}
                </p>
                <div className="text-label-md font-bold text-primary mt-1">
                  ₹{equipment.pricePerDay}/day
                  {hasDriver && <span className="text-secondary font-medium text-xs ml-1">(+₹{equipment.driverCostPerDay} Driver)</span>}
                </div>
              </div>
            </div>

            {/* Farmer Contact Details */}
            <div className="space-y-3">
              <h4 className="text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">badge</span>
                <span>Farmer Identification</span>
              </h4>

              <div>
                <label className="text-body-sm font-semibold text-on-surface block mb-1">
                  Farmer Full Name
                </label>
                <input 
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Baldev Singh"
                  className="w-full h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-body-sm font-semibold text-on-surface block mb-1">
                  Mobile Number (For Delivery SMS & Call)
                </label>
                <div className="flex items-center">
                  <span className="h-11 px-3 bg-surface-container border border-r-0 border-outline-variant rounded-l-lg text-body-sm text-on-surface-variant flex items-center font-semibold">
                    +91
                  </span>
                  <input 
                    type="tel"
                    required
                    maxLength={10}
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="9876543210"
                    className="flex-1 h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-r-lg text-body-md focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block mb-1">
                    Rental Start Date
                  </label>
                  <input 
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block mb-1">
                    Rental Duration
                  </label>
                  <div className="h-11 px-3 bg-surface-container border border-outline-variant rounded-lg text-body-sm flex items-center font-bold text-primary">
                    {selectedDays} Day(s) Selected
                  </div>
                </div>
              </div>

              <div>
                <label className="text-body-sm font-semibold text-on-surface block mb-1">
                  Delivery Field Landmark
                </label>
                <input 
                  type="text"
                  required
                  value={fieldAddress}
                  onChange={(e) => setFieldAddress(e.target.value)}
                  placeholder="e.g. East Field, Near Water Pump / Tube well"
                  className="w-full h-11 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Aadhaar Zero Deposit Guarantee */}
            <div className="p-3 rounded-xl border border-secondary-container bg-[#F0FDF4] space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={aadhaarVerified}
                  onChange={(e) => setAadhaarVerified(e.target.checked)}
                  className="mt-1 w-5 h-5 text-secondary rounded focus:ring-secondary border-outline"
                />
                <div>
                  <div className="text-label-md font-bold text-on-surface flex items-center gap-1.5">
                    <span>Aadhaar Kisan Verification</span>
                    <span className="text-[10px] bg-secondary text-white font-bold px-1.5 py-0.5 rounded-full">
                      Zero Deposit
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">
                    Waive the ₹5,000 security deposit with instant digital OTP verification during delivery handover.
                  </p>
                </div>
              </label>
            </div>

            {/* Payment Mode Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-label-md font-bold text-on-surface block">
                  Select Payment Gateway
                </label>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Zero Commission (0% Fee)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Dynamic UPI Option */}
                <label className={`p-3.5 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentChoice === "upi"
                    ? "border-primary bg-emerald-50/70 shadow-sm"
                    : "border-outline-variant bg-surface-container-lowest hover:border-slate-400"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[20px]">qr_code_scanner</span>
                      <span className="text-body-sm font-bold text-on-surface">Dynamic UPI QR</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment_opt" 
                      checked={paymentChoice === "upi"} 
                      onChange={() => setPaymentChoice("upi")}
                      className="text-primary focus:ring-primary mt-0.5"
                    />
                  </div>
                  <p className="text-[11px] text-outline mt-1.5 leading-snug">
                    Scan with GPay, PhonePe, Paytm, or BHIM. Instant receipt & priority delivery.
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                    <span>100% Free Forever (0% MDR)</span>
                  </div>
                </label>

                {/* Pay on Delivery Option */}
                <label className={`p-3.5 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentChoice === "pod"
                    ? "border-primary bg-primary-fixed/20 shadow-sm"
                    : "border-outline-variant bg-surface-container-lowest hover:border-slate-400"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-amber-700 text-[20px]">local_shipping</span>
                      <span className="text-body-sm font-bold text-on-surface">Pay on Delivery</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment_opt" 
                      checked={paymentChoice === "pod"} 
                      onChange={() => setPaymentChoice("pod")}
                      className="text-primary focus:ring-primary mt-0.5"
                    />
                  </div>
                  <p className="text-[11px] text-outline mt-1.5 leading-snug">
                    Pay cash or UPI to machine operator after on-field machinery inspection.
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-800">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span>No Advance Payment Needed</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Total Payable Strip */}
            <div className="p-3.5 rounded-xl bg-surface-bright border border-outline-variant flex items-center justify-between">
              <div>
                <span className="text-body-sm text-outline block">Total Payable Amount</span>
                <span className="text-headline-sm font-bold text-primary">₹{grandTotal.toLocaleString()}</span>
              </div>
              <div className="text-right text-body-sm text-outline">
                <div>{selectedDays} Day(s) @ ₹{equipment.pricePerDay}</div>
                {hasDriver && <div>Driver: +₹{equipment.driverCostPerDay * selectedDays}</div>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-primary hover:bg-primary-container text-white font-label-lg font-bold rounded-lg flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-sm"
            >
              {paymentChoice === "upi" ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">qr_code</span>
                  <span>Proceed to Dynamic UPI QR (₹{grandTotal.toLocaleString()})</span>
                </>
              ) : (
                <>
                  <span>Confirm Rental (Pay on Delivery)</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: DYNAMIC UPI GATEWAY VIEW */}
        {modalStep === "upi_gateway" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Countdown & Security Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs text-emerald-900 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">timer</span>
                <span>QR expires in: <strong className="font-mono text-emerald-800">{formatTime(upiTimer)}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-bold">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                <span>NPCI UPI Verified</span>
              </div>
            </div>

            {/* QR Code Centerpiece */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Scan with Any UPI App
              </div>
              <div className="text-headline-md font-bold text-slate-900">
                ₹{grandTotal.toLocaleString()}
              </div>

              {/* QR Container */}
              <div className="my-3 p-3 bg-white border-2 border-dashed border-emerald-600 rounded-xl relative shadow-inner">
                <QRCodeSVG
                  value={upiIntentUrl}
                  size={180}
                  level="H"
                  includeMargin={false}
                  fgColor="#14532d"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-9 h-9 bg-white rounded-full p-1 shadow-md border border-slate-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[20px]">agriculture</span>
                  </div>
                </div>
              </div>

              {/* Supported UPI Apps icons row */}
              <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-600 font-medium">
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-bold text-slate-700">GPay</span>
                <span className="px-2 py-0.5 rounded bg-purple-50 border border-purple-200 font-bold text-purple-700">PhonePe</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-bold text-blue-700">Paytm</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-bold text-emerald-700">BHIM</span>
              </div>

              {/* Mobile Deep Link Button (Direct App Launch on phones) */}
              <div className="w-full mt-3 pt-3 border-t border-slate-100">
                <a
                  href={upiIntentUrl}
                  className="w-full h-10 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Tap to Pay on Mobile UPI App</span>
                </a>
              </div>
            </div>

            {/* UPI ID / VPA Details Strip */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Payee UPI ID (VPA):</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopyVpa}
                    className="text-primary hover:underline font-bold flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span>{copiedVpa ? "Copied!" : "Copy VPA"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingVpa(!isEditingVpa)}
                    className="text-slate-500 hover:text-slate-800 font-bold text-[11px] underline ml-2"
                  >
                    {isEditingVpa ? "Done" : "Change VPA"}
                  </button>
                </div>
              </div>

              {isEditingVpa ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={merchantVpa}
                    onChange={(e) => setMerchantVpa(e.target.value)}
                    placeholder="yourname@upi"
                    className="flex-1 h-9 px-2 bg-white border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingVpa(false)}
                    className="px-3 bg-primary text-white rounded text-xs font-bold"
                  >
                    Set
                  </button>
                </div>
              ) : (
                <div className="font-mono font-bold text-slate-800 text-sm select-all">
                  {merchantVpa}
                </div>
              )}

              <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                <span>Payee Name: <strong>KisanRent Agri Hub</strong></span>
                <span>Ref: <strong>{activeBookingRef}</strong></span>
              </div>
            </div>

            {/* UTR Verification Form */}
            <div className="p-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-label-md font-bold text-on-surface">
                  Payment Verification (UTR / Ref No.)
                </label>
                <button
                  type="button"
                  onClick={handleAutoFillDemoUtr}
                  className="text-[11px] text-emerald-800 bg-emerald-100 hover:bg-emerald-200 font-bold px-2 py-0.5 rounded border border-emerald-300"
                  title="Click to generate simulated bank 12-digit UTR"
                >
                  ⚡ Auto-fill Demo UTR
                </button>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={16}
                  value={utrNumber}
                  onChange={(e) => {
                    setUtrNumber(e.target.value);
                    setUtrError("");
                  }}
                  placeholder="e.g. 629510492817 (12 Digits)"
                  className="w-full h-11 px-3 bg-surface-bright border border-outline-variant rounded-lg text-body-md font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                />
                {utrError && <p className="text-xs text-red-600 mt-1 font-medium">{utrError}</p>}
                <p className="text-[11px] text-outline mt-1">
                  After paying via UPI, enter the 12-digit transaction reference number from your app.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setModalStep("form")}
                  className="h-11 px-4 border border-outline-variant rounded-lg text-body-sm font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleVerifyUpiPayment}
                  disabled={isSubmitting}
                  className="flex-1 h-11 bg-primary hover:bg-primary-container text-white font-label-md font-bold rounded-lg flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                      <span>Verifying with Bank...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Verify & Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS VIEW */}
        {modalStep === "success" && bookingSuccess && (
          <div className="p-5 flex-1 overflow-y-auto space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 mx-auto flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-4xl">check</span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-label-sm font-bold">
                  Assigned Ref: {bookingSuccess.bookingRef}
                </span>
                {bookingSuccess.paidAmount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded-full text-label-sm font-bold shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>Paid via UPI</span>
                  </span>
                )}
              </div>
              <h2 className="text-headline-sm font-bold text-on-surface mt-2">
                Machine Reserved Successfully!
              </h2>
              <p className="text-body-sm text-outline mt-1 max-w-sm mx-auto">
                Machine owner <strong className="text-on-surface">{equipment.owner.name}</strong> will contact you at <strong>+91 {farmerPhone}</strong> within 15 minutes.
              </p>
            </div>

            {/* Summary Ticket */}
            <div className="bg-surface-bright border border-outline-variant rounded-xl p-4 text-left space-y-2.5">
              <div className="flex justify-between items-center text-body-sm pb-2 border-b border-outline-variant">
                <span className="text-outline">Equipment:</span>
                <span className="font-bold text-on-surface">{equipment.title}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm pb-2 border-b border-outline-variant">
                <span className="text-outline">Rental Period:</span>
                <span className="font-semibold text-on-surface">{selectedDays} Day(s) • From {startDate}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm pb-2 border-b border-outline-variant">
                <span className="text-outline">Delivery Village:</span>
                <span className="font-semibold text-on-surface">{currentVillage?.name || "Rampur Village"}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm pb-2 border-b border-outline-variant">
                <span className="text-outline">Payment Status:</span>
                <span className="font-bold text-emerald-700">
                  {bookingSuccess.paymentStatus} {bookingSuccess.paidAmount > 0 && `(₹${bookingSuccess.paidAmount.toLocaleString()})`}
                </span>
              </div>
              {bookingSuccess.upiUtr && (
                <div className="flex justify-between items-center text-body-sm pb-2 border-b border-outline-variant">
                  <span className="text-outline">UPI UTR / Ref:</span>
                  <span className="font-mono font-bold text-slate-800">{bookingSuccess.upiUtr}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-label-md pt-1">
                <span className="font-bold text-on-surface">Total Amount:</span>
                <span className="font-bold text-primary text-headline-sm">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-secondary-container/20 rounded-lg border border-secondary-container text-on-secondary-container text-body-sm flex items-center gap-2 text-left">
              <span className="material-symbols-outlined text-secondary">verified_user</span>
              <span><strong>Zero Security Deposit:</strong> Your Aadhaar KYC has waived the ₹5,000 security deposit hold.</span>
            </div>

            <button
              onClick={handleFinish}
              className="w-full h-12 bg-primary text-white font-label-lg font-bold rounded-lg flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
            >
              <span>View in My Bookings</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
