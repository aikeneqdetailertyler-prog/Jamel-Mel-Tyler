import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  ShieldCheck,
  Calendar,
  Clock,
  Car,
  FileCheck,
  Download,
  Printer,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Plus,
  RefreshCw,
  QrCode,
  Award,
  DollarSign,
  ChevronRight,
  Droplet,
  Info,
  Smartphone,
  Copy,
  Check,
  Share2,
  Phone,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { VINPassport, VINServiceRecord } from '../types';
import { SAMPLE_VIN_PASSPORTS, decodeVinDetails } from '../data/vinPassports';
import { JUST_MEL_DETAIL_PROFILE } from '../data/defects';

interface VinSoftwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookingWithVin?: (vin: string, vehicleSummary: string) => void;
  initialVin?: string;
  initialTab?: 'passport' | 'qr_passport' | 'certificate' | 'add_service';
}

export const VinSoftwareModal: React.FC<VinSoftwareModalProps> = ({
  isOpen,
  onClose,
  onOpenBookingWithVin,
  initialVin,
  initialTab,
}) => {
  const [vinInput, setVinInput] = useState(initialVin || 'WBA33AY08PFP59218');
  const [currentPassport, setCurrentPassport] = useState<VINPassport>(
    SAMPLE_VIN_PASSPORTS[initialVin || 'WBA33AY08PFP59218'] || SAMPLE_VIN_PASSPORTS['WBA33AY08PFP59218']
  );
  const [activeTab, setActiveTab] = useState<'passport' | 'qr_passport' | 'certificate' | 'add_service'>(
    initialTab || 'passport'
  );
  const [isDecoding, setIsDecoding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPhoneSimulated, setIsPhoneSimulated] = useState(false);

  // New Service Record Form State
  const [newOdometer, setNewOdometer] = useState('22,100');
  const [newPackage, setNewPackage] = useState('Paint Correction & Wax Top-Up');
  const [newWaxApplied, setNewWaxApplied] = useState(true);
  const [newNotes, setNewNotes] = useState('Maintenance wash, machine buffed gloss topcoat, UV paint shield renewed.');

  // Sync with initialVin if changed
  useEffect(() => {
    if (initialVin && initialVin !== vinInput) {
      handleSearchVin(initialVin);
    }
  }, [initialVin]);

  // Sync with initialTab if provided
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!isOpen) return null;

  const profile = JUST_MEL_DETAIL_PROFILE;

  const handleSearchVin = async (vinToSearch?: string) => {
    const targetVin = (vinToSearch || vinInput).trim().toUpperCase();
    if (!targetVin) return;

    setIsDecoding(true);
    setFeedbackMsg('');

    try {
      // If found in local pre-seeded records, load immediately
      if (SAMPLE_VIN_PASSPORTS[targetVin]) {
        setCurrentPassport(SAMPLE_VIN_PASSPORTS[targetVin]);
        setVinInput(targetVin);
      } else {
        // Query NHTSA Free VPIC API
        try {
          const res = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${encodeURIComponent(targetVin)}?format=json`
          );
          if (res.ok) {
            const data = await res.json();
            const result = data?.Results?.[0];
            if (result && result.Make) {
              const decoded = decodeVinDetails(targetVin);
              decoded.vehicleInfo.year = result.ModelYear || decoded.vehicleInfo.year;
              decoded.vehicleInfo.make = result.Make || decoded.vehicleInfo.make;
              decoded.vehicleInfo.model = result.Model || decoded.vehicleInfo.model;
              decoded.vehicleInfo.trim = result.Trim || decoded.vehicleInfo.trim;
              decoded.vehicleInfo.bodyStyle = result.BodyClass || decoded.vehicleInfo.bodyStyle;
              decoded.vehicleInfo.assemblyPlant = `${result.PlantCity || ''} ${result.PlantCountry || ''}`.trim() || decoded.vehicleInfo.assemblyPlant;
              setCurrentPassport(decoded);
              setVinInput(targetVin);
              setFeedbackMsg(`✓ Verified via NHTSA database: ${decoded.vehicleInfo.year} ${decoded.vehicleInfo.make} ${decoded.vehicleInfo.model}`);
            } else {
              const fallback = decodeVinDetails(targetVin);
              setCurrentPassport(fallback);
              setVinInput(targetVin);
            }
          } else {
            const fallback = decodeVinDetails(targetVin);
            setCurrentPassport(fallback);
            setVinInput(targetVin);
          }
        } catch {
          const fallback = decodeVinDetails(targetVin);
          setCurrentPassport(fallback);
          setVinInput(targetVin);
        }
      }
    } finally {
      setIsDecoding(false);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: VINServiceRecord = {
      id: `rec-usr-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      odometer: newOdometer,
      technician: 'Jamel Tyler (JustMelDetail)',
      packageId: 'pkg_custom_maintenance',
      packageName: newPackage,
      servicesApplied: {
        waxOrCoating: newWaxApplied
          ? {
              applied: true,
              type: 'Hydrophobic Polymer UV Wax Shield',
              expirationDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
              daysRemaining: 90,
            }
          : undefined,
      },
      conditionScore: 99,
      resaleGrade: 'Pristine A+',
      notes: newNotes,
      certificateNumber: `JMD-CERT-${Math.floor(1000 + Math.random() * 9000)}`,
      verifiedBy: 'Jamel Tyler, Lead Detailer',
    };

    const updatedPassport: VINPassport = {
      ...currentPassport,
      serviceRecords: [newRecord, ...currentPassport.serviceRecords],
      activeProtections: {
        ...currentPassport.activeProtections,
        waxStatus: newWaxApplied
          ? {
              isProtected: true,
              lastAppliedDate: newRecord.date,
              productName: 'Hydrophobic Polymer UV Wax Shield (Renewed)',
              daysRemaining: 90,
              percentageRemaining: 100,
            }
          : currentPassport.activeProtections.waxStatus,
      },
      insuranceProofScore: 100,
      estimatedResaleAppraisalBoost: currentPassport.estimatedResaleAppraisalBoost + 300,
    };

    setCurrentPassport(updatedPassport);
    setActiveTab('passport');
    setFeedbackMsg('✓ New service entry officially certified and appended to VIN ledger!');
  };

  const vehicleSummary = `${currentPassport.vehicleInfo.year} ${currentPassport.vehicleInfo.make} ${currentPassport.vehicleInfo.model}`;

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}?vin=${encodeURIComponent(currentPassport.vin)}`
      : `https://justmeldetail.app?vin=${encodeURIComponent(currentPassport.vin)}`;

  const handleCopyShareUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  JustMelDetail VIN Software & Service Passport
                </h2>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Insurance & Resale Grade
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official documented maintenance ledger • Last service tracker • Paint protection countdown
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

        {/* VIN Search Bar & Sample Chips */}
        <div className="p-3.5 bg-slate-900 border-b border-slate-800 text-white shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={vinInput}
                onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                placeholder="Enter 17-character VIN or Trailer Chassis ID..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-mono tracking-wider text-white placeholder-slate-500 outline-hidden focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => handleSearchVin()}
              disabled={isDecoding}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/30 disabled:opacity-50"
            >
              {isDecoding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>{isDecoding ? 'Decoding...' : 'Lookup VIN'}</span>
            </button>
          </div>

          {/* Quick Sample VIN Chips */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto text-[11px] pb-1">
            <span className="text-slate-400 shrink-0">Quick Demo VINs:</span>
            <button
              onClick={() => handleSearchVin('WBA33AY08PFP59218')}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md font-mono shrink-0 transition-colors"
            >
              BMW 330i (Sedan)
            </button>
            <button
              onClick={() => handleSearchVin('4F9FE1824H1094821')}
              className="px-2 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-md font-mono shrink-0 transition-colors"
            >
              🐴 Featherlite Horse Trailer
            </button>
            <button
              onClick={() => handleSearchVin('1FTFW1ED5PFA83921')}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md font-mono shrink-0 transition-colors"
            >
              Ford F-150 Lariat
            </button>
          </div>

          {feedbackMsg && (
            <div className="mt-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1 rounded-lg">
              {feedbackMsg}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 text-xs shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('passport')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'passport'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Documented Service Ledger</span>
          </button>
          <button
            onClick={() => setActiveTab('qr_passport')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'qr_passport'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Digital Passport QR</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
              Mobile Scan
            </span>
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'certificate'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Insurance & Resale Certificate</span>
          </button>
          <button
            onClick={() => setActiveTab('add_service')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'add_service'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Log Detailer Service</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-slate-800 text-xs">
          {activeTab === 'passport' && (
            <div className="space-y-6">
              {/* Vehicle Identity & Insurance Value Header */}
              <div className="p-4 bg-gradient-to-r from-blue-50 via-slate-50 to-emerald-50 rounded-2xl border border-blue-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900">{vehicleSummary}</span>
                    <span className="font-mono text-[11px] bg-slate-200 px-2 py-0.5 rounded text-slate-800 font-bold">
                      VIN: {currentPassport.vin}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1 flex items-center gap-2">
                    <span>Registered to: <strong>{currentPassport.ownerName}</strong></span>
                    <span>•</span>
                    <span>Service Base: Aiken, SC</span>
                  </p>
                </div>

                {/* Insurance and Resale Metrics Badge + Quick QR Access */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setActiveTab('qr_passport')}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 shadow-xs transition-colors"
                    title="Open scannable mobile QR code for this vehicle"
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>Scan Mobile QR</span>
                  </button>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Insurance Score</span>
                    <span className="text-base font-black text-blue-600 font-mono">
                      {currentPassport.insuranceProofScore}/100
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-center shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">Resale Boost</span>
                    <span className="text-base font-black text-emerald-700 font-mono">
                      +${currentPassport.estimatedResaleAppraisalBoost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Protection Countdown Trackers */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Real-Time Maintenance & Protection Status</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Wax & Sealant Countdown Card */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Droplet className="w-4 h-4 text-amber-500" />
                        <span>Wax & UV Barrier</span>
                      </span>
                      {currentPassport.activeProtections.waxStatus.isProtected ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Due
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {currentPassport.activeProtections.waxStatus.productName}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Last Applied: <strong>{currentPassport.activeProtections.waxStatus.lastAppliedDate}</strong>
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>Protection Life</span>
                        <span className="font-bold text-slate-700">
                          {currentPassport.activeProtections.waxStatus.daysRemaining} Days Left
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${currentPassport.activeProtections.waxStatus.percentageRemaining}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interior Steam & Sanitization Card */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>Interior Sanitization</span>
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        220°F Thermal
                      </span>
                    </div>

                    <div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Hot Water Extraction & Bio-Enzyme Neutralizer
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Last Steam Clean: <strong>{currentPassport.activeProtections.interiorSanitizationStatus.lastSteamDate}</strong>
                      </p>
                    </div>

                    <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      Zero allergen and bacterial residue verified on steering wheel, console & cloth fibers.
                    </div>
                  </div>

                  {/* Paint Correction / Equestrian Card */}
                  {currentPassport.type === 'equestrian_trailer' ? (
                    <div className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <span>🐴</span>
                          <span>Stall & Sub-Floor Health</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Acid Flushed
                        </span>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {currentPassport.activeProtections.equestrianTrailerStatus?.aluminumOxidationStatus}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Last Acid Flush: <strong>{currentPassport.activeProtections.equestrianTrailerStatus?.lastAcidFlushDate}</strong>
                        </p>
                      </div>

                      <div className="text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        Rubber mats pulled and urine ammonia neutralized to protect sub-floor aluminum.
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-purple-600" />
                          <span>Clearcoat Correction</span>
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                          Stage 2 Leveling
                        </span>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {currentPassport.activeProtections.paintCorrectionStatus.swirlClearPercent}% Swirl & Hologram Leveling
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Last Corrected: <strong>{currentPassport.activeProtections.paintCorrectionStatus.lastCorrectionDate}</strong>
                        </p>
                      </div>

                      <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        Safe clearcoat thickness maintained across hood, fenders, and doors.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Documented Service History Ledger */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-blue-600" />
                    <span>Documented Service History Log ({currentPassport.serviceRecords.length} Entries)</span>
                  </h3>

                  <button
                    onClick={() => setActiveTab('add_service')}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service Entry</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {currentPassport.serviceRecords.length === 0 ? (
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500">
                      No service records yet for this VIN. Click "Log Detailer Service" to record Jamel Tyler's first detailing job.
                    </div>
                  ) : (
                    currentPassport.serviceRecords.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs space-y-2.5 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{rec.packageName}</span>
                            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                              {rec.certificateNumber}
                            </span>
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                              {rec.resaleGrade}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>{rec.date}</span>
                            <span>•</span>
                            <span className="font-mono">{rec.odometer}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {rec.notes}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-slate-500">
                          <div className="flex items-center gap-3">
                            {rec.servicesApplied.waxOrCoating?.applied && (
                              <span className="text-amber-700 font-medium">✓ Wax Shield Applied ({rec.servicesApplied.waxOrCoating.daysRemaining}d left)</span>
                            )}
                            {rec.servicesApplied.paintCorrection?.applied && (
                              <span className="text-purple-700 font-medium">✓ {rec.servicesApplied.paintCorrection.swirlEliminationRate}</span>
                            )}
                            {rec.servicesApplied.equestrianServices?.acidFlush && (
                              <span className="text-emerald-700 font-medium">✓ Sub-floor Acid Flush & Mat Pull</span>
                            )}
                          </div>
                          <span className="italic">Certified by {rec.verifiedBy}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qr_passport' && (
            <div className="space-y-6">
              {/* Feature Banner */}
              <div className="p-4 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <QrCode className="w-4 h-4" />
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                      Vehicle Digital Passport & Door Jamb QR Code
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Point any smartphone camera at this code to view the live maintenance ledger, 220°F steam sanitization records, and 90-day wax countdown verified by Jamel Tyler.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPhoneSimulated(!isPhoneSimulated)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      isPhoneSimulated
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isPhoneSimulated ? 'Hide Phone Preview' : 'Simulate Phone Scan'}</span>
                  </button>
                </div>
              </div>

              {/* QR Badge Card & Phone Simulator Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Physical Door Jamb Sticker & QR Code Generator */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-md text-center space-y-4 relative overflow-hidden">
                    {/* Badge Top Header */}
                    <div className="border-b pb-3 border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono">
                          DOOR JAMB / APPRAISAL BADGE
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Live & Verified
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-950 mt-1">
                        {profile.businessName} • Digital Vehicle Passport
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {vehicleSummary}
                      </p>
                    </div>

                    {/* Crisp QR Code with Quiet Zone */}
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-lg inline-block">
                        <QRCodeSVG
                          value={shareUrl}
                          size={190}
                          level="H"
                          includeMargin={false}
                        />
                      </div>
                      <div className="mt-3">
                        <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-md border border-slate-300 inline-block tracking-wider">
                          VIN: {currentPassport.vin}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Scan with standard iOS or Android camera app
                        </p>
                      </div>
                    </div>

                    {/* Direct Link Preview Bar */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-left">
                      <div className="truncate text-[11px] font-mono text-slate-600">
                        <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">Passport Web URL:</span>
                        <span className="truncate block font-semibold text-blue-700">{shareUrl}</span>
                      </div>
                      <button
                        onClick={handleCopyShareUrl}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Sticker Badge</span>
                      </button>

                      <button
                        onClick={() => setIsPhoneSimulated(true)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Test Mobile Scan</span>
                      </button>
                    </div>
                  </div>

                  {/* Why this helps the client & owner card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Why This QR Code Protects Vehicle Value:</span>
                    </h5>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 pl-5 list-disc">
                      <li><strong>Door Jamb Placement:</strong> Keep a 2x2" print in the driver door frame or glove box. Prospective private buyers scan it to verify uninterrupted maintenance.</li>
                      <li><strong>Insurance Appraisal Proof:</strong> In the event of hail, swirl damage, or collision, adjusters scan the QR code to verify clearcoat health prior to the incident.</li>
                      <li><strong>Equestrian Trailer Inspections:</strong> Barn managers and trailer buyers inspect dates of aluminum acid washes and subfloor urine decontamination.</li>
                    </ul>
                  </div>
                </div>

                {/* Right Column: Live Simulated Smartphone Scan Preview */}
                <div className="lg:col-span-6">
                  <div className="bg-slate-900 p-3 sm:p-5 rounded-3xl border-4 border-slate-800 shadow-2xl text-white max-w-sm mx-auto">
                    {/* Simulated Phone Notch / Status Bar */}
                    <div className="flex justify-between items-center px-4 pb-3 border-b border-slate-800 text-[10px] text-slate-400">
                      <span>9:41 AM</span>
                      <div className="w-16 h-3.5 bg-slate-950 rounded-full mx-auto" />
                      <span className="flex items-center gap-1 font-mono">5G • 100%</span>
                    </div>

                    {/* Phone Screen Body */}
                    <div className="mt-3 space-y-3">
                      {/* Scanned Header */}
                      <div className="text-center pb-2 border-b border-slate-800">
                        <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/50 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Camera Verified • JustMelDetail</span>
                        </span>
                        <h4 className="text-sm font-black text-white mt-1">
                          {vehicleSummary}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-400">
                          VIN: {currentPassport.vin}
                        </p>
                      </div>

                      {/* Live Protection Status Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/80">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">UV Wax Shield</span>
                          <span className="font-extrabold text-emerald-400 text-xs">
                            {currentPassport.activeProtections.waxStatus.daysRemaining} Days Left
                          </span>
                          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{
                                width: `${Math.min(100, Math.round((currentPassport.activeProtections.waxStatus.daysRemaining / 90) * 100))}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/80">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Steam Sanitized</span>
                          <span className="font-extrabold text-cyan-400 text-xs">
                            220°F Thermal Clean
                          </span>
                          <p className="text-[9px] text-slate-400 mt-1">
                            {currentPassport.activeProtections.interiorSanitizationStatus.lastSteamDate}
                          </p>
                        </div>
                      </div>

                      {/* Resale Boost & Insurance Score */}
                      <div className="p-2.5 bg-gradient-to-r from-blue-950/80 to-emerald-950/80 rounded-xl border border-blue-800/50 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[9px] uppercase text-blue-300 font-bold block">Appraisal Boost</span>
                          <span className="text-sm font-black text-emerald-400">
                            +${currentPassport.estimatedResaleAppraisalBoost.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] uppercase text-slate-400 font-bold block">Ledger Score</span>
                          <span className="text-sm font-black text-blue-400">
                            {currentPassport.insuranceProofScore}/100
                          </span>
                        </div>
                      </div>

                      {/* Service Log Entries Preview */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Verified Service History ({currentPassport.serviceRecords.length} records)
                        </span>
                        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                          {currentPassport.serviceRecords.map((record) => (
                            <div key={record.id} className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/50 text-[10px]">
                              <div className="flex justify-between font-bold text-white">
                                <span>{record.packageName}</span>
                                <span className="text-emerald-400">{record.resaleGrade}</span>
                              </div>
                              <div className="flex justify-between text-slate-400 mt-0.5">
                                <span>{record.date} • {record.odometer}</span>
                                <span className="font-mono text-slate-500">{record.certificateNumber}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Phone Footer Action */}
                      <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5 text-center">
                        <a
                          href={`tel:${profile.phone.replace(/-/g, '')}`}
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-950" />
                          <span>Call Jamel Tyler ({profile.phone})</span>
                        </a>

                        {onOpenBookingWithVin && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenBookingWithVin(currentPassport.vin, vehicleSummary);
                            }}
                            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-[11px] transition-colors"
                          >
                            Schedule Wax Top-Up or Service
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Official Vehicle Maintenance & Resale Certificate
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Suitable for presentation to insurance adjusters, auto appraisers, and prospective buyers.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>

              {/* Printable Certificate Sheet */}
              <div className="p-6 bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-slate-300 shadow-md space-y-6 text-slate-900">
                {/* Certificate Header with Embedded QR Code */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block">
                      CERTIFIED DETAILING PASSPORT • JUSTMELDETAIL
                    </span>
                    <h1 className="text-xl font-black text-slate-950 tracking-tight">
                      PROOF OF PROFESSIONAL MAINTENANCE
                    </h1>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Issued by Jamel Tyler • Serving Aiken, SC & Surrounding Areas • Direct: {profile.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white border border-slate-300 rounded-xl shadow-2xs text-center flex flex-col items-center">
                      <QRCodeSVG value={shareUrl} size={64} level="M" />
                      <span className="text-[8px] font-mono text-slate-600 uppercase font-bold mt-1">Scan for Ledger</span>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center font-bold text-lg mx-auto mb-1">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Verified Clean Ledger</span>
                    </div>
                  </div>
                </div>

                {/* Certificate Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-100/70 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Vehicle</span>
                    <span className="font-bold text-slate-900">{vehicleSummary}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Documented VIN</span>
                    <span className="font-mono font-bold text-blue-700">{currentPassport.vin}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Client</span>
                    <span className="font-bold text-slate-900">{currentPassport.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Overall Grade</span>
                    <span className="font-black text-emerald-700">{currentPassport.serviceRecords[0]?.resaleGrade || 'Pristine A+'}</span>
                  </div>
                </div>

                {/* Proof Statements for Insurance and Resale */}
                <div className="space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px]">Underwriting & Value Certification:</h4>
                  <p className="text-slate-700 leading-relaxed">
                    This document certifies that the aforementioned vehicle has undergone comprehensive preventative detailing and maintenance under the care of <strong>JustMelDetail</strong>. Vehicle clearcoat, interior upholstery, and structural finishes have been inspected and sealed against environmental degradation.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Clearcoat UV Protection: Active ({currentPassport.activeProtections.waxStatus.daysRemaining} days remaining)</span>
                    </li>
                    <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Cabin Sanitization: Complete 220°F steam & thermal extraction</span>
                    </li>
                    <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Estimated Resale Value Preservation: +${currentPassport.estimatedResaleAppraisalBoost.toLocaleString()}</span>
                    </li>
                    <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>No corrosive debris, acidic bugs, or untreated salt scale</span>
                    </li>
                  </ul>
                </div>

                {/* Sign-Off Footer */}
                <div className="pt-4 border-t border-slate-300 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-slate-900">Jamel Tyler</p>
                    <p className="text-[10px] text-slate-500">Lead Detailer & Owner, JustMelDetail</p>
                  </div>
                  <div className="text-right font-mono text-[10px] text-slate-400">
                    Certificate #{currentPassport.serviceRecords[0]?.certificateNumber || 'JMD-CERT-9021'}<br />
                    Monitored: jamelisjustmeldetail@gmail.com • (803) 514-4731
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add_service' && (
            <form onSubmit={handleAddService} className="space-y-4 max-w-xl mx-auto py-2">
              <div className="text-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">Log New Service on VIN Ledger</h3>
                <p className="text-xs text-slate-500">
                  Update last service date, wax renewal, and maintenance records for {currentPassport.vin}.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Service Package Applied</label>
                <input
                  type="text"
                  value={newPackage}
                  onChange={(e) => setNewPackage(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Odometer / Tow Hours</label>
                  <input
                    type="text"
                    value={newOdometer}
                    onChange={(e) => setNewOdometer(e.target.value)}
                    placeholder="e.g. 24,500 miles"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Wax / UV Protection Applied?</label>
                  <select
                    value={newWaxApplied ? 'yes' : 'no'}
                    onChange={(e) => setNewWaxApplied(e.target.value === 'yes')}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                  >
                    <option value="yes">Yes (Resets 90-Day Protection Countdown)</option>
                    <option value="no">No (Routine Surface Wash)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Technician Notes & Condition Report</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('passport')}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Save & Certify Entry
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500">
            VIN Software synchronized for insurance claims, buyer appraisals & maintenance reminders.
          </div>

          <div className="flex items-center gap-2">
            {onOpenBookingWithVin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBookingWithVin(currentPassport.vin, vehicleSummary);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Next Service / Wax Top-Up</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
