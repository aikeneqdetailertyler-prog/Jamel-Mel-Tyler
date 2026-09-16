import React, { useRef } from 'react';
import {
  MapPin,
  Trash2,
  Camera,
  Upload,
  AlertCircle,
  Clock,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import { DefectPin, SeverityLevel } from '../types';

interface PinInspectorProps {
  pin: DefectPin | null;
  pinIndex: number;
  onUpdatePin: (updated: DefectPin) => void;
  onDeletePin: (id: string) => void;
  onClose: () => void;
}

export const PinInspector: React.FC<PinInspectorProps> = ({
  pin,
  pinIndex,
  onUpdatePin,
  onDeletePin,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!pin) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onUpdatePin({ ...pin, clientPhotoUrl: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-blue-500/60 p-4 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            {pinIndex + 1}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">{pin.name}</h3>
            <p className="text-[10px] text-blue-600 font-medium">
              Located at: {pin.panelName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDeletePin(pin.id)}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            title="Delete this pin"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description / Client Note Input */}
      <div>
        <label className="text-[11px] font-bold text-slate-800 mb-1 block">
          Describe the issue to the detailer
        </label>
        <textarea
          rows={2}
          value={pin.description}
          onChange={(e) => onUpdatePin({ ...pin, description: e.target.value })}
          placeholder="e.g. Spilled iced latte on carpet next to center console, tried wiping with napkin..."
          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden bg-slate-50/50 resize-none"
        />
      </div>

      {/* Severity Controls */}
      <div>
        <label className="text-[11px] font-bold text-slate-800 mb-1 block">
          Severity Level
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['minor', 'moderate', 'severe'] as const).map((s) => (
            <button
              key={s}
              onClick={() => onUpdatePin({ ...pin, severity: s })}
              className={`py-1 px-2 text-[11px] font-semibold rounded-md border text-center capitalize transition-colors ${
                pin.severity === s
                  ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-500'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stain Age (if interior stain) */}
      {pin.type === 'interior_stain' && (
        <div>
          <label className="text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>How long has the stain been there?</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              'Fresh (< 24 hrs)',
              'Recent (1-7 Days)',
              'Set-In (> 1 Month)',
              'Old / Baked-In',
            ].map((age) => (
              <button
                key={age}
                onClick={() => onUpdatePin({ ...pin, stainAge: age as any })}
                className={`py-1 px-2 text-[10px] font-medium rounded-md border text-left truncate transition-colors ${
                  pin.stainAge === age
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Optional Photo Attachment */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Attach Photo of Defect / Stain</span>
          </label>
          {pin.clientPhotoUrl && (
            <button
              onClick={() => onUpdatePin({ ...pin, clientPhotoUrl: undefined })}
              className="text-[10px] text-rose-600 hover:underline"
            >
              Remove Photo
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        {!pin.clientPhotoUrl ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 border border-dashed border-slate-300 hover:border-blue-400 rounded-lg bg-slate-50 hover:bg-blue-50/40 text-slate-600 flex items-center justify-center gap-2 text-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Upload close-up photo (optional)</span>
          </button>
        ) : (
          <div className="relative rounded-lg overflow-hidden border border-slate-200 h-24 bg-slate-100 flex items-center justify-center">
            <img
              src={pin.clientPhotoUrl}
              alt="Uploaded defect"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      {/* Detailer Recommended Action */}
      <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg">
        <span className="text-[10px] font-bold text-blue-900 block mb-0.5 uppercase tracking-wide">
          Recommended Detailer Treatment:
        </span>
        <p className="text-[11px] text-blue-800">
          {pin.recommendedTreatment}
        </p>
      </div>
    </div>
  );
};
