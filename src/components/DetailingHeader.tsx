import React, { useState, useRef, useEffect } from 'react';
import {
  Car,
  Sparkles,
  Wand2,
  FileText,
  HelpCircle,
  ShieldCheck,
  Armchair,
  Layers,
  Phone,
  Info,
  MapPin,
  Calendar,
  Sun,
  Moon,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { SimulatorMode } from '../types';
import { JUST_MEL_DETAIL_PROFILE } from '../data/defects';

interface DetailingHeaderProps {
  mode: SimulatorMode;
  onModeChange: (mode: SimulatorMode) => void;
  pinCount: number;
  onOpenAIEdit: () => void;
  onOpenAIPro: () => void;
  onOpenQuote: () => void;
  onOpenInterview: () => void;
  onOpenAbout: () => void;
  onOpenVinSoftware: () => void;
  onOpenBooking: () => void;
  isSunlightMode?: boolean;
  onToggleSunlightMode?: () => void;
}

export const DetailingHeader: React.FC<DetailingHeaderProps> = ({
  mode,
  onModeChange,
  pinCount,
  onOpenAIEdit,
  onOpenAIPro,
  onOpenQuote,
  onOpenInterview,
  onOpenAbout,
  onOpenVinSoftware,
  onOpenBooking,
  isSunlightMode = false,
  onToggleSunlightMode,
}) => {
  const profile = JUST_MEL_DETAIL_PROFILE;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`border-b sticky top-0 z-40 shadow-md transition-colors ${
        isSunlightMode
          ? 'bg-slate-900 border-slate-700 text-white'
          : 'bg-slate-950 border-slate-800 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                {profile.businessName}
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                Mobile Van • Aiken, SC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:flex items-center gap-1.5">
              <span>Jamel Tyler</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Auto & Equestrian Trailer Care</span>
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher (Exterior vs Cabin) */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700/80 shrink-0">
          <button
            id="switch-mode-exterior"
            onClick={() => onModeChange('exterior')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
              mode === 'exterior'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Exterior</span>
          </button>

          <button
            id="switch-mode-interior"
            onClick={() => onModeChange('interior')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
              mode === 'interior'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Armchair className="w-3.5 h-3.5" />
            <span>Cabin</span>
          </button>
        </div>

        {/* Right: Actions Hierarchy (Primary Checkout + VIN + Intake + Secondary Dropdown) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Outdoor Sunlight Mode Toggle */}
          {onToggleSunlightMode && (
            <button
              onClick={onToggleSunlightMode}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center justify-center min-h-[40px] min-w-[40px] ${
                isSunlightMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700'
              }`}
              title="Toggle High-Contrast Outdoor Sunlight Mode"
              aria-label="Toggle High-Contrast Outdoor Sunlight Mode"
            >
              {isSunlightMode ? <Sun className="w-4 h-4 fill-slate-950" /> : <Sun className="w-4 h-4" />}
            </button>
          )}

          {/* VIN Software & Passport */}
          <button
            id="open-vin-software-btn"
            onClick={onOpenVinSoftware}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 transition-colors min-h-[40px]"
            title="VIN Software: Insurance & Resale Ledger, Wax Countdown"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>VIN Passport</span>
          </button>

          {/* Intake Slip / Work Order */}
          <button
            id="open-intake-quote-btn"
            onClick={onOpenQuote}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition-colors min-h-[40px]"
            title="View Interactive Damage Intake Slip"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Intake Slip</span>
            {pinCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-mono font-bold">
                {pinCount}
              </span>
            )}
          </button>

          {/* PRIMARY CALL TO ACTION: Fast Mobile Booking & Checkout */}
          <button
            id="open-booking-flow-btn"
            onClick={onOpenBooking}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:from-emerald-600 active:to-teal-600 text-slate-950 shadow-md hover:shadow-lg transition-all min-h-[42px]"
            title="Fast 60-second mobile booking • $0 due now"
          >
            <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
            <span>Book Detail</span>
            <span className="hidden lg:inline text-[10px] font-extrabold bg-slate-950/15 px-1.5 py-0.5 rounded-sm">
              $0 Now
            </span>
          </button>

          {/* Secondary Features Dropdown ("More Tools") */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors flex items-center justify-center min-h-[40px]"
              title="More options & AI tools"
              aria-label="More options"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 text-xs space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-800 mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Simulator & Detailer Tools
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenVinSoftware();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-emerald-300 font-semibold flex items-center gap-2 sm:hidden"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="block">VIN Software & Ledger</span>
                    <span className="text-[10px] text-slate-400">Insurance proof & wax tracker</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAIEdit();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="block">AI Paint & Steam Treatment</span>
                    <span className="text-[10px] text-slate-400">Simulate before & after results</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAIPro();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="block">4K Pro Showroom Photos</span>
                    <span className="text-[10px] text-slate-400">Gloss & reflection visualizer</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenInterview();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="block">Detailer Intake Discovery</span>
                    <span className="text-[10px] text-slate-400">Vehicle diagnostic questionnaire</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAbout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2"
                >
                  <Info className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="block">About Jamel Tyler</span>
                    <span className="text-[10px] text-slate-400">Philosophy, pricing & service area</span>
                  </div>
                </button>

                <div className="pt-2 border-t border-slate-800 px-3 py-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Direct:</span>
                  <a href={`tel:${profile.phone}`} className="font-bold text-emerald-400 hover:underline">
                    {profile.phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
