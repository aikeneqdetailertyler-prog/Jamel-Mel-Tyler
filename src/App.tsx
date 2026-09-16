import React, { useState, useEffect } from 'react';
import { SimulatorMode, VehicleType, SeverityLevel, DefectDefinition, DefectPin, VehicleInfo, AIImageResult } from './types';
import { INTERIOR_STAINS, EXTERIOR_DEFECTS, JUST_MEL_DETAIL_PROFILE } from './data/defects';
import { DetailingHeader } from './components/DetailingHeader';
import { DefectPalette } from './components/DefectPalette';
import { VehicleCanvas } from './components/VehicleCanvas';
import { PinInspector } from './components/PinInspector';
import { PinList } from './components/PinList';
import { DetailingQuoteModal } from './components/DetailingQuoteModal';
import { DetailerInterviewModal } from './components/DetailerInterviewModal';
import { AboutBusinessModal } from './components/AboutBusinessModal';
import { AIEditDrawer } from './components/AIEditDrawer';
import { AIProGeneratorModal } from './components/AIProGeneratorModal';
import { VinSoftwareModal } from './components/VinSoftwareModal';
import { BookingVerificationModal } from './components/BookingVerificationModal';
import { CheckCircle2, Car, Armchair, HelpCircle, ShieldCheck, Sparkles, FileText, Info, MapPin, Phone, Quote, Calendar, Mail } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<SimulatorMode>('exterior');
  const [vehicleType, setVehicleType] = useState<VehicleType>('sedan');
  const [bodyColor, setBodyColor] = useState<string>('#0F172A'); // Obsidian Black
  const [severity, setSeverity] = useState<SeverityLevel>('moderate');

  // Selected defect definition for dropping pins
  const [selectedDefect, setSelectedDefect] = useState<DefectDefinition>(EXTERIOR_DEFECTS[0]);

  // Vehicle Information
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    year: '2023',
    make: 'BMW',
    model: '330i',
    color: 'Sapphire Black',
    paintType: 'Gloss Clearcoat',
    interiorType: 'Fabric / Carpet Cloth',
  });

  // Pre-seed pins showcasing JustMelDetail's signature services (exterior scratches, bug removal, carpet extraction, rim cleaning)
  const [pins, setPins] = useState<DefectPin[]>([
    {
      id: 'pin-init-1',
      defectId: 'defect_scratch',
      name: 'Clearcoat Scratch',
      type: 'exterior_defect',
      mode: 'exterior',
      panelName: 'Driver Front Door',
      x: 52,
      y: 54,
      severity: 'moderate',
      description: 'Hairline bush scratch along door handle line, catches fingernail slightly.',
      recommendedTreatment: 'Paint correction, multi-stage rotary buffing & polishing to level clearcoat.',
      createdAt: Date.now() - 100000,
    },
    {
      id: 'pin-init-2',
      defectId: 'defect_bugs',
      name: 'Baked Front Bumper Bugs',
      type: 'exterior_defect',
      mode: 'exterior',
      panelName: 'Front Bumper & Grille (Bug Zone)',
      x: 18,
      y: 62,
      severity: 'moderate',
      description: 'Lovebug splatter and acidic highway debris etched onto bumper cover.',
      recommendedTreatment: 'Specialized citrus debugging pre-soak, neutralizer & safe foam wash.',
      createdAt: Date.now() - 80000,
    },
    {
      id: 'pin-init-3',
      defectId: 'stain_coffee',
      name: 'Coffee / Latte Spill',
      type: 'interior_stain',
      mode: 'interior',
      panelName: 'Front Passenger Carpet & Footwell',
      x: 75,
      y: 22,
      severity: 'moderate',
      stainAge: 'Recent (1-7 Days)',
      description: 'Iced caramel latte spilled between seat rail and center console carpet.',
      recommendedTreatment: 'Deep shampoo, hot water thermal extraction & steam sanitizing.',
      createdAt: Date.now() - 50000,
    },
    {
      id: 'pin-init-4',
      defectId: 'stain_cupholder',
      name: 'Sticky Cupholder & Console Gunk',
      type: 'interior_stain',
      mode: 'interior',
      panelName: 'Center Console & Cup Holder Wells',
      x: 50,
      y: 45,
      severity: 'moderate',
      description: 'Dried sugary syrup and dust stuck deep in bottom rubber liner.',
      recommendedTreatment: 'High-temperature steam nozzle blast & antimicrobial sanitizing.',
      createdAt: Date.now() - 25000,
    },
  ]);

  const [selectedPinId, setSelectedPinId] = useState<string | null>('pin-init-1');

  // Modals & Drawers
  const [isAIEditOpen, setIsAIEditOpen] = useState(false);
  const [isAIProOpen, setIsAIProOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isVinModalOpen, setIsVinModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeBookingVin, setActiveBookingVin] = useState('WBA33AY08PFP59218');
  const [activeBookingSummary, setActiveBookingSummary] = useState('2023 BMW 330i xDrive');
  const [isSunlightMode, setIsSunlightMode] = useState(false);

  // Auto-detect VIN from QR code scan URL query parameter (?vin=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlVin = params.get('vin');
      if (urlVin) {
        setActiveBookingVin(urlVin.toUpperCase());
        setIsVinModalOpen(true);
      }
    }
  }, []);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch mode handler: updates the selected defect to match mode
  const handleModeChange = (newMode: SimulatorMode) => {
    setMode(newMode);
    if (newMode === 'interior') {
      setSelectedDefect(INTERIOR_STAINS[0]); // Coffee spill
    } else {
      setSelectedDefect(EXTERIOR_DEFECTS[0]); // Clearcoat scratch
    }
  };

  // Add new pin
  const handleAddPin = (pin: DefectPin) => {
    setPins((prev) => [...prev, pin]);
    setSelectedPinId(pin.id);
    showToast(`Marked #${pins.length + 1}: ${pin.name} on ${pin.panelName}`);
  };

  // Update existing pin
  const handleUpdatePin = (updated: DefectPin) => {
    setPins((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // Delete pin
  const handleDeletePin = (id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
    if (selectedPinId === id) {
      setSelectedPinId(null);
    }
    showToast('Pin removed from inspection sheet');
  };

  // Capture canvas data URL
  const getCanvasDataUrl = (): string | null => {
    const canvas = document.getElementById('vehicle-simulation-canvas') as HTMLCanvasElement;
    if (!canvas) return null;
    return canvas.toDataURL('image/png');
  };

  const selectedPin = pins.find((p) => p.id === selectedPinId) || null;
  const selectedPinIndex = selectedPin ? pins.indexOf(selectedPin) : -1;

  const vehicleSummary = `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} in ${vehicleInfo.color}`;
  const profile = JUST_MEL_DETAIL_PROFILE;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isSunlightMode
          ? 'bg-amber-50/40 text-slate-950 selection:bg-amber-400 selection:text-black'
          : 'bg-slate-100 text-slate-900 selection:bg-blue-500 selection:text-white'
      }`}
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <DetailingHeader
        mode={mode}
        onModeChange={handleModeChange}
        pinCount={pins.length}
        onOpenAIEdit={() => setIsAIEditOpen(true)}
        onOpenAIPro={() => setIsAIProOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenInterview={() => setIsInterviewOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenVinSoftware={() => setIsVinModalOpen(true)}
        onOpenBooking={() => setIsBookingModalOpen(true)}
        isSunlightMode={isSunlightMode}
        onToggleSunlightMode={() => setIsSunlightMode(!isSunlightMode)}
      />

      {/* JustMelDetail Hero Banner & Prevention Philosophy */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white px-4 py-2.5 text-xs border-b border-blue-900/60 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="font-bold text-white tracking-wide">
              {profile.businessName}:
            </span>
            <span className="text-slate-300 italic hidden md:inline">
              "Spend a little on prevention today, or spend a lot more on correction later."
            </span>
            <span className="text-[11px] text-emerald-300 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700/50">
              Mobile Van • Aiken, SC & Equestrian Area
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-950" />
              <span>Fast 60-Sec Booking ($0 Now)</span>
            </button>

            <button
              onClick={() => setIsVinModalOpen(true)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>VIN Software</span>
            </button>

            <span className="text-slate-600 hidden sm:inline">•</span>

            <a
              href={`tel:${profile.phone.replace(/-/g, '')}`}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60 flex items-center gap-1.5 transition-colors"
              title="Call Jamel Tyler directly"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>(803) 514-4731</span>
            </a>

            <span className="text-slate-600 hidden sm:inline">•</span>

            <button
              onClick={() => setIsAboutOpen(true)}
              className="text-[11px] font-bold text-slate-300 hover:text-white underline flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Services & Mission</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Defect Palette & Pin Inspector (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Defect / Stain Selector Palette */}
            <DefectPalette
              mode={mode}
              selectedDefect={selectedDefect}
              onSelectDefect={setSelectedDefect}
              severity={severity}
              onSeverityChange={setSeverity}
              vehicleType={vehicleType}
            />

            {/* 2. Active Pin Inspector (Shows when a pin is selected or clicked) */}
            {selectedPin && (
              <PinInspector
                pin={selectedPin}
                pinIndex={selectedPinIndex}
                onUpdatePin={handleUpdatePin}
                onDeletePin={handleDeletePin}
                onClose={() => setSelectedPinId(null)}
              />
            )}

            {/* 3. Marked Pins Summary List */}
            <PinList
              pins={pins}
              selectedPinId={selectedPinId}
              onSelectPin={setSelectedPinId}
              onDeletePin={handleDeletePin}
              mode={mode}
              onSwitchMode={handleModeChange}
            />
          </div>

          {/* Right Column: Vehicle & Interior Simulation Canvas (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Interactive Blueprint Canvas */}
            <VehicleCanvas
              mode={mode}
              vehicleType={vehicleType}
              onVehicleTypeChange={setVehicleType}
              bodyColor={bodyColor}
              onBodyColorChange={setBodyColor}
              pins={pins}
              selectedPinId={selectedPinId}
              onSelectPin={setSelectedPinId}
              onAddPin={handleAddPin}
              selectedDefect={selectedDefect}
              severity={severity}
            />

            {/* Quick Action Bar Under Canvas */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsQuoteOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Detailing Intake Slip</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* AI Treatment Simulation Button (gemini-3.1-flash-image-preview) */}
                <button
                  onClick={() => setIsAIEditOpen(true)}
                  className="px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200/80 border border-amber-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>AI Treatment Simulation</span>
                  <span className="text-[10px] font-mono bg-amber-200/80 px-1 py-0.2 rounded text-amber-800">Flash 3.1</span>
                </button>

                {/* AI Pro 4K Showroom Visualizer (gemini-3-pro-image-preview) */}
                <button
                  onClick={() => setIsAIProOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-sm shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>AI Pro 4K Showroom</span>
                </button>
              </div>
            </div>

            {/* Detailer Guidance & Value Proposition Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    Pre-Service Damage Documentation
                  </h3>
                </div>
                <p className="text-[11px] text-slate-600">
                  Protects your detailing business by having clients pinpoint all pre-existing scratches and rock chips before you touch their paint.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <Armchair className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    Stain & Soil Triage
                  </h3>
                </div>
                <p className="text-[11px] text-slate-600">
                  Pre-identifies tough stains (milk/coffee tannins, ink dye, soda sugars) so mobile detailers pack the correct thermal extractors and enzymes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Contact & Trust Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
              <Car className="w-4 h-4 text-blue-400" />
              <span>{profile.businessName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 text-xs font-semibold">Jamel Tyler</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Mobile Automotive & Equestrian Trailer Detailing • Aiken, SC
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a
              href={`tel:${profile.phone.replace(/-/g, '')}`}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>(803) 514-4731</span>
            </a>

            <a
              href={`mailto:${profile.emails[0]}`}
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{profile.emails[0]}</span>
            </a>

            <span className="text-slate-400 font-mono bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700">
              Cash App: <strong className="text-emerald-400">{profile.cashApp}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-950" />
              <span>Book Appointment ($0 Now)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modal 1: Detailing Intake Slip & Quote Modal */}
      <DetailingQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        pins={pins}
        vehicleInfo={vehicleInfo}
        onUpdateVehicleInfo={setVehicleInfo}
      />

      {/* Modal 2: Detailer Discovery & Strategy Interview Modal */}
      <DetailerInterviewModal
        isOpen={isInterviewOpen}
        onClose={() => setIsInterviewOpen(false)}
        onSaveInterviewFeedback={(answers) => {
          showToast('Detailing business preferences saved!');
        }}
      />

      {/* Modal 3: JustMelDetail Profile, Services & Mission Quote Modal */}
      <AboutBusinessModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenQuote={() => {
          setIsAboutOpen(false);
          setIsQuoteOpen(true);
        }}
      />

      {/* Feature 1 Drawer: AI Treatment Simulation (gemini-3.1-flash-image-preview) */}
      <AIEditDrawer
        isOpen={isAIEditOpen}
        onClose={() => setIsAIEditOpen(false)}
        currentMockupBase64={getCanvasDataUrl()}
        vehicleSummary={vehicleSummary}
        onSaveResult={() => showToast('AI treatment simulation saved!')}
      />

      {/* Feature 2 Modal: AI Pro 4K Showroom Visualizer (gemini-3-pro-image-preview) */}
      <AIProGeneratorModal
        isOpen={isAIProOpen}
        onClose={() => setIsAIProOpen(false)}
        vehicleSummary={vehicleSummary}
        onSaveResult={() => showToast('AI Pro showroom photo saved!')}
      />

      {/* Feature 3 Modal: VIN Software & Insurance/Resale Passport */}
      <VinSoftwareModal
        isOpen={isVinModalOpen}
        onClose={() => setIsVinModalOpen(false)}
        initialVin={activeBookingVin}
        onOpenBookingWithVin={(vin, summary) => {
          setActiveBookingVin(vin);
          setActiveBookingSummary(summary);
          setIsBookingModalOpen(true);
        }}
      />

      {/* Feature 4 Modal: Automated 4-Step Booking & Verification Workflow */}
      <BookingVerificationModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialVin={activeBookingVin}
        initialVehicleSummary={activeBookingSummary}
        onOpenVinPassport={(vin) => {
          setIsVinModalOpen(true);
        }}
      />
    </div>
  );
}
