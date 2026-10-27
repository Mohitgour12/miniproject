import React, { useState } from "react";

export default function DialerModal({ contact, onClose, onShowToast }) {
  const [copied, setCopied] = useState(false);

  if (!contact) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(contact.phone);
    setCopied(true);
    if (onShowToast) {
      onShowToast({ message: `Copied ${contact.phone} to clipboard!` });
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full max-w-sm bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl border border-outline-variant shadow-2xl overflow-hidden p-5 space-y-4 animate-slide-up"
        role="dialog"
      >
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">call</span>
            <h3 className="text-headline-sm font-bold text-on-surface">Call Contact</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="text-center py-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold text-2xl mb-2">
            {contact.name?.charAt(0) || "K"}
          </div>
          <h4 className="text-headline-sm font-bold text-on-surface">{contact.name}</h4>
          <p className="text-body-sm text-secondary font-semibold flex items-center justify-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>{contact.role || "Verified Equipment Owner"}</span>
          </p>
          <div className="text-price-display font-bold text-primary tracking-wide mt-2">
            {contact.phone}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <a
            href={`tel:${contact.phone?.replace(/[^0-9+]/g, '')}`}
            className="w-full h-12 bg-[#15803D] hover:bg-[#14532D] text-white rounded-xl font-label-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
            <span>Dial Now</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="h-11 bg-surface-bright border border-outline-variant text-on-surface rounded-xl font-label-md font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-container active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copied ? "done" : "content_copy"}
              </span>
              <span>{copied ? "Copied" : "Copy Number"}</span>
            </button>

            <a
              href={`https://wa.me/${contact.phone?.replace(/[^0-9]/g, '')}?text=Namaste%20Ji,%20I%20am%20calling%20regarding%20the%20equipment%20rental%20on%20KisanRent`}
              target="_blank"
              rel="noreferrer"
              className="h-11 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl font-label-md font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-100 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
