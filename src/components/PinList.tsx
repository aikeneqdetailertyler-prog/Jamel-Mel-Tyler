import React from 'react';
import {
  MapPin,
  Trash2,
  Camera,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { DefectPin, SimulatorMode } from '../types';

interface PinListProps {
  pins: DefectPin[];
  selectedPinId: string | null;
  onSelectPin: (id: string) => void;
  onDeletePin: (id: string) => void;
  mode: SimulatorMode;
  onSwitchMode: (mode: SimulatorMode) => void;
}

export const PinList: React.FC<PinListProps> = ({
  pins,
  selectedPinId,
  onSelectPin,
  onDeletePin,
  mode,
  onSwitchMode,
}) => {
  const exteriorPins = pins.filter((p) => p.mode === 'exterior');
  const interiorPins = pins.filter((p) => p.mode === 'interior');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Marked Damage & Stain Intake</span>
        </h2>
        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
          {pins.length} Total
        </span>
      </div>

      {pins.length === 0 ? (
        <div className="p-5 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs font-semibold text-slate-600">No issues pinned yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Click on the car body or cabin schematic above to place your first defect or stain pin.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {pins.map((pin, idx) => {
            const isSelected = pin.id === selectedPinId;
            return (
              <div
                key={pin.id}
                onClick={() => {
                  if (pin.mode !== mode) {
                    onSwitchMode(pin.mode);
                  }
                  onSelectPin(pin.id);
                }}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 text-white shadow-2xs ${
                      pin.severity === 'severe'
                        ? 'bg-red-700'
                        : pin.severity === 'moderate'
                        ? 'bg-rose-600'
                        : 'bg-amber-600'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {pin.name}
                      </p>
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {pin.mode}
                      </span>
                    </div>

                    <p className="text-[11px] text-blue-700 font-medium truncate mt-0.5">
                      📍 {pin.panelName}
                    </p>

                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {pin.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {pin.clientPhotoUrl && (
                    <span className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5 bg-blue-100/60 px-1.5 py-0.5 rounded">
                      <Camera className="w-3 h-3" />
                      <span>Photo</span>
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePin(pin.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
