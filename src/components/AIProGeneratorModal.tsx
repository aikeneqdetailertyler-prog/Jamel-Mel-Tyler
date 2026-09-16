import React, { useState } from 'react';
import { X, Sparkles, Download, Check, AlertCircle, Loader2, Sliders, Car } from 'lucide-react';
import { AIImageResult } from '../types';

interface AIProGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleSummary: string;
  onSaveResult: (result: AIImageResult) => void;
}

export const AIProGeneratorModal: React.FC<AIProGeneratorModalProps> = ({
  isOpen,
  onClose,
  vehicleSummary,
  onSaveResult,
}) => {
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [prompt, setPrompt] = useState<string>(
    `A master automotive detailing studio photograph of a freshly detailed ${vehicleSummary} inside a luxury ceramic coating bay with honeycomb hexagon ceiling LED lights reflecting with mirror-like clarity on the swirl-free gloss paint.`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    imageUrl: string;
    size: string;
    notes?: string;
  } | null>(null);

  if (!isOpen) return null;

  const stylePresets = [
    {
      title: 'Ceramic Coating Studio',
      prompt: `Flawless luxury showroom shoot of a ${vehicleSummary} inside a modern ceramic coating studio bay, hexagon LED grid lighting overhead reflecting perfectly on the mirror finish paint, spotless floor, ultra-high dynamic range.`,
    },
    {
      title: 'Interior Deep Clean Master',
      prompt: `Close-up macro interior detailing photo of pristine leather seats and freshly steam-extracted automotive carpeting, factory matte finish with zero grease or shine, soft ambient cabin illumination.`,
    },
    {
      title: 'Active Paint Polishing Shot',
      prompt: `Dramatic cinematic action photo of a professional detailer using a dual action machine polisher with high-grade foam pad on the hood of a ${vehicleSummary}, illuminated by LED swirl inspection light showing 50/50 test spot.`,
    },
    {
      title: 'Golden Hour Outdoor Finish',
      prompt: `Breathtaking outdoor sunset photography of a freshly detailed ${vehicleSummary} with ultra-hydrophobic ceramic beads forming crisp water droplets across the hood, golden sunlight reflections.`,
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a prompt for image generation.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/ai/generate-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageSize,
          aspectRatio,
          mimeType: 'image/png',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image with Gemini');
      }

      setGeneratedResult({
        imageUrl: data.imageUrl,
        size: data.size || imageSize,
        notes: data.notes,
      });

      const item: AIImageResult = {
        id: 'pro-' + Date.now(),
        timestamp: Date.now(),
        imageUrl: data.imageUrl,
        prompt: prompt.trim(),
        model: 'gemini-3-pro-image-preview',
        size: imageSize,
        aspectRatio,
        sourceType: 'generated-pro',
        notes: data.notes,
      };
      onSaveResult(item);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while generating with Gemini 3 Pro.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `detailing-pro-${imageSize}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">
                  AI Pro Detailing Showroom Visualizer
                </h2>
                <span className="text-[10px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  gemini-3-pro-image-preview
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Photorealistic detailing studio photography with 1K, 2K & 4K master resolutions
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

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Resolution Affordance (1K, 2K, 4K) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>Image Resolution Affordance</span>
              </label>
              <span className="text-[11px] font-medium text-slate-500">
                gemini-3-pro-image-preview native size
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['1K', '2K', '4K'] as const).map((size) => (
                <button
                  key={size}
                  id={`image-size-${size.toLowerCase()}`}
                  onClick={() => setImageSize(size)}
                  className={`py-2 px-3 rounded-lg border text-center transition-all ${
                    imageSize === size
                      ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-white/60 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{size}</div>
                  <div className="text-[10px] text-slate-500">
                    {size === '1K' && '1024px • Fast preview'}
                    {size === '2K' && '2048px • High-definition'}
                    {size === '4K' && '4096px • Ultra 4K master'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="text-xs font-bold text-slate-800 mb-1.5 block">
              Aspect Ratio
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: '16:9', label: '16:9 Cinema / Web' },
                { id: '4:3', label: '4:3 Standard' },
                { id: '1:1', label: '1:1 Instagram Square' },
                { id: '9:16', label: '9:16 Mobile Reel' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setAspectRatio(r.id)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    aspectRatio === r.id
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-semibold'
                      : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="text-xs font-bold text-slate-800 mb-1.5 block">
              Detailing Scene Description
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden resize-none bg-slate-50/40"
              placeholder="Describe the detailing scene..."
            />
          </div>

          {/* Presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">
              Quick Showroom Presets:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {stylePresets.map((p) => (
                <button
                  key={p.title}
                  onClick={() => setPrompt(p.prompt)}
                  className="text-left p-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-slate-700 transition-colors"
                >
                  <div className="text-xs font-bold text-slate-800">{p.title}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">
                    {p.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Generation Error</p>
                <p className="text-[11px] mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating {imageSize} render with gemini-3-pro-image-preview...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate High-Quality {imageSize} Showroom Render</span>
              </>
            )}
          </button>

          {/* Result Card */}
          {generatedResult && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Generated ({generatedResult.size} Resolution)</span>
                </span>
                <button
                  onClick={() => handleDownload(generatedResult.imageUrl)}
                  className="text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {generatedResult.size} Image</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 aspect-video relative">
                <img
                  src={generatedResult.imageUrl}
                  alt="AI Pro Detailing Render"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {generatedResult.notes && (
                <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                  {generatedResult.notes}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
