import React, { useState } from 'react';
import {
  X,
  FileText,
  Printer,
  Copy,
  Check,
  Car,
  ShieldCheck,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Send,
  Sparkles,
  Quote,
} from 'lucide-react';
import { DefectPin, VehicleInfo, DetailingPackage } from '../types';
import { DETAILING_PACKAGES, JUST_MEL_DETAIL_PROFILE } from '../data/defects';

interface DetailingQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  pins: DefectPin[];
  vehicleInfo: VehicleInfo;
  onUpdateVehicleInfo: (info: VehicleInfo) => void;
}

export const DetailingQuoteModal: React.FC<DetailingQuoteModalProps> = ({
  isOpen,
  onClose,
  pins,
  vehicleInfo,
  onUpdateVehicleInfo,
}) => {
  const profile = JUST_MEL_DETAIL_PROFILE;

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [bookingType, setBookingType] = useState<'appointment' | 'subscription'>('appointment');
  const [packageCategory, setPackageCategory] = useState<'all' | 'automotive' | 'equestrian'>(
    pins.some((p) => p.defectId.startsWith('eq_')) ? 'equestrian' : 'all'
  );

  const [selectedPackage, setSelectedPackage] = useState<DetailingPackage>(
    pins.some((p) => p.defectId.startsWith('eq_'))
      ? DETAILING_PACKAGES.find((pkg) => pkg.segment === 'equestrian') || DETAILING_PACKAGES[0]
      : pins.some((p) => p.mode === 'interior') && pins.some((p) => p.mode === 'exterior')
      ? DETAILING_PACKAGES[3] // Full Restoration
      : pins.some((p) => p.mode === 'exterior')
      ? DETAILING_PACKAGES[2] // Paint correction & buffing
      : DETAILING_PACKAGES[1] // Deep upholstery steam & extraction
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exteriorPins = pins.filter((p) => p.mode === 'exterior');
  const interiorPins = pins.filter((p) => p.mode === 'interior');

  const handlePrint = () => {
    window.print();
  };

  const generateSummaryText = () => {
    return `
=====================================================
${profile.fullTitle.toUpperCase()}
Owner & Lead Detailer: ${profile.owner}
Mobile Detailing Service: ${profile.location}
Phone: ${profile.phone} | Cash App: ${profile.cashApp}
Emails: ${profile.emails.join(', ')}
=====================================================

"Your car isn't an accessory. It's a necessity. And necessities perform better and last longer when they're properly maintained. A professional detail does three things: it identifies problem areas, restores what's been neglected, and applies protection to help prevent future wear." - Jamel Tyler

CLIENT INTAKE & DAMAGE INSPECTION REPORT
Date: ${new Date().toLocaleDateString()}
Client Name: ${clientName || 'Valued Client'}
Phone: ${clientPhone || 'Not provided'}
Email: ${clientEmail || 'Not provided'}
Mobile Service Location: ${serviceAddress || 'Aiken, SC area'}
Preferred Appointment: ${preferredDate || 'Flexible / ASAP'}
Booking Category: ${bookingType === 'subscription' ? 'VIP Mobile Maintenance Subscription' : 'One-Time Mobile Appointment'}

VEHICLE SPECIFICATIONS:
Vehicle: ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}
Color: ${vehicleInfo.color} | Paint Finish: ${vehicleInfo.paintType}
Interior Material: ${vehicleInfo.interiorType}

SELECTED SERVICE:
Package: ${selectedPackage.name}
Estimate: Starts at $${selectedPackage.startingPrice}
Est. Duration: ${selectedPackage.duration}
Key Focus: ${selectedPackage.tagline}

Scope Highlights:
${selectedPackage.features.map((f) => ` • ${f}`).join('\n')}

EXTERIOR SCRATCHES & PAINT DEFECTS (${exteriorPins.length}):
${
  exteriorPins
    .map(
      (p, i) =>
        ` ${i + 1}. [${p.panelName}] ${p.name} (${p.severity.toUpperCase()}): "${p.description}" -> Action: ${p.recommendedTreatment}`
    )
    .join('\n') || ' None recorded. Exterior paint clear.'
}

INTERIOR STAINS, SOIL & CREVICES (${interiorPins.length}):
${
  interiorPins
    .map(
      (p, i) =>
        ` ${i + 1}. [${p.panelName}] ${p.name} (${p.severity.toUpperCase()}${
          p.stainAge ? `, Age: ${p.stainAge}` : ''
        }): "${p.description}" -> Action: ${p.recommendedTreatment}`
    )
    .join('\n') || ' None recorded. Interior cabin clear.'
}

PRE-SERVICE DISCLOSURES:
• Mobile unit carries onboard water & electrical generation.
• Delicate headliner adhesive requires low-moisture steam mist.
• Paint correction aims for maximum safe clearcoat preservation.
=====================================================
    `.trim();
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEmailToJamel = () => {
    const subject = encodeURIComponent(
      `JustMelDetail Intake & Quote Request - ${clientName || 'Client'} (${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model})`
    );
    const body = encodeURIComponent(generateSummaryText());
    window.location.href = `mailto:${profile.emails[0]}?cc=${profile.emails[1]}&subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  JustMelDetail Work Order & Intake Slip
                </h2>
                <span className="text-[10px] uppercase font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Aiken, SC Mobile
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official client inspection condition report by Jamel Tyler
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleEmailToJamel}
              className="px-2.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              title="Send directly to Jamel Tyler via email"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Email to Jamel</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {/* Business Banner Card on the Slip */}
          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">
                  {profile.fullTitle}
                </span>
              </div>
              <p className="text-xs text-blue-400 font-semibold mt-0.5">
                Owner & Detail Specialist: {profile.owner} • {profile.location}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 mt-2">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>{profile.phone}</span>
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  <span>Cash App: {profile.cashApp}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-indigo-400" />
                  <span className="text-slate-300">jamelisjustmeldetail@gmail.com</span>
                </span>
              </div>
            </div>

            {/* Booking Type Pill Selector */}
            <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700 flex items-center shrink-0">
              <button
                type="button"
                onClick={() => setBookingType('appointment')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  bookingType === 'appointment'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                One-Time Booking
              </button>
              <button
                type="button"
                onClick={() => setBookingType('subscription')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  bookingType === 'subscription'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                VIP Subscription
              </button>
            </div>
          </div>

          {/* Philosophy Statement */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-xl border border-blue-200/80 flex items-start gap-2.5">
            <Quote className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-700 italic leading-relaxed">
              "{profile.mottoQuote}"
            </p>
          </div>

          {/* Section 1: Vehicle & Client Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Vehicle Specs */}
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-blue-600" />
                <span>Vehicle Specifications</span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Year"
                  value={vehicleInfo.year}
                  onChange={(e) => onUpdateVehicleInfo({ ...vehicleInfo, year: e.target.value })}
                  className="text-xs p-2 bg-white border border-slate-200 rounded-lg outline-hidden focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Make"
                  value={vehicleInfo.make}
                  onChange={(e) => onUpdateVehicleInfo({ ...vehicleInfo, make: e.target.value })}
                  className="text-xs p-2 bg-white border border-slate-200 rounded-lg outline-hidden focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Model"
                  value={vehicleInfo.model}
                  onChange={(e) => onUpdateVehicleInfo({ ...vehicleInfo, model: e.target.value })}
                  className="text-xs p-2 bg-white border border-slate-200 rounded-lg outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Exterior Color"
                  value={vehicleInfo.color}
                  onChange={(e) => onUpdateVehicleInfo({ ...vehicleInfo, color: e.target.value })}
                  className="text-xs p-2 bg-white border border-slate-200 rounded-lg outline-hidden focus:border-blue-500"
                />
                <select
                  value={vehicleInfo.paintType}
                  onChange={(e) => onUpdateVehicleInfo({ ...vehicleInfo, paintType: e.target.value as any })}
                  className="text-xs p-2 bg-white border border-slate-200 rounded-lg outline-hidden focus:border-blue-500"
                >
                  <option>Gloss Clearcoat</option>
                  <option>Metallic / Pearl</option>
                  <option>Matte / Satin</option>
                  <option>Ceramic Coated</option>
                </select>
              </div>

              <div className="mt-2">
                <select
                  value={vehicleInfo.interiorType}
                  onChange={(e) => onUpdateVehicleInfo({ ...vehicleInfo, interiorType: e.target.value as any })}
                  className="text-xs p-2 w-full bg-white border border-slate-200 rounded-lg outline-hidden focus:border-blue-500"
                >
                  <option>Fabric / Carpet Cloth</option>
                  <option>Natural Leather</option>
                  <option>Perforated Leather</option>
                  <option>Synthetic / Alcantara</option>
                </select>
              </div>
            </div>

            {/* Client & Mobile Location Details */}
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Client & Mobile Service Location</span>
              </span>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-blue-500">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Client Full Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="text-xs w-full outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-blue-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="text-xs w-full outline-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-blue-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Client Email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="text-xs w-full outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-blue-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Mobile Service Address (Aiken, SC / Workplace / Home)"
                    value={serviceAddress}
                    onChange={(e) => setServiceAddress(e.target.value)}
                    className="text-xs w-full outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-blue-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Preferred Appointment Date & Time (e.g. Saturday 10:00 AM)"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="text-xs w-full outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Detailing Package Recommender */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Select JustMelDetail Service Package</span>
              </span>

              {/* Segment Filter for Packages */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPackageCategory('all')}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-colors ${
                    packageCategory === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setPackageCategory('automotive')}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-colors ${
                    packageCategory === 'automotive'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Automotive
                </button>
                <button
                  type="button"
                  onClick={() => setPackageCategory('equestrian')}
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md transition-colors flex items-center gap-1 ${
                    packageCategory === 'equestrian'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <span>🐴</span>
                  <span>Equestrian Trailer</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DETAILING_PACKAGES.filter((pkg) => {
                if (packageCategory === 'all') return true;
                if (packageCategory === 'equestrian') return pkg.segment === 'equestrian';
                return pkg.segment !== 'equestrian';
              }).map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-slate-900 leading-snug">{pkg.name}</span>
                        <span className="text-xs font-mono font-bold text-blue-700 shrink-0">
                          ${pkg.startingPrice}+
                        </span>
                      </div>
                      <span className="inline-block text-[10px] font-bold text-blue-600 bg-blue-100/70 px-1.5 py-0.5 rounded mb-1">
                        {pkg.highlight}
                      </span>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{pkg.tagline}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Est: {pkg.duration}</span>
                      {isSelected && <span className="font-bold text-blue-700">Selected ✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Package Features Callout */}
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block mb-1.5">
                Included in {selectedPackage.name}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-700">
                {selectedPackage.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Itemized Damage & Stain Inventory Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Itemized Damage & Stain Inventory ({pins.length})</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Pinpointed on interactive vehicle simulator
              </span>
            </div>

            {pins.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                No scratches or stains logged. Vehicle is in clean baseline condition.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Damage / Stain Name</th>
                      <th className="p-2.5">Specific Location</th>
                      <th className="p-2.5">Severity</th>
                      <th className="p-2.5">Client Note</th>
                      <th className="p-2.5">Prescribed Treatment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pins.map((pin, i) => (
                      <tr key={pin.id} className="hover:bg-slate-50/80">
                        <td className="p-2.5 font-bold font-mono">{i + 1}</td>
                        <td className="p-2.5 font-semibold text-slate-900">
                          {pin.name}
                        </td>
                        <td className="p-2.5 text-blue-700 font-medium">{pin.panelName}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              pin.severity === 'severe'
                                ? 'bg-red-100 text-red-800'
                                : pin.severity === 'moderate'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {pin.severity}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600 max-w-[200px] truncate">
                          {pin.description}
                        </td>
                        <td className="p-2.5 text-slate-800 font-medium">
                          {pin.recommendedTreatment}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 4: Mobile Service Terms & Payment Information */}
          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-blue-400 block mb-1">
                JustMelDetail Service Terms & Payment
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
                Payment accepted via Cash App ({profile.cashApp}) or cash upon job completion. Subscriptions receive priority scheduling and monthly paint protection top-ups in Aiken, SC and nearby surrounding areas.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleEmailToJamel}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Work Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
