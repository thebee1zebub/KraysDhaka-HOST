import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { IMAGES } from '../data/tailoringData';
import { compressImageFile, formatBytes } from '../utils/imageCompressor';

interface ImageUploadFieldProps {
  currentImage: string;
  onChange: (dataUrlOrPath: string) => void;
  galleryImages?: string[];
  onGalleryChange?: (images: string[]) => void;
}

const PRESET_OPTIONS = [
  { label: 'Essential Navy Suit', path: IMAGES.essential, desc: 'Single-breasted 2-button' },
  { label: 'Signature DB Charcoal', path: IMAGES.signature, desc: '6x2 Double-breasted peak' },
  { label: 'Bespoke Tuxedo Drape', path: IMAGES.hero, desc: 'Midnight silk peak lapel' },
  { label: 'Atelier Craft & Shears', path: IMAGES.craft, desc: 'Floating canvas hand-stitch' },
  { label: 'Bespoke Fitting Chalk', path: IMAGES.fitting, desc: 'Baste fitting & adjustments' },
];

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  currentImage,
  onChange,
  galleryImages = [],
  onGalleryChange
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadStats, setUploadStats] = useState<{ size: string; dimensions: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState(currentImage && !currentImage.startsWith('data:') ? currentImage : '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsCompressing(true);
    setErrorMessage(null);

    try {
      const result = await compressImageFile(file, {
        maxWidth: 960,
        maxHeight: 1280,
        quality: 0.82,
        preferredFormat: 'image/jpeg'
      });

      onChange(result.dataUrl);
      setUploadStats({
        size: result.formattedSize,
        dimensions: `${result.width} × ${result.height} px`
      });
    } catch (err: any) {
      console.error('Image compression error:', err);
      setErrorMessage(err.message || 'Failed to process and compress selected image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleAddGalleryFile = async (file: File) => {
    if (!onGalleryChange) return;
    try {
      setIsCompressing(true);
      const result = await compressImageFile(file, {
        maxWidth: 800,
        maxHeight: 1060,
        quality: 0.8,
        preferredFormat: 'image/jpeg'
      });
      const updated = [...galleryImages, result.dataUrl].slice(0, 4); // Max 4 gallery images
      onGalleryChange(updated);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add gallery angle photo.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setErrorMessage('Please enter a valid image URL.');
      return;
    }
    onChange(urlInput.trim());
    setUploadStats(null);
    setErrorMessage(null);
  };

  const isDataUrl = currentImage && currentImage.startsWith('data:');

  return (
    <div className="space-y-3 font-sans-ui text-xs">
      <div className="flex items-center justify-between">
        <label className="block uppercase tracking-wider font-semibold text-[#222222]">
          Garment Photography Asset <span className="text-red-500">*</span>
        </label>
        {uploadStats && (
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-mono">
            Optimized: {uploadStats.size} ({uploadStats.dimensions})
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E5E5] gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`pb-2 px-3 text-xs tracking-wider uppercase font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'upload'
              ? 'border-b-2 border-[#111111] text-[#111111] font-semibold'
              : 'text-[#666666] hover:text-[#111111]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Direct Upload from Device</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`pb-2 px-3 text-xs tracking-wider uppercase font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'presets'
              ? 'border-b-2 border-[#111111] text-[#111111] font-semibold'
              : 'text-[#666666] hover:text-[#111111]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Atelier Presets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`pb-2 px-3 text-xs tracking-wider uppercase font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'url'
              ? 'border-b-2 border-[#111111] text-[#111111] font-semibold'
              : 'text-[#666666] hover:text-[#111111]'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Web URL</span>
        </button>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Tab 1: Upload from Device */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-5 text-center transition-all ${
              isDragOver
                ? 'border-[#111111] bg-neutral-100'
                : 'border-[#CCCCCC] hover:border-[#111111] bg-neutral-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={handleFileChange}
              className="hidden"
              id="garment-file-upload"
            />

            {isCompressing ? (
              <div className="py-4 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#111111]" />
                <span className="text-xs text-[#555555] font-medium">
                  Optimizing & compressing garment photo for storage...
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto bg-white border border-[#E5E5E5] flex items-center justify-center text-[#444444] shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Choose Photo from Device</span>
                  </button>
                  <p className="text-[11px] text-[#777777] mt-1.5">
                    or drag and drop garment image here (JPG, PNG, WebP)
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#888888] font-mono">
                  <Sparkles className="w-3 h-3 text-[#C5A880]" />
                  <span>Automatically compressed to ultra-crisp web size (&lt;80KB)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Atelier Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {PRESET_OPTIONS.map((preset, idx) => {
            const isSelected = currentImage === preset.path;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.path);
                  setUploadStats(null);
                }}
                className={`p-2 border text-left transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'border-[#111111] bg-neutral-100 ring-1 ring-[#111111]'
                    : 'border-[#E5E5E5] hover:border-[#999999] bg-white'
                }`}
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-200 mb-1.5 relative">
                  <img
                    src={preset.path}
                    alt={preset.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-[#111111] text-white p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <p className="font-medium text-[11px] text-[#111111] line-clamp-1">{preset.label}</p>
                <p className="text-[9px] text-[#777777] line-clamp-1">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 3: Web URL */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/... or https://..."
              className="flex-1 px-3 py-2 border border-[#CCCCCC] focus:border-black outline-none font-mono text-xs"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2 bg-[#111111] text-white text-xs font-semibold cursor-pointer hover:bg-black"
            >
              Apply URL
            </button>
          </div>
          <p className="text-[10px] text-[#777777]">
            Provide direct HTTPS link to high-resolution garment imagery.
          </p>
        </div>
      )}

      {/* Active Selected Image Preview Box */}
      {currentImage && (
        <div className="p-3 bg-neutral-50 border border-[#E5E5E5] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-18 bg-white border border-[#CCCCCC] overflow-hidden shrink-0">
              <img
                src={currentImage}
                alt="Selected garment"
                className="w-full h-full object-cover"
                onError={() => setErrorMessage('Failed to preview image. The URL or file data may be invalid.')}
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#777777] block">
                Active Primary Photo
              </span>
              <p className="font-medium text-xs text-[#111111]">
                {isDataUrl ? 'Directly Uploaded Image (Ready)' : currentImage.split('/').pop() || 'Custom URL Image'}
              </p>
              {isDataUrl && (
                <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3" />
                  <span>Compressed for instant loading & persistent local storage</span>
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onChange('');
              setUploadStats(null);
            }}
            className="p-1.5 text-[#666666] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
            title="Clear image"
            aria-label="Clear selected image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Additional Lookbook Gallery Angles */}
      {onGalleryChange && (
        <div className="pt-2 border-t border-[#EAEAEA] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] uppercase tracking-wider font-medium text-[#444444]">
              Additional Lookbook Angles ({galleryImages.length}/4)
            </label>
            {galleryImages.length < 4 && (
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="text-[10px] text-[#111111] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Add Angle Photo</span>
              </button>
            )}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) handleAddGalleryFile(files[0]);
              }}
            />
          </div>

          {galleryImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {galleryImages.map((gImg, gIdx) => (
                <div key={gIdx} className="relative group w-14 h-18 border border-[#E5E5E5] bg-neutral-100 overflow-hidden">
                  <img src={gImg} alt={`Angle ${gIdx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onGalleryChange(galleryImages.filter((_, i) => i !== gIdx))}
                    className="absolute top-0.5 right-0.5 bg-black/80 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Remove angle"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
