import React, { useRef, useEffect, useState } from 'react';
import {
  Car,
  Maximize2,
  Trash2,
  Plus,
  Palette,
  Eye,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Download,
} from 'lucide-react';
import { SimulatorMode, VehicleType, DefectPin, DefectDefinition, SeverityLevel } from '../types';
import { renderVehicleCanvas, identifyPanel } from '../utils/vehicleRenderer';

interface VehicleCanvasProps {
  mode: SimulatorMode;
  vehicleType: VehicleType;
  onVehicleTypeChange: (type: VehicleType) => void;
  bodyColor: string;
  onBodyColorChange: (color: string) => void;
  pins: DefectPin[];
  selectedPinId: string | null;
  onSelectPin: (id: string | null) => void;
  onAddPin: (pin: DefectPin) => void;
  selectedDefect: DefectDefinition;
  severity: SeverityLevel;
}

const VEHICLE_COLORS = [
  { name: 'Obsidian Black', hex: '#0F172A' },
  { name: 'Alpine White', hex: '#F8FAFC' },
  { name: 'Soul Crystal Red', hex: '#991B1B' },
  { name: 'Deep Metallic Blue', hex: '#1E3A8A' },
  { name: 'Quicksilver Metallic', hex: '#64748B' },
  { name: 'Nardo Grey', hex: '#334155' },
];

export const VehicleCanvas: React.FC<VehicleCanvasProps> = ({
  mode,
  vehicleType,
  onVehicleTypeChange,
  bodyColor,
  onBodyColorChange,
  pins,
  selectedPinId,
  onSelectPin,
  onAddPin,
  selectedDefect,
  severity,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverPinId, setHoverPinId] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Render canvas whenever dependencies update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderVehicleCanvas({
      canvas,
      mode,
      vehicleType,
      bodyColor,
      pins,
      selectedPinId,
      hoverPinId,
    });
  }, [mode, vehicleType, bodyColor, pins, selectedPinId, hoverPinId]);

  // Click on canvas to place a pin or select an existing pin
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = (clickX / rect.width) * 100;
    const yPercent = (clickY / rect.height) * 100;

    // Check if clicked near an existing pin in this mode (hit test)
    const currentPins = pins.filter((p) => p.mode === mode);
    const hitPin = currentPins.find((p) => {
      const pinScreenX = (p.x / 100) * rect.width;
      const pinScreenY = (p.y / 100) * rect.height;
      const dist = Math.hypot(clickX - pinScreenX, clickY - pinScreenY);
      return dist < 22; // 22px click radius
    });

    if (hitPin) {
      onSelectPin(hitPin.id);
      return;
    }

    // Otherwise, create a new pin at this location!
    const panelName = identifyPanel(mode, xPercent, yPercent, vehicleType);
    const newPin: DefectPin = {
      id: 'pin-' + Date.now(),
      defectId: selectedDefect.id,
      name: selectedDefect.name,
      type: selectedDefect.type,
      mode,
      panelName,
      x: Math.round(xPercent * 10) / 10,
      y: Math.round(yPercent * 10) / 10,
      severity,
      description: selectedDefect.descriptionHint,
      recommendedTreatment: selectedDefect.defaultTreatment,
      createdAt: Date.now(),
    };

    onAddPin(newPin);
  };

  // Track hover to highlight existing pins
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setCursorPos({ x: mouseX, y: mouseY });

    const currentPins = pins.filter((p) => p.mode === mode);
    const hitPin = currentPins.find((p) => {
      const pinScreenX = (p.x / 100) * rect.width;
      const pinScreenY = (p.y / 100) * rect.height;
      const dist = Math.hypot(mouseX - pinScreenX, mouseY - pinScreenY);
      return dist < 20;
    });

    setHoverPinId(hitPin ? hitPin.id : null);
  };

  const handleMouseLeave = () => {
    setHoverPinId(null);
    setCursorPos(null);
  };

  const currentModePins = pins.filter((p) => p.mode === mode);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
      {/* Canvas Top Bar: Vehicle Switcher & Palette */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 text-white flex flex-wrap items-center justify-between gap-3">
        {/* Vehicle Body Type */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400">Chassis:</span>
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            {(['sedan', 'suv', 'truck', 'coupe'] as const).map((vt) => (
              <button
                key={vt}
                id={`vehicle-type-${vt}`}
                onClick={() => onVehicleTypeChange(vt)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md uppercase transition-colors ${
                  vehicleType === vt
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {vt}
              </button>
            ))}
          </div>

          {/* Dedicated Equestrian Horse Trailer Button */}
          <button
            id="vehicle-type-horse_trailer"
            onClick={() => onVehicleTypeChange('horse_trailer')}
            className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all border ${
              vehicleType === 'horse_trailer'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-300'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/80 hover:text-white'
            }`}
          >
            <span>🐴</span>
            <span>Equestrian Trailer</span>
            {vehicleType === 'horse_trailer' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
            )}
          </button>
        </div>

        {/* Vehicle Color Swatches */}
        {mode === 'exterior' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Paint Color:</span>
            <div className="flex items-center gap-1.5">
              {VEHICLE_COLORS.map((c) => {
                const isSelected = bodyColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.name}
                    id={`paint-swatch-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onBodyColorChange(c.hex)}
                    className={`w-5 h-5 rounded-full border border-slate-600 transition-transform ${
                      isSelected ? 'scale-125 ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Pin tally badge */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>
            {currentModePins.length} {mode === 'exterior' ? 'Exterior Defects' : 'Cabin Stains'}
          </span>
        </div>
      </div>

      {/* Interactive Blueprint Canvas Viewport */}
      <div className="relative bg-slate-950 flex items-center justify-center p-4 min-h-[460px] select-none overflow-hidden">
        <canvas
          ref={canvasRef}
          id="vehicle-simulation-canvas"
          width={1200}
          height={800}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full max-w-[850px] aspect-[12/8] rounded-xl shadow-2xl border border-slate-800 cursor-crosshair object-contain bg-slate-950"
        />

        {/* Floating Canvas Instructions */}
        <div className="absolute top-6 left-6 pointer-events-none bg-slate-900/90 backdrop-blur-xs border border-slate-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-mono shadow-lg flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
            style={{ backgroundColor: selectedDefect.color }}
          />
          <span>Click on vehicle to place: <strong>{selectedDefect.name}</strong></span>
        </div>

        {/* Help Tip at bottom right */}
        <div className="absolute bottom-6 right-6 pointer-events-none bg-slate-900/80 backdrop-blur-xs text-slate-400 border border-slate-800 px-3 py-1 rounded-md text-[10px] font-mono">
          Interactive Technical Blueprint • 1200x800px
        </div>
      </div>

      {/* Canvas Footer Status */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">
            {vehicleType === 'horse_trailer'
              ? (mode === 'exterior' ? '🐴 Horse Trailer Exterior & Acid Wash Inspection' : '🐴 Horse Trailer Floorplan: Living Quarters, Tack Room & Stalls')
              : (mode === 'exterior' ? 'Vehicle Exterior Paint Inspection' : 'Vehicle Cabin & Interior Floorplan')}
          </span>
          <span className="text-slate-400">•</span>
          <span>Click canvas to place defect pin or click existing pin to inspect</span>
        </div>

        <div className="flex items-center gap-2">
          {vehicleType === 'horse_trailer' ? (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Barn On-Site Service Ready
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">
              Export ready for Detailer Work Order
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
