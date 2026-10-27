import React from "react";

export default function HelpModal({ isOpen, onClose, onCallHelpline }) {
  if (!isOpen) return null;

  const faqs = [
    {
      q: "How does the rental payment work?",
      a: "You only pay after the equipment is delivered to your field and inspected by you. You can pay via cash or UPI directly to the verified owner."
    },
    {
      q: "Is there any security deposit?",
      a: "No! With Aadhaar or Kisan Credit Card (KCC) authentication, the ₹5,000 security deposit is completely waived (Nil deposit)."
    },
    {
      q: "Who provides the fuel?",
      a: "Equipment is delivered with a standard tank level. Farmers provide diesel for their usage and return the machine at approximately the same fuel level."
    },
    {
      q: "What if the machinery breaks down in the field?",
      a: "Call our 24/7 Field Support helpline at 1800-120-7890. A mobile mechanic technician will be dispatched to your field at no charge."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl border border-outline-variant shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        role="dialog"
      >
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-primary-container text-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">help</span>
            <h3 className="text-headline-sm font-bold">KisanRent Field Help & FAQs</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div className="p-3 bg-secondary-container/20 border border-secondary-container rounded-xl flex items-center justify-between">
            <div>
              <span className="text-label-md font-bold text-on-surface block">Need immediate roadside or field assistance?</span>
              <span className="text-body-sm text-outline">Toll-free 24/7 agricultural support</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onCallHelpline();
              }}
              className="px-3 py-2 bg-secondary text-white font-bold text-xs rounded-lg active:scale-95 shrink-0 ml-2"
            >
              Call 1800-120-7890
            </button>
          </div>

          <h4 className="text-label-md font-bold text-on-surface pt-2">Frequently Asked Questions</h4>
          
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <details key={idx} className="p-3 rounded-xl border border-outline-variant bg-surface-bright group cursor-pointer">
                <summary className="font-bold text-on-surface text-body-md list-none flex justify-between items-center">
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="text-body-sm text-on-surface-variant mt-2 pt-2 border-t border-outline-variant/60 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-outline-variant bg-surface-bright">
          <button
            onClick={onClose}
            className="w-full h-11 bg-primary text-white font-semibold rounded-lg"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
