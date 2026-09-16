import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Car,
  Printer,
  Compass,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  HeartHandshake,
} from 'lucide-react';
import { JUST_MEL_DETAIL_PROFILE } from '../data/defects';

interface LeadGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const LeadGeneratorModal: React.FC<LeadGeneratorModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const profile = JUST_MEL_DETAIL_PROFILE;
  const [activeTab, setActiveTab] = useState<'ads' | 'sms' | 'flyer' | 'calculator'>('ads');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Travel & Profit Calculator State
  const [distanceMiles, setDistanceMiles] = useState<number>(35);
  const [jobType, setJobType] = useState<'horse_trailer' | 'auto_restoration' | 'maintenance'>('horse_trailer');
  const [trailerCondition, setTrailerCondition] = useState<'standard' | 'small' | 'severe'>('standard');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://justmeldetail.app';

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Travel calculation math
  const travelHours = (distanceMiles / 50).toFixed(1); // approximate 50mph rural/hwy
  const fuelCost = Math.round(distanceMiles * 2 * 0.28); // round trip * $0.28/mile
  const travelFee = distanceMiles <= 20 ? 0 : Math.round((distanceMiles - 20) * 1.5);
  
  let baseJobPrice = 400;
  if (jobType === 'horse_trailer') {
    if (trailerCondition === 'small') baseJobPrice = 350;
    else if (trailerCondition === 'severe') baseJobPrice = 550;
    else baseJobPrice = 425; // standard $400 - $450
  } else if (jobType === 'auto_restoration') {
    baseJobPrice = 650;
  } else {
    baseJobPrice = 180;
  }

  const totalQuote = baseJobPrice + travelFee;
  const netEstimatedProfit = totalQuote - fuelCost - 35; // minus chemicals

  // 3 High-converting ad copy templates
  const ADS = [
    {
      id: 'ad_equestrian',
      category: 'Equestrian & Barn Owners',
      badge: 'Highest Ticket ($350 - $450+)',
      headline: '🐴 Zero-Noise Horse Trailer Mobile Detailing in Aiken (No Loud Generators)',
      body: `Notice caustic urine rotting your aluminum trailer floor, or road grime baked into your horse trailer skin?

Standard mobile detailers crank up roaring gas combustion generators that panic and spook horses in nearby stalls.

At JustMelDetail, Jamel Tyler operates with a strict ANIMAL WELFARE GUARANTEE:
✓ Whisper-quiet electric 2,000 PSI washer (1.8 GPM) powered by your standard water spigot.
✓ ZERO roaring combustion generators. We never put any animal in an agitated state.
✓ Sub-floor rubber mat pulling & aluminum floor acid flush (neutralizes caustic uric acid salts before floor rot occurs).
✓ 220°F hospital-grade steam sanitization & 100% pasture-safe biodegradable formulas.
✓ Starting at $400 - $450 ($350 minimum for smallest 2-horse units depending on condition).
✓ Mobile service to barns in Aiken, SC and up to 2 hours away.
✓ Money-back guarantee if there is ever any animal welfare disagreement.

📅 Book your barn date with $0 deposit in 60 seconds:
${currentUrl}
Or call/text Jamel directly at ${profile.phone}`,
    },
    {
      id: 'ad_luxury_resale',
      category: 'Luxury SUVs, Trucks & Daily Drivers',
      badge: 'Resale & Trade-In Protection',
      headline: '🚗 Don\'t Trade In Your Vehicle Without This Door Jamb Sticker',
      body: `Did you know automated car wash brushes and Carolina sun cause thousands in trade-in depreciation?

Every full detail with JustMelDetail in Aiken, SC now includes a complimentary DIGITAL VEHICLE PASSPORT & scannable door jamb QR badge.

When you sell privately or trade in your car:
1. The appraiser or private buyer points their phone camera at your door jamb sticker.
2. They see a certified, tamper-evident digital ledger showing 220°F steam sanitization, clearcoat preservation, and active 90-day UV wax shield countdown.
3. Verified maintenance proof helps you capture up to $1,500+ more on your appraisal.

• We come directly to your driveway or workplace.
• Official hours 9-5, or 7-to-Dark by request.
• $0 deposit required to reserve your slot.

Inspect your vehicle or schedule in 60 seconds:
${currentUrl}
Direct: ${profile.phone} (Jamel Tyler)`,
    },
    {
      id: 'ad_family_pets',
      category: 'Families, Dog Owners & Commuters',
      badge: 'High Conversion ($180 - $260)',
      headline: '🐕 Embedded Pet Hair & Sour Milk Spills? We Deep Extract with 220°F Steam',
      body: `Air fresheners only mask odors. At JustMelDetail, we pull dirt, pet dander, and spoiled milk bacteria out at the root.

✓ High-heat 220°F thermal steam sanitizing for cupholders, air vents & baby seats.
✓ Deep hot-water carpet & upholstery extraction.
✓ Specialized pet hair claw lifting (leaves zero stiff greasy residue).
✓ Convenient mobile detailing at your home in Aiken and surrounding areas.
✓ $0 deposit to reserve. Pay upon inspection when you\'re 100% satisfied.

Check instant estimates and pick your arrival window:
${currentUrl}
Text or call Jamel Tyler: ${profile.phone}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  JustMelDetail Lead Generator & Business Engine
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Operator Mode
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Calibrated with Jamel Tyler's exact water policy, animal welfare guarantee, and 2-hr travel pricing.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'ads'
                ? 'bg-white text-slate-950 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Ready-to-Post Social Ads (Nextdoor & FB)</span>
          </button>

          <button
            onClick={() => setActiveTab('sms')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'sms'
                ? 'bg-white text-slate-950 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>1-Click SMS Client Referral</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'calculator'
                ? 'bg-white text-slate-950 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-600" />
            <span>2-Hour Travel & Profit Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('flyer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'flyer'
                ? 'bg-white text-slate-950 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-4 h-4 text-purple-600" />
            <span>Barn Bulletin & Tack Room Flyer</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800">
          
          {/* TAB 1: Ready-to-Post Ads */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-blue-950">
                    How to use these posts to get 3-5 jobs this week:
                  </h4>
                  <p className="text-xs text-blue-800 mt-1">
                    Copy and paste these exact posts into <strong>Aiken SC Horse Classifieds</strong>, <strong>Nextdoor Aiken</strong>, <strong>Woodside Plantation Groups</strong>, or your Facebook page. They address your quiet water system, animal safety, and transparent $350 - $450 pricing so you get qualified leads who are ready to pay.
                  </p>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shrink-0 shadow-xs"
                >
                  Test Booking Form
                </button>
              </div>

              <div className="space-y-4">
                {ADS.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                            {ad.category}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {ad.badge}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900 mt-0.5">
                          {ad.headline}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleCopy(ad.id, `${ad.headline}\n\n${ad.body}`)}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 shadow-xs"
                      >
                        {copiedId === ad.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-300" />
                            <span>Copy Post Text</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-sans whitespace-pre-wrap leading-relaxed border border-slate-200/80">
                      {ad.body}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SMS Referral */}
          {activeTab === 'sms' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Direct 1-Click SMS Invites for Clients & Barn Managers</span>
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Send this quick text to past customers, friends, or barn owners. When they tap the link on their phone, they can inspect their car, estimate damage, or book $0 down in under a minute.
                </p>
              </div>

              {/* Pre-written SMS Templates */}
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Template 1: For Horse Barn Managers / Equestrians
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-xs text-slate-800 leading-relaxed border border-slate-200">
                    "Hey! Jamel Tyler here from JustMelDetail. I detail horse trailers on-site in Aiken using quiet electric 2,000 PSI equipment so horses never get spooked by loud generators. We do rubber mat pulling, acid wash, and 220°F steam sanitizing starting at $350-$450. You can view our open windows with $0 deposit here: {currentUrl}"
                  </p>
                  <div className="flex gap-2 justify-end">
                    <a
                      href={`sms:?&body=${encodeURIComponent(
                        `Hey! Jamel Tyler here from JustMelDetail. I detail horse trailers on-site in Aiken using quiet electric 2,000 PSI equipment so horses never get spooked by loud generators. We do rubber mat pulling, acid wash, and 220°F steam sanitizing starting at $350-$450. You can view our open windows with $0 deposit here: ${currentUrl}`
                      )}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open SMS on Phone</span>
                    </a>
                    <button
                      onClick={() =>
                        handleCopy(
                          'sms_eq',
                          `Hey! Jamel Tyler here from JustMelDetail. I detail horse trailers on-site in Aiken using quiet electric 2,000 PSI equipment so horses never get spooked by loud generators. We do rubber mat pulling, acid wash, and 220°F steam sanitizing starting at $350-$450. You can view our open windows with $0 deposit here: ${currentUrl}`
                        )
                      }
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                    >
                      {copiedId === 'sms_eq' ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Template 2: General Automotive / Neighborhood Client
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-xs text-slate-800 leading-relaxed border border-slate-200">
                    "Hey! If you or anyone in the neighborhood needs a mobile detail this week, I'm working around Aiken from 7 to dark. Every full detail includes our verified VIN Digital Passport & door jamb QR badge to boost trade-in value. You can check instant quotes with $0 deposit here: ${currentUrl} - Jamel (${profile.phone})"
                  </p>
                  <div className="flex gap-2 justify-end">
                    <a
                      href={`sms:?&body=${encodeURIComponent(
                        `Hey! If you or anyone in the neighborhood needs a mobile detail this week, I'm working around Aiken from 7 to dark. Every full detail includes our verified VIN Digital Passport & door jamb QR badge to boost trade-in value. You can check instant quotes with $0 deposit here: ${currentUrl} - Jamel (${profile.phone})`
                      )}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open SMS on Phone</span>
                    </a>
                    <button
                      onClick={() =>
                        handleCopy(
                          'sms_auto',
                          `Hey! If you or anyone in the neighborhood needs a mobile detail this week, I'm working around Aiken from 7 to dark. Every full detail includes our verified VIN Digital Passport & door jamb QR badge to boost trade-in value. You can check instant quotes with $0 deposit here: ${currentUrl} - Jamel (${profile.phone})`
                        )
                      }
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                    >
                      {copiedId === 'sms_auto' ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Travel & Profitability Calculator */}
          {activeTab === 'calculator' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-wider block">
                  Jamel Tyler's Rule of Travel:
                </span>
                <h4 className="text-base font-extrabold text-white">
                  "Up to 2 Hours Away at Most — It Must Be Profitable"
                </h4>
                <p className="text-xs text-slate-300">
                  Use this interactive tool when someone calls from Columbia, Augusta, Lexington, or outlying horse farms. It automatically calculates your travel fee so you never work at a loss.
                </p>
              </div>

              {/* Calculator Controls */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-800">
                      One-Way Driving Distance from Aiken, SC:
                    </label>
                    <span className="font-mono text-sm font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      {distanceMiles} Miles (~{travelHours} hrs drive)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="115"
                    step="5"
                    value={distanceMiles}
                    onChange={(e) => setDistanceMiles(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>5 mi (Local Aiken)</span>
                    <span>50 mi (1 hr)</span>
                    <span>115 mi (~2 hrs max)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Job Category:
                    </label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                    >
                      <option value="horse_trailer">Equestrian Trailer (Acid & Mat Pull)</option>
                      <option value="auto_restoration">Full Automotive Restoration (Paint + Steam)</option>
                      <option value="maintenance">SUV / Truck Maintenance Detail</option>
                    </select>
                  </div>

                  {jobType === 'horse_trailer' && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Trailer Size & Condition:
                      </label>
                      <select
                        value={trailerCondition}
                        onChange={(e) => setTrailerCondition(e.target.value as any)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                      >
                        <option value="small">Small Bumper Pull (Starts at $350)</option>
                        <option value="standard">Standard 2-3 Horse Rig ($400 - $450)</option>
                        <option value="severe">Heavy 4-6 Horse Gooseneck with Living Quarters ($550+)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Calculation Summary Card */}
                <div className="p-4 bg-white rounded-2xl border-2 border-slate-300 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Base Service Rate:</span>
                    <span className="font-mono font-bold text-slate-900">${baseJobPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Travel Surcharge (Gas + Driving Time):</span>
                    <span className="font-mono font-bold text-amber-600">
                      {travelFee > 0 ? `+$${travelFee}` : '$0 (Within Aiken Local Zone)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Estimated Round-Trip Fuel Expense:</span>
                    <span className="font-mono text-slate-500">-${fuelCost}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Client Quote</span>
                      <span className="text-xl font-black text-slate-950 font-mono">${totalQuote}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 block">Net Estimated Profit</span>
                      <span className="text-xl font-black text-emerald-600 font-mono">${netEstimatedProfit}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 italic text-center">
                  Always confirm client has an outdoor water connection before driving over 30 minutes.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Printable Barn Bulletin Flyer */}
          {activeTab === 'flyer' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Print this clean bulletin to post at Aiken tack rooms and stable feed sheds:
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Flyer</span>
                </button>
              </div>

              {/* Printable Canvas */}
              <div className="p-6 bg-white rounded-2xl border-4 border-slate-900 shadow-md space-y-4 text-slate-950">
                <div className="border-b-2 border-slate-900 pb-3 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 font-mono block">
                    AIKEN EQUESTRIAN TRAILER SPECIALIST
                  </span>
                  <h3 className="text-xl font-black tracking-tight text-slate-950 mt-1">
                    {profile.businessName} • On-Site Barn Service
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Lead Detailer: Jamel Tyler • Direct Phone: {profile.phone}
                  </p>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300 text-xs space-y-1">
                  <h5 className="font-black text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>OUR ZERO-ANIMAL AGITATION COMMITMENT</span>
                  </h5>
                  <p className="text-[11px] text-emerald-900 leading-snug">
                    We use your standard barn water connection and run quiet electric 2,000 PSI equipment (1.8 GPM). We NEVER bring roaring combustion generators that spook show horses. If there is ever an animal welfare disagreement, money will be returned.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">Aluminum Acid Flush</span>
                    <p className="text-[11px] text-slate-600">
                      Stops oxidation, removes road film, restores diamond plate and brightens metal.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">Rubber Stall Mat Pulling</span>
                    <p className="text-[11px] text-slate-600">
                      Deep sub-floor wash & bio-enzyme neutralization of caustic horse urine salts.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pricing Baseline:</span>
                    <span className="font-black text-slate-900">$400 - $450 Standard ($350 Min for Small)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Call / Text Jamel:</span>
                    <span className="font-black text-emerald-700 font-mono text-sm">{profile.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="text-slate-500 text-[11px] flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Official Hours: 9-5 • Extended: 7 to Dark • Travel up to 2 hours</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
