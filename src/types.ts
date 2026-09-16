export type VehicleType = 'sedan' | 'suv' | 'truck' | 'coupe' | 'horse_trailer';

export type SimulatorMode = 'exterior' | 'interior';

export type SeverityLevel = 'minor' | 'moderate' | 'severe';

export type DefectType = 'exterior_defect' | 'interior_stain';

export interface DefectDefinition {
  id: string;
  name: string;
  type: DefectType;
  categoryName: string;
  segment?: 'automotive' | 'equestrian' | 'universal';
  color: string;
  iconName: string;
  defaultTreatment: string;
  descriptionHint: string;
  severityEstimates: {
    minor: string;
    moderate: string;
    severe: string;
  };
}

export interface DefectPin {
  id: string;
  defectId: string;
  name: string;
  type: DefectType;
  mode: SimulatorMode;
  panelName: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  severity: SeverityLevel;
  description: string;
  stainAge?: 'Fresh (< 24 hrs)' | 'Recent (1-7 Days)' | 'Set-In (> 1 Month)' | 'Old / Baked-In';
  recommendedTreatment: string;
  clientPhotoUrl?: string;
  createdAt: number;
}

export interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  color: string;
  paintType: 'Gloss Clearcoat' | 'Matte / Satin' | 'Metallic / Pearl' | 'Ceramic Coated';
  interiorType: 'Fabric / Carpet Cloth' | 'Natural Leather' | 'Perforated Leather' | 'Synthetic / Alcantara';
}

export interface DetailingPackage {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  startingPrice: number;
  highlight: string;
  features: string[];
  isSubscription?: boolean;
  segment?: 'automotive' | 'equestrian';
}

export interface BusinessProfile {
  businessName: string;
  fullTitle: string;
  owner: string;
  location: string;
  phone: string;
  cashApp: string;
  emails: string[];
  mottoQuote: string;
  officialHours?: string;
  flexibleHours?: string;
  travelRadius?: string;
  waterPolicy?: string;
  equipmentSpec?: string;
  animalWelfareGuarantee?: string;
  horseTrailerPricing?: {
    startingStandard: number;
    minimumSmall: number;
    conditionsNote: string;
  };
}

export interface AIImageResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  prompt: string;
  model: string;
  size?: '1K' | '2K' | '4K';
  aspectRatio?: string;
  sourceType: 'edited' | 'generated-pro' | 'canvas-export';
  notes?: string;
}

export interface VINServiceRecord {
  id: string;
  date: string; // e.g., '2026-08-14'
  timestamp: number;
  odometer: number | string; // e.g. 18,450 miles or '120 Trailer Tow Hours'
  technician: string; // e.g. 'Jamel Tyler (JustMelDetail)'
  packageId: string;
  packageName: string;
  servicesApplied: {
    waxOrCoating?: {
      applied: boolean;
      type: string; // 'Carnuba Wax + Synthetic UV Barrier' | 'Ceramic Hydrophobic Sealant' | 'Spray Wax Maintenance'
      expirationDate: string;
      daysRemaining: number;
    };
    paintCorrection?: {
      applied: boolean;
      stages: number;
      micronsPre: number;
      micronsPost: number;
      swirlEliminationRate: string; // e.g. '88% Swirls Eliminated'
    };
    interiorExtraction?: {
      applied: boolean;
      steamSanitized: boolean;
      carpetExtraction: boolean;
      bioDeodorized: boolean;
    };
    leatherCare?: {
      applied: boolean;
      product: string;
    };
    equestrianServices?: {
      matPulling: boolean;
      acidFlush: boolean;
      tackRoomSanitized: boolean;
      pastureSafeBioWash: boolean;
    };
  };
  conditionScore: number; // 0 - 100
  resaleGrade: 'Pristine A+' | 'Well-Maintained A' | 'Good B+';
  notes: string;
  certificateNumber: string; // e.g. 'JMD-CERT-9402'
  verifiedBy: string;
}

export interface VINPassport {
  vin: string;
  type: 'automotive' | 'equestrian_trailer';
  vehicleInfo: VehicleInfo & {
    trim?: string;
    bodyStyle?: string;
    engine?: string;
    manufactureYear?: string;
    assemblyPlant?: string;
  };
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  serviceRecords: VINServiceRecord[];
  activeProtections: {
    waxStatus: {
      isProtected: boolean;
      lastAppliedDate: string;
      productName: string;
      daysRemaining: number;
      percentageRemaining: number;
    };
    interiorSanitizationStatus: {
      isSanitized: boolean;
      lastSteamDate: string;
      germFreeGuaranteeDays: number;
    };
    paintCorrectionStatus: {
      isCorrected: boolean;
      lastCorrectionDate: string;
      swirlClearPercent: number;
    };
    equestrianTrailerStatus?: {
      lastAcidFlushDate: string;
      lastMatPullDate: string;
      aluminumOxidationStatus: string;
    };
  };
  insuranceProofScore: number; // e.g. 98/100
  estimatedResaleAppraisalBoost: number; // e.g. 1850 ($)
}

export type BookingStep = 'booking' | 'verification' | 'confirmation_email' | 'calendar';

export interface BookingData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceAddress: string;
  vin: string;
  vinOption: 'on_arrival' | 'manual' | 'photo';
  vinPhotoUrl?: string;
  vehicleType: VehicleType;
  vehicleSummary: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  preferredDate: string;
  preferredTime: string;
  arrivalWindow: 'morning' | 'afternoon' | 'evening';
  paymentPreference: 'pay_on_completion' | 'card_deposit';
  bookingCategory: 'appointment' | 'subscription';
  includeWaxTopup: boolean;
  specialInstructions: string;
  serviceAreaVerified?: boolean;
}

export interface BookingVerificationState {
  step: BookingStep;
  bookingData: BookingData;
  verificationCode: string;
  enteredCode: string;
  isCodeSent: boolean;
  isVerified: boolean;
  confirmationId: string;
  clientEmailDispatched: boolean;
  detailerEmailDispatched: boolean; // jamelisjustmeldetail@gmail.com
  calendarAdded: boolean;
}
