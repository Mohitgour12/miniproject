/**
 * Utility helper for integrating Razorpay Checkout in Test/Sandbox Mode
 */

// Load Razorpay SDK script dynamically if not already in DOM
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Pre-configured public test key for instant demonstration
export const DEFAULT_RAZORPAY_TEST_KEY = "rzp_test_1DP5mmOlF5G5ag";

/**
 * Open Razorpay Checkout modal
 */
export async function launchRazorpayPayment({
  amount,
  farmerName,
  farmerPhone,
  equipmentTitle,
  bookingRef,
  customKeyId,
  onSuccess,
  onDismiss,
  onError
}) {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded || typeof window.Razorpay === "undefined") {
    // If offline or blocked by adblocker, return simulated fallback
    console.warn("Razorpay SDK could not be loaded from CDN. Falling back to test simulation.");
    if (onError) {
      onError(new Error("Razorpay SDK failed to load. Please check your internet connection or ad-blocker."));
    }
    return false;
  }

  const keyId = customKeyId || import.meta.env?.VITE_RAZORPAY_KEY_ID || DEFAULT_RAZORPAY_TEST_KEY;

  const options = {
    key: keyId,
    amount: Math.round(amount * 100), // Razorpay takes amounts in paise (1 INR = 100 paise)
    currency: "INR",
    name: "KisanRent - Farm Machinery",
    description: `Advance Rental Booking • ${equipmentTitle}`,
    image: "https://cdn-icons-png.flaticon.com/512/2823/2823528.png",
    notes: {
      bookingRef: bookingRef || "KR-ADVANCE",
      equipment: equipmentTitle,
      farmerPhone: farmerPhone
    },
    prefill: {
      name: farmerName || "Baldev Singh",
      contact: farmerPhone || "9876543210",
      email: "farmer@kisanrent.in"
    },
    theme: {
      color: "#14532d" // Primary green matching the app
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) onDismiss();
      }
    },
    handler: function (response) {
      // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      if (onSuccess) {
        onSuccess(response);
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      if (onError) onError(response.error);
    });
    rzp.open();
    return true;
  } catch (err) {
    console.error("Error launching Razorpay:", err);
    if (onError) onError(err);
    return false;
  }
}
