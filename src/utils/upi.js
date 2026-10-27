/**
 * UPI (Unified Payments Interface) Gateway Utility
 * 100% Free, 0% MDR, NPCI Compliant Deep Link & QR Specification
 */

// Default Payee UPI configuration for KisanRent
export const DEFAULT_UPI_CONFIG = {
  upiId: "kisanrent@okaxis", // Can be customized to any GPay/PhonePe/Paytm VPA
  payeeName: "KisanRent Agri Hub",
  currency: "INR"
};

/**
 * Builds standard NPCI compliant UPI URL for deep linking and QR codes
 * Format: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...&tr=...
 */
export function buildUPIUrl({
  upiId = DEFAULT_UPI_CONFIG.upiId,
  payeeName = DEFAULT_UPI_CONFIG.payeeName,
  amount,
  transactionNote = "KisanRent Machinery Rental",
  transactionRef = ""
}) {
  const cleanAmount = Number(amount || 0).toFixed(2);
  const params = new URLSearchParams();

  params.append("pa", upiId.trim());
  params.append("pn", payeeName.trim());
  params.append("am", cleanAmount);
  params.append("cu", "INR");

  if (transactionNote) {
    params.append("tn", transactionNote.slice(0, 50)); // UPI limit note to 50 chars
  }

  if (transactionRef) {
    params.append("tr", transactionRef.replace(/[^a-zA-Z0-9]/g, ""));
  }

  return `upi://pay?${params.toString()}`;
}

/**
 * Generates a realistic 12-digit Indian Bank UTR (Unique Transaction Reference)
 */
export function generateMockUTR() {
  const prefix = "6" + Math.floor(100 + Math.random() * 900); // Year/day format simulation
  const suffix = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${suffix}`;
}
