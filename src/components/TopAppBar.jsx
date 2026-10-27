import React from "react";

export default function TopAppBar({ 
  currentScreen, 
  title, 
  currentUser,
  onBack, 
  onOpenHelp, 
  onCallSupport,
  onLogout 
}) {
  if (currentScreen === "detail") {
    return (
      <header className="sticky top-0 z-40 bg-surface-container-lowest flex items-center justify-between px-4 h-14 border-b border-outline-variant max-w-lg mx-auto w-full">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onBack}
            className="flex items-center text-primary font-label-md text-label-md py-2 pr-1 active:opacity-75 transition-opacity font-bold"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px] mr-1">arrow_back</span>
            <span>Back to Equipment</span>
          </button>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            aria-label="Help and support"
            onClick={onOpenHelp}
            className="p-2 text-on-surface-variant hover:text-primary active:scale-95 transition-all rounded-full"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">help_outline</span>
          </button>
          <button 
            aria-label="Quick call support"
            onClick={() => onCallSupport({ name: "KisanRent Farmer Helpline", phone: "1800-120-7890", role: "Toll-Free Support" })}
            className="p-2 text-primary hover:text-primary-container active:scale-95 transition-all rounded-full"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">call</span>
          </button>
        </div>
      </header>
    );
  }

  const isOwner = currentUser?.role === "owner";

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-14 bg-surface-container-lowest border-b border-outline-variant max-w-lg mx-auto right-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-xs">
          <span className="material-symbols-outlined text-[20px]">agriculture</span>
        </div>
        <div className="flex flex-col">
          <span className="text-headline-sm font-headline-sm font-bold text-primary tracking-tight leading-none">
            KisanRent
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`text-[9px] font-bold px-1 rounded uppercase tracking-wide ${
              isOwner ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-emerald-100 text-emerald-900 border border-emerald-300"
            }`}>
              {isOwner ? "Owner Portal" : "Tenant Portal"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <button 
          aria-label="Call support"
          onClick={() => onCallSupport({ name: "KisanRent Farmer Helpline", phone: "1800-120-7890", role: "Toll-Free Support" })}
          className="flex items-center justify-center min-w-[38px] min-h-[38px] text-primary hover:bg-surface-container rounded-full active:opacity-80 transition-opacity"
          type="button"
          title="Toll Free Support 1800-120-7890"
        >
          <span className="material-symbols-outlined text-[20px]">call</span>
        </button>

        <button 
          aria-label="Help and support"
          onClick={onOpenHelp}
          className="flex items-center justify-center min-w-[38px] min-h-[38px] text-on-surface-variant hover:bg-surface-container rounded-full active:opacity-80 transition-opacity"
          type="button"
          title="Help & FAQs"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>

        {currentUser && (
          <button
            onClick={onLogout}
            title={`Logged in as ${currentUser.name} (${isOwner ? "Owner" : "Tenant"}). Click to Log Out.`}
            className="flex items-center gap-1 pl-2 pr-1.5 py-1 rounded-full bg-surface-bright border border-outline-variant hover:bg-red-50 hover:border-red-200 text-on-surface hover:text-red-600 text-xs font-semibold active:scale-95 transition-all"
          >
            <span className="truncate max-w-[65px]">{currentUser.name.split(" ")[0]}</span>
            <span className="material-symbols-outlined text-[16px]">logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
