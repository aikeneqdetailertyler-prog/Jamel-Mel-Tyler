import React from 'react';
import {
  X,
  Car,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Quote,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { JUST_MEL_DETAIL_PROFILE, DETAILING_PACKAGES } from '../data/defects';

interface AboutBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: () => void;
}

export const AboutBusinessModal: React.FC<AboutBusinessModalProps> = ({
  isOpen,
  onClose,
  onOpenQuote,
}) => {
  if (!isOpen) return null;

  const profile = JUST_MEL_DETAIL_PROFILE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {profile.businessName}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Mobile Detailing
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Serving Aiken, SC & Surrounding Areas</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-200 font-medium">Owner: {profile.owner}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {/* Mission & Philosophy Quote Box */}
          <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-amber-50/40 p-4 rounded-xl border border-blue-200/80 shadow-2xs relative">
            <div className="flex items-start gap-2.5 mb-2">
              <Quote className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                  Our Philosophy & Mission
                </span>
                <span className="text-[11px] text-slate-500">By Jamel Tyler, Owner & Lead Detailer</span>
              </div>
            </div>
            <p className="italic text-slate-700 leading-relaxed pl-7 text-[12px]">
              "{profile.mottoQuote}"
            </p>
          </div>

          {/* Quick Contact & Payment Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={`tel:${profile.phone.replace(/-/g, '')}`}
              className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block uppercase">Call or Text</span>
                <span className="font-bold text-slate-900 text-xs font-mono">{profile.phone}</span>
              </div>
            </a>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block uppercase">Cash App</span>
                <span className="font-bold text-emerald-700 text-xs font-mono">{profile.cashApp}</span>
              </div>
            </div>

            <a
              href={`mailto:${profile.emails[0]}`}
              className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-semibold text-slate-500 block uppercase">Primary Email</span>
                <span className="font-semibold text-slate-900 text-[11px] truncate block">
                  {profile.emails[0]}
                </span>
              </div>
            </a>
          </div>

          {/* Full Detailing Capabilities Menu */}
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Full Mobile Detailing Capabilities</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Paint correction, buffing & polishing</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Deep shampoo extraction & upholstery cleaning</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Steam sanitizing & complete deodorizing</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Rich pH-balanced leather conditioning</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Front bumper debugging & grille de-bugging</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Deep rim cleaning & long-lasting tire shine</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Streak-free crystal window cleaning</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Foam cannon wash, waxing & UV paint protection</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Headliner delicate cleaning & spot care</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Dashboard, cupholders & door jambs steam sanitized</span>
              </div>
            </div>
          </div>

          {/* Dedicated Equestrian Trailer Community Section */}
          <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span>🐴</span>
                <span>Equestrian Trailer Community Services (Aiken, SC)</span>
              </span>
              <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full">
                Barn On-Site Service
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              I proudly serve the Aiken equestrian trailer community. I go to every client, delivering discreet, professional heuristics right at your barn or stable with 100% biodegradable products safe for horses and pastures.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-lg border border-emerald-900/60 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Commercial pressure washing & foam cannon pre-wash</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-lg border border-emerald-900/60 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Aluminum acid flushing (removes oxidation & scale)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-lg border border-emerald-900/60 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Heavy rubber stall mat pulling & sub-floor wash</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-lg border border-emerald-900/60 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Tack room refreshing & cobweb extraction</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-lg border border-emerald-900/60 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Living quarters deep refresh & bunk sanitizing</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-lg border border-emerald-900/60 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Biodegradable products & UV aluminum protection</span>
              </div>
            </div>
          </div>

          {/* Subscriptions & Maintenance */}
          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-blue-400">
                Maintenance Subscriptions & Mobile Appointments
              </span>
              <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full font-bold">
                Aiken, SC Priority
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Never let grime build up into permanent wear. JustMelDetail offers recurring bi-weekly and monthly maintenance subscriptions delivered straight to your home or office in Aiken and surrounding areas.
            </p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
              <span className="text-slate-400">All direct inquiries & appointments:</span>
              <span className="font-mono font-bold text-white">{profile.phone}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            All three emails monitored: <span className="font-mono text-slate-700">aikeneqdetailertyler@gmail.com</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenQuote();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Open Intake Slip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
