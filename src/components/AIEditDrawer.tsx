import React, { useState } from 'react';
import { X, Wand2, Sparkles, Download, Check, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { AIImageResult } from '../types';

interface AIEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMockupBase64: string | null;
  vehicleSummary: string;
  onSaveResult: (result: AIImageResult) => void;
}

export const AIEditDrawer: React.FC<AIEditDrawerProps> = ({
  isOpen,
  onClose,
  currentMockupBase64,
  vehicleSummary,
  onSaveResult,
}) => {
  const [prompt, setPrompt] = useState(
    `Simulate the vehicle after a multi-stage machine paint correction and 5-year ceramic coating, removing all swirl marks, road grime, and light scratches to achieve a flawless mirror reflection.`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultNotes, setResultNotes] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    `Simulate this vehicle after 2-stage rotary machine paint correction and 9H ceramic coating, showing wet-look mirror gloss and zero swirl marks under inspection lights`,
    `Simulate the interior cabin after commercial hot water steam extraction, showing restored clean carpet fibers and conditioned matte OEM leather with all stains removed`,
    `Close-up split before and after visual of a car panel being machine polished with a dual-action polisher showing 50/50 test spot comparison`,
    `Finished vehicle parked in a modern luxury detailing bay with high-CRI hex ceiling grid LED lighting reflecting crisply across the hood and doors`,
  ];

  const handleEditImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter an editing prompt.');
      return;
    }
    if (!currentMockupBase64) {
      setError('No base vehicle schematic image available.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const res = await fetch('/api/ai/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageBase64: currentMockupBase64,
          mimeType: 'image/png',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate detailing simulation with Gemini');
      }

      setResultImage(data.imageUrl);
      setResultNotes(data.notes || null);

      const item: AIImageResult = {
        id: 'edit-' + Date.now(),
        timestamp: Date.now(),
        imageUrl: data.imageUrl,
        prompt: prompt.trim(),
        model: 'gemini-3.1-flash-image-preview',
        sourceType: 'edited',
        notes: data.notes,
      };
      onSaveResult(item);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `detailing-simulation-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                AI Detailing Treatment Simulator
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Model: gemini-3.1-flash-image-preview
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Base Vehicle Preview */}
          <div>
            <label className="text-xs font-bold text-slate-800 mb-1.5 block">
              Current Blueprint & Damage Map
            </label>
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              {currentMockupBase64 ? (
                <img
                  src={currentMockupBase64}
                  alt="Vehicle schematic"
                  className="w-24 h-16 rounded-lg object-contain bg-slate-950 border border-slate-800 shadow-xs"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-24 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-400">
                  No schematic
                </div>
              )}
              <div className="text-xs text-slate-600 flex-1">
                <p className="font-semibold text-slate-900">{vehicleSummary}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gemini takes this vehicle schematic and renders a realistic photo showing the repaired surface after detailing.
                </p>
              </div>
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Detailing Treatment Simulation Prompt
              </label>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                Treatment Instructions
              </span>
            </div>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden resize-none bg-slate-50/50"
              placeholder="Describe the detailing correction results..."
            />
          </div>

          {/* Quick Detailing Prompt Presets */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1.5 block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Detailing Presets</span>
            </label>
            <div className="space-y-1.5">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(q)}
                  className="w-full text-left text-xs p-2 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700 transition-colors line-clamp-2"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Error Simulating Detailing</p>
                <p className="mt-0.5 text-[11px]">{error}</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleEditImage}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-900" />
                <span>Simulating detailing treatment with gemini-3.1-flash-image-preview...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Simulate Detailing Results</span>
              </>
            )}
          </button>

          {/* Result Card */}
          {resultImage && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Simulated Treatment Result</span>
                </span>
                <button
                  onClick={() => downloadImage(resultImage)}
                  className="text-xs font-medium text-slate-700 hover:text-indigo-600 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md bg-black/5 aspect-video relative">
                <img
                  src={resultImage}
                  alt="Simulated result"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {resultNotes && (
                <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {resultNotes}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
