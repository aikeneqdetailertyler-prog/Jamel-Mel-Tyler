import { VINPassport } from '../types';

export const SAMPLE_VIN_PASSPORTS: Record<string, VINPassport> = {
  // 1. BMW 330i Luxury Sedan (Mark Henderson - Aiken, SC)
  'WBA33AY08PFP59218': {
    vin: 'WBA33AY08PFP59218',
    type: 'automotive',
    vehicleInfo: {
      year: '2023',
      make: 'BMW',
      model: '330i xDrive',
      trim: 'M-Sport Package',
      color: 'Sapphire Black Metallic',
      paintType: 'Gloss Clearcoat',
      interiorType: 'Natural Leather',
      bodyStyle: '4-Door Sedan',
      engine: '2.0L Turbo Inline-4',
      manufactureYear: '2023',
      assemblyPlant: 'Munich, Germany',
    },
    ownerName: 'Mark Henderson',
    ownerEmail: 'm.henderson84@gmail.com',
    ownerPhone: '803-555-0194',
    serviceRecords: [
      {
        id: 'rec-bmw-001',
        date: '2026-08-04',
        timestamp: 1785844800000,
        odometer: 18450,
        technician: 'Jamel Tyler (JustMelDetail)',
        packageId: 'pkg_full_restoration',
        packageName: 'JustMelDetail Full Restoration & Protection',
        servicesApplied: {
          waxOrCoating: {
            applied: true,
            type: 'Dual Synthetic Polymer UV Sealant & Carnauba Gloss Topcoat',
            expirationDate: '2026-12-04',
            daysRemaining: 79,
          },
          paintCorrection: {
            applied: true,
            stages: 2,
            micronsPre: 124,
            micronsPost: 120,
            swirlEliminationRate: '92% Swirl & Hologram Leveling',
          },
          interiorExtraction: {
            applied: true,
            steamSanitized: true,
            carpetExtraction: true,
            bioDeodorized: true,
          },
          leatherCare: {
            applied: true,
            product: 'pH-Neutral Pure Lanolin Leather Conditioner (Pore-Feeding)',
          },
        },
        conditionScore: 98,
        resaleGrade: 'Pristine A+',
        notes: 'Vehicle arrived with highway lovebugs on front bumper and light clearcoat wash scratches. Multi-stage machine polished with micro-abrasives. Paint finished to deep mirror reflection. Interior steam sanitized at 220°F and locked in with hydrophobic glass coating.',
        certificateNumber: 'JMD-CERT-2026-8812',
        verifiedBy: 'Jamel Tyler, Lead Detailer',
      },
      {
        id: 'rec-bmw-002',
        date: '2026-05-10',
        timestamp: 1778414400000,
        odometer: 14120,
        technician: 'Jamel Tyler (JustMelDetail)',
        packageId: 'pkg_interior_steam',
        packageName: 'Deep Upholstery Cleaning, Steam Sanitizing & Extraction',
        servicesApplied: {
          interiorExtraction: {
            applied: true,
            steamSanitized: true,
            carpetExtraction: true,
            bioDeodorized: true,
          },
          leatherCare: {
            applied: true,
            product: 'UV-Resistant Matte Finish Leather Feed',
          },
        },
        conditionScore: 94,
        resaleGrade: 'Well-Maintained A',
        notes: 'Coffee spill extracted from passenger footwell carpet using hot water thermal extractor. Zero sugar residue remaining.',
        certificateNumber: 'JMD-CERT-2026-4521',
        verifiedBy: 'Jamel Tyler, Lead Detailer',
      },
    ],
    activeProtections: {
      waxStatus: {
        isProtected: true,
        lastAppliedDate: '2026-08-04',
        productName: 'Dual Synthetic Polymer UV Sealant & Carnauba Topcoat',
        daysRemaining: 79,
        percentageRemaining: 66,
      },
      interiorSanitizationStatus: {
        isSanitized: true,
        lastSteamDate: '2026-08-04',
        germFreeGuaranteeDays: 45,
      },
      paintCorrectionStatus: {
        isCorrected: true,
        lastCorrectionDate: '2026-08-04',
        swirlClearPercent: 92,
      },
    },
    insuranceProofScore: 99,
    estimatedResaleAppraisalBoost: 2450,
  },

  // 2. Featherlite Equestrian Horse Trailer (Carolina Equine Stable - Aiken, SC)
  '4F9FE1824H1094821': {
    vin: '4F9FE1824H1094821',
    type: 'equestrian_trailer',
    vehicleInfo: {
      year: '2024',
      make: 'Featherlite',
      model: '7441 3-Horse Slant Load with Living Quarters',
      trim: 'Warmblood Custom Tack & LQ',
      color: 'Brushed Bumper Pull White & Diamond Plate',
      paintType: 'Gloss Clearcoat',
      interiorType: 'Synthetic / Alcantara',
      bodyStyle: 'Gooseneck Equestrian Trailer',
      engine: 'Tandem 7,000 lb Rubber Torsion Axles',
      manufactureYear: '2024',
      assemblyPlant: 'Cresco, Iowa, USA',
    },
    ownerName: 'Dr. Rebecca Vance (Highfields Stables)',
    ownerEmail: 'rebecca@highfieldstables.com',
    ownerPhone: '803-555-4820',
    serviceRecords: [
      {
        id: 'rec-eq-001',
        date: '2026-08-19',
        timestamp: 1787140800000,
        odometer: '185 Tow Hours',
        technician: 'Jamel Tyler (JustMelDetail)',
        packageId: 'pkg_eq_grand_prix',
        packageName: 'The Grand Prix Full Equestrian Trailer Restoration',
        servicesApplied: {
          waxOrCoating: {
            applied: true,
            type: 'Trailer Fiberglass & Aluminum Skin High-Gloss UV Sealant',
            expirationDate: '2027-02-19',
            daysRemaining: 156,
          },
          equestrianServices: {
            matPulling: true,
            acidFlush: true,
            tackRoomSanitized: true,
            pastureSafeBioWash: true,
          },
          interiorExtraction: {
            applied: true,
            steamSanitized: true,
            carpetExtraction: true,
            bioDeodorized: true,
          },
        },
        conditionScore: 99,
        resaleGrade: 'Pristine A+',
        notes: 'Commercial on-site barn service in Aiken, SC. All 3 heavy rubber stall mats pulled. Aluminum diamond floor acid-flushed to dissolve equine ammonia urine salts and prevent sub-floor aluminum pitting. Tack room cobwebs, dust and mildew completely vacuumed and treated with horse-safe biodegradable antifungal spray. Living quarters mattress steam sanitized at 220°F.',
        certificateNumber: 'JMD-CERT-2026-EQ991',
        verifiedBy: 'Jamel Tyler, Equestrian Specialist',
      },
    ],
    activeProtections: {
      waxStatus: {
        isProtected: true,
        lastAppliedDate: '2026-08-19',
        productName: 'Trailer Aluminum & Gelcoat UV Barrier (Pasture Safe)',
        daysRemaining: 156,
        percentageRemaining: 86,
      },
      interiorSanitizationStatus: {
        isSanitized: true,
        lastSteamDate: '2026-08-19',
        germFreeGuaranteeDays: 60,
      },
      paintCorrectionStatus: {
        isCorrected: true,
        lastCorrectionDate: '2026-08-19',
        swirlClearPercent: 95,
      },
      equestrianTrailerStatus: {
        lastAcidFlushDate: '2026-08-19',
        lastMatPullDate: '2026-08-19',
        aluminumOxidationStatus: 'Zero Oxidation • Protected Sub-floor Drainage',
      },
    },
    insuranceProofScore: 100,
    estimatedResaleAppraisalBoost: 4800,
  },

  // 3. Ford F-150 Lariat Truck (Jason Miller - Aiken, SC)
  '1FTFW1ED5PFA83921': {
    vin: '1FTFW1ED5PFA83921',
    type: 'automotive',
    vehicleInfo: {
      year: '2023',
      make: 'Ford',
      model: 'F-150 Lariat 4x4',
      trim: 'Sport Appearance Package',
      color: 'Oxford White',
      paintType: 'Gloss Clearcoat',
      interiorType: 'Natural Leather',
      bodyStyle: 'Crew Cab Pickup',
      engine: '3.5L V6 EcoBoost',
      manufactureYear: '2023',
      assemblyPlant: 'Dearborn, Michigan, USA',
    },
    ownerName: 'Jason Miller',
    ownerEmail: 'jmiller.aiken@gmail.com',
    ownerPhone: '803-555-7734',
    serviceRecords: [
      {
        id: 'rec-ford-001',
        date: '2026-07-22',
        timestamp: 1784721600000,
        odometer: 29400,
        technician: 'Jamel Tyler (JustMelDetail)',
        packageId: 'pkg_paint_correction',
        packageName: 'Paint Correction, Buffing & Polishing with Wax Shield',
        servicesApplied: {
          waxOrCoating: {
            applied: true,
            type: 'Hydrophobic Ceramic Spray Wax Shield',
            expirationDate: '2026-10-22',
            daysRemaining: 36,
          },
          paintCorrection: {
            applied: true,
            stages: 1,
            micronsPre: 135,
            micronsPost: 133,
            swirlEliminationRate: '86% Swirl Elimination',
          },
        },
        conditionScore: 92,
        resaleGrade: 'Well-Maintained A',
        notes: 'Extensive front bumper highway insect cleanup. Chrome wheel barrels acid decontaminated and dressed with matte dry-touch silicone tire barrier.',
        certificateNumber: 'JMD-CERT-2026-7281',
        verifiedBy: 'Jamel Tyler, Lead Detailer',
      },
    ],
    activeProtections: {
      waxStatus: {
        isProtected: true,
        lastAppliedDate: '2026-07-22',
        productName: 'Hydrophobic Ceramic Spray Wax Shield',
        daysRemaining: 36,
        percentageRemaining: 40,
      },
      interiorSanitizationStatus: {
        isSanitized: false,
        lastSteamDate: 'Over 6 Months Ago',
        germFreeGuaranteeDays: 0,
      },
      paintCorrectionStatus: {
        isCorrected: true,
        lastCorrectionDate: '2026-07-22',
        swirlClearPercent: 86,
      },
    },
    insuranceProofScore: 93,
    estimatedResaleAppraisalBoost: 1650,
  },
};

/**
 * High-fidelity local VIN parser and fallback generator
 * Handles standard 17-character ISO 3779 VINs and trailer serial codes
 */
export function decodeVinDetails(vin: string) {
  const cleanVin = vin.trim().toUpperCase();

  // Check known sample passports first
  if (SAMPLE_VIN_PASSPORTS[cleanVin]) {
    return SAMPLE_VIN_PASSPORTS[cleanVin];
  }

  // Model year lookup table for 10th character
  const yearCodeMap: Record<string, string> = {
    A: '2010', B: '2011', C: '2012', D: '2013', E: '2014', F: '2015',
    G: '2016', H: '2017', J: '2018', K: '2019', L: '2020', M: '2021',
    N: '2022', P: '2023', R: '2024', S: '2025', T: '2026', V: '2027',
  };

  const tenthChar = cleanVin.length >= 10 ? cleanVin[9] : 'P';
  const inferredYear = yearCodeMap[tenthChar] || '2024';

  const wmi = cleanVin.slice(0, 3);
  let make = 'Custom Vehicle';
  let bodyStyle = 'Vehicle / Chassis';
  let type: 'automotive' | 'equestrian_trailer' = 'automotive';

  if (wmi.startsWith('WB') || wmi.startsWith('4US')) {
    make = 'BMW';
    bodyStyle = 'Sedan / Coupe';
  } else if (wmi.startsWith('1FT') || wmi.startsWith('1FA') || wmi.startsWith('1FB')) {
    make = 'Ford';
    bodyStyle = 'Truck / SUV';
  } else if (wmi.startsWith('1GC') || wmi.startsWith('1GT')) {
    make = 'Chevrolet / GMC';
    bodyStyle = 'Truck / SUV';
  } else if (wmi.startsWith('1HG') || wmi.startsWith('2HG')) {
    make = 'Honda';
    bodyStyle = 'Sedan / Crossover';
  } else if (wmi.startsWith('4T1') || wmi.startsWith('JT')) {
    make = 'Toyota';
    bodyStyle = 'Sedan / SUV';
  } else if (wmi.startsWith('5YJ') || wmi.startsWith('7SA')) {
    make = 'Tesla';
    bodyStyle = 'Electric Sedan / SUV';
  } else if (wmi.startsWith('4F9') || cleanVin.includes('TRAILER') || cleanVin.includes('HORSE')) {
    make = 'Featherlite / Sundowner';
    bodyStyle = 'Equestrian Horse Trailer';
    type = 'equestrian_trailer';
  }

  // Create clean initial passport for any newly typed VIN
  const newPassport: VINPassport = {
    vin: cleanVin,
    type,
    vehicleInfo: {
      year: inferredYear,
      make,
      model: type === 'equestrian_trailer' ? 'Slant-Load Gooseneck' : 'Performance Series',
      trim: 'Standard Equipment',
      color: 'Customer Finish',
      paintType: 'Gloss Clearcoat',
      interiorType: 'Natural Leather',
      bodyStyle,
      engine: type === 'equestrian_trailer' ? 'Tandem Torsion Axles' : 'Gasoline Fuel Injected',
      manufactureYear: inferredYear,
      assemblyPlant: 'Verified North American / European Spec',
    },
    ownerName: 'Valued Client',
    ownerEmail: 'client@example.com',
    ownerPhone: '803-555-0100',
    serviceRecords: [],
    activeProtections: {
      waxStatus: {
        isProtected: false,
        lastAppliedDate: 'Pending Initial Application',
        productName: 'None on record (Protection due)',
        daysRemaining: 0,
        percentageRemaining: 0,
      },
      interiorSanitizationStatus: {
        isSanitized: false,
        lastSteamDate: 'Pending Inspection',
        germFreeGuaranteeDays: 0,
      },
      paintCorrectionStatus: {
        isCorrected: false,
        lastCorrectionDate: 'Pending Clearcoat Leveling',
        swirlClearPercent: 0,
      },
      equestrianTrailerStatus: type === 'equestrian_trailer' ? {
        lastAcidFlushDate: 'Not logged',
        lastMatPullDate: 'Not logged',
        aluminumOxidationStatus: 'Inspection Recommended',
      } : undefined,
    },
    insuranceProofScore: 82,
    estimatedResaleAppraisalBoost: 950,
  };

  return newPassport;
}
