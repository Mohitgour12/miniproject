import React from "react";

export default function ReceiptModal({ booking, onClose }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
      <div 
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-primary text-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            <h3 className="text-headline-sm font-bold">KisanRent Rental Invoice</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-5 flex-1 overflow-y-auto space-y-4 bg-white text-on-surface">
          {/* Brand & Invoice Meta */}
          <div className="border-b pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 text-primary font-bold text-lg">
                <span className="material-symbols-outlined">agriculture</span>
                <span>KisanRent Portal</span>
              </div>
              <p className="text-xs text-outline mt-0.5">Govt. Verified Custom Hiring Center (CHC)</p>
              <p className="text-xs text-outline">Agri-Infra Portal ID: DL-AGRI-CHC-8812</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                Official Receipt
              </span>
              <div className="text-sm font-bold text-on-surface mt-1">{booking.bookingRef}</div>
              <div className="text-xs text-outline">Date: {booking.createdDate || "14 Oct 2026"}</div>
            </div>
          </div>

          {/* Machine & Owner Info */}
          <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-bold block uppercase">Machinery Details</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{booking.equipmentTitle}</div>
              <div className="text-slate-600">{booking.categoryType} ({booking.hpBadge})</div>
              <div className="text-slate-600">Location: {booking.location}</div>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase">Owner & Contact</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{booking.owner?.name || "Ramesh Patel"}</div>
              <div className="text-slate-600">{booking.owner?.phone || "+91 98765 43210"}</div>
              <div className="text-emerald-700 font-semibold mt-0.5">✓ KYC Verified Partner</div>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="border rounded-xl overflow-hidden border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-center">Duration</th>
                  <th className="p-2.5 text-right">Rate</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5">
                    <div className="font-semibold">{booking.equipmentTitle}</div>
                    <div className="text-slate-500 text-[11px]">{booking.dates}</div>
                  </td>
                  <td className="p-2.5 text-center font-medium">{booking.days || 1} Day(s)</td>
                  <td className="p-2.5 text-right">₹{booking.ratePerDay?.toLocaleString() || booking.estimatedTotal?.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-bold">₹{((booking.ratePerDay || booking.estimatedTotal) * (booking.days || 1)).toLocaleString()}</td>
                </tr>

                {booking.hasDriver && (
                  <tr>
                    <td className="p-2.5">
                      <div className="font-semibold">Professional Field Operator</div>
                      <div className="text-slate-500 text-[11px]">Included 10hr daily shift</div>
                    </td>
                    <td className="p-2.5 text-center font-medium">{booking.days || 1} Day(s)</td>
                    <td className="p-2.5 text-right">₹{booking.driverCostPerDay || 400}</td>
                    <td className="p-2.5 text-right font-bold">₹{((booking.driverCostPerDay || 400) * (booking.days || 1)).toLocaleString()}</td>
                  </tr>
                )}

                <tr className="bg-slate-50 font-bold text-slate-800">
                  <td colSpan={3} className="p-2.5 text-right">Security Deposit (Aadhaar Verified):</td>
                  <td className="p-2.5 text-right text-emerald-600 font-bold">₹0 (Waived)</td>
                </tr>

                <tr className="bg-slate-50 font-bold text-slate-800">
                  <td colSpan={3} className="p-2.5 text-right">GST on Agricultural Equipment Rental:</td>
                  <td className="p-2.5 text-right text-slate-600">Exempt (0%)</td>
                </tr>

                <tr className="bg-emerald-50 text-emerald-950 font-bold text-sm">
                  <td colSpan={3} className="p-2.5 text-right text-emerald-900">Total Net Amount:</td>
                  <td className="p-2.5 text-right text-emerald-800 font-extrabold text-base">₹{booking.estimatedTotal?.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Status Stamp */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-bold block">Payment Mode:</span>
              <span className="font-bold text-slate-800">{booking.paymentMethod || "Pay on Field Delivery"}</span>
              {booking.upiUtr && (
                <span className="text-[11px] text-emerald-700 font-mono block mt-0.5">
                  UPI UTR / Bank Ref: <strong className="font-bold">{booking.upiUtr}</strong>
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-slate-500 font-bold block">Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold border inline-flex items-center gap-1 ${
                booking.paymentStatus?.includes("Paid") || booking.paidAmount > 0
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-amber-100 text-amber-800 border-amber-300"
              }`}>
                {booking.paymentStatus?.includes("Paid") && (
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                )}
                <span>{booking.paymentStatus || "Pay on Delivery"}</span>
              </span>
            </div>
          </div>

          {/* Digital Signature & Barcode Note */}
          <div className="pt-2 border-t text-[11px] text-slate-500 flex justify-between items-end">
            <div>
              <p>• Machine inspected and fuel reading verified prior to release.</p>
              <p>• 24/7 Field breakdown emergency assistance: 1800-120-7890.</p>
            </div>
            <div className="text-center">
              <div className="font-cursive italic text-slate-700 font-bold">KisanRent Automated Authority</div>
              <div className="border-t border-slate-300 text-[10px] text-slate-400 mt-1">Authorized Digital Sign</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-bright border-t border-outline-variant flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 h-11 bg-primary text-white rounded-lg font-label-md font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="h-11 px-5 border border-outline-variant bg-white text-on-surface rounded-lg font-label-md font-semibold hover:bg-surface-container active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
