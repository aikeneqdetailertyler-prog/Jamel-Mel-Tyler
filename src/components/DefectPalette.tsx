import React, { useState, useEffect } from 'react';
import {
  Coffee,
  PenTool,
  Wine,
  Sparkles,
  Flame,
  ShieldAlert,
  CloudSnow,
  Scissors,
  AlertTriangle,
  RefreshCw,
  CircleDot,
  Layers,
  Droplet,
  Droplets,
  Maximize2,
  MousePointerClick,
  Info,
  Armchair,
  ShieldCheck,
} from 'lucide-react';
import { DefectDefinition, SimulatorMode, SeverityLevel, VehicleType } from '../types';
import { INTERIOR_STAINS, EXTERIOR_DEFECTS } from '../data/defects';

interface DefectPaletteProps {
  mode: SimulatorMode;
  selectedDefect: DefectDefinition;
  onSelectDefect: (defect: DefectDefinition) => void;
  severity: SeverityLevel;
  onSeverityChange: (severity: SeverityLevel) => void;
  vehicleType?: VehicleType;
}

const getDefectIcon = (iconName: string) => {
  switch (iconName) {
    case 'Coffee':
      return <Coffee className="w-4 h-4" />;
    case 'PenTool':
      return <PenTool className="w-4 h-4" />;
    case 'Wine':
      return <Wine className="w-4 h-4" />;
    case 'Sparkles':
      return <Sparkles className="w-4 h-4" />;
    case 'Flame':
      return <Flame className="w-4 h-4" />;
    case 'ShieldAlert':
      return <ShieldAlert className="w-4 h-4" />;
    case 'CloudSnow':
      return <CloudSnow className="w-4 h-4" />;
    case 'Scissors':
      return <Scissors className="w-4 h-4" />;
    case 'AlertTriangle':
      return <AlertTriangle className="w-4 h-4" />;
    case 'RefreshCw':
      return <RefreshCw className="w-4 h-4" />;
    case 'CircleDot':
      return <CircleDot className="w-4 h-4" />;
    case 'Layers':
      return <Layers className="w-4 h-4" />;
    case 'Droplet':
      return <Droplet className="w-4 h-4" />;
    case 'Droplets':
      return <Droplets className="w-4 h-4" />;
    case 'Maximize2':
      return <Maximize2 className="w-4 h-4" />;
    case 'Armchair':
      return <Armchair className="w-4 h-4" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

export const DefectPalette: React.FC<DefectPaletteProps> = ({
  mode,
  selectedDefect,
  onSelectDefect,
  severity,
  onSeverityChange,
  vehicleType,
}) => {
  const [segmentFilter, setSegmentFilter] = useState<'all' | 'automotive' | 'equestrian'>(
    vehicleType === 'horse_trailer' ? 'equestrian' : 'all'
  );

  // When vehicleType changes to horse_trailer, auto-switch to equestrian segment
  useEffect(() => {
    if (vehicleType === 'horse_trailer') {
      setSegmentFilter('equestrian');
    }
  }, [vehicleType]);

  const rawCatalog = mode === 'interior' ? INTERIOR_STAINS : EXTERIOR_DEFECTS;
  const catalog = rawCatalog.filter((item) => {
    if (segmentFilter === 'all') return true;
    if (segmentFilter === 'equestrian') return item.segment === 'equestrian';
    return item.segment !== 'equestrian';
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
      {/* Title & Instructions */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: selectedDefect.color }}
            />
            <span>
              {mode === 'interior' ? 'Interior Stains & Spills' : 'Exterior Paint & Body Defects'}
            </span>
          </h2>
          <span className="text-[10px] text-blue-600 bg-blue-50 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
            Step 1: Pick Type
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
          <MousePointerClick className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Select an issue below, then click on the vehicle to drop a pin.</span>
        </p>

        {/* Segment Filter (All / Auto / Equestrian Trailer) */}
        <div className="flex items-center gap-1.5 mt-2.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
          <button
            onClick={() => setSegmentFilter('all')}
            className={`flex-1 py-1 px-2 text-[10px] font-semibold rounded-md transition-colors ${
              segmentFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Services
          </button>
          <button
            onClick={() => setSegmentFilter('automotive')}
            className={`flex-1 py-1 px-2 text-[10px] font-semibold rounded-md transition-colors ${
              segmentFilter === 'automotive'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Automotive
          </button>
          <button
            onClick={() => setSegmentFilter('equestrian')}
            className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-md transition-colors flex items-center justify-center gap-1 ${
              segmentFilter === 'equestrian'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <span>🐴</span>
            <span>Equestrian</span>
          </button>
        </div>
      </div>

      {/* Defect Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
        {catalog.map((item) => {
          const isSelected = selectedDefect.id === item.id;
          return (
            <button
              key={item.id}
              id={`defect-btn-${item.id}`}
              onClick={() => onSelectDefect(item)}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-2xs"
                  style={{ backgroundColor: item.color }}
                >
                  {getDefectIcon(item.iconName)}
                </div>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">
                  {item.categoryName}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {item.defaultTreatment}
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Severity Selector */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-800">
            Initial Severity Level
          </label>
          <span className="text-[10px] text-slate-500">
            Affects detailer procedure
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'minor', label: 'Light / Surface', color: 'text-amber-700 bg-amber-50 border-amber-300' },
            { id: 'moderate', label: 'Moderate / Set-In', color: 'text-rose-700 bg-rose-50 border-rose-300' },
            { id: 'severe', label: 'Severe / Deep', color: 'text-red-900 bg-red-100 border-red-400 font-bold' },
          ].map((s) => {
            const isSelected = severity === s.id;
            return (
              <button
                key={s.id}
                id={`severity-${s.id}`}
                onClick={() => onSeverityChange(s.id as SeverityLevel)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                  isSelected
                    ? `${s.color} ring-2 ring-offset-1 ring-slate-400 shadow-2xs`
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s.label.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Dynamic Detailer Diagnosis Note */}
        <div className="mt-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-600">
          <span className="font-bold text-slate-800 block mb-0.5 flex items-center gap-1">
            <Info className="w-3 h-3 text-blue-600" />
            <span>Detailer Guideline for {selectedDefect.name}:</span>
          </span>
          <p className="text-slate-600">
            {selectedDefect.severityEstimates[severity]}
          </p>
        </div>
      </div>
    </div>
  );
};
