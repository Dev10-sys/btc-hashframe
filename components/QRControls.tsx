'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { QRSize, ErrorCorrectionLevel, QRExportFormat, GenerationMode } from '@/types'

interface QRControlsProps {
  size: QRSize
  errorLevel: ErrorCorrectionLevel
  exportFormat: QRExportFormat
  generationMode: GenerationMode
  onSizeChange: (size: QRSize) => void
  onErrorLevelChange: (level: ErrorCorrectionLevel) => void
  onExportFormatChange: (format: QRExportFormat) => void
  onGenerationModeChange: (mode: GenerationMode) => void
}

export function QRControls({ 
  size, 
  errorLevel, 
  exportFormat,
  generationMode,
  onSizeChange, 
  onErrorLevelChange,
  onExportFormatChange,
  onGenerationModeChange
}: QRControlsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-5 glass-panel rounded-2xl border-white/5 space-y-4 bg-white/5">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Output Configuration</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide ml-1">QR Scale</Label>
            <Select value={size.toString()} onValueChange={(v: string) => onSizeChange(Number(v) as QRSize)}>
              <SelectTrigger className="h-11 bg-white/5 border-white/5 text-white/90 font-medium rounded-xl focus:bg-white/10 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1F26] border-white/10 rounded-xl">
                <SelectItem value="200" className="text-xs font-bold text-slate-300 focus:bg-[#F7931A] focus:text-black">200px</SelectItem>
                <SelectItem value="300" className="text-xs font-bold text-slate-300 focus:bg-[#F7931A] focus:text-black">300px</SelectItem>
                <SelectItem value="400" className="text-xs font-bold text-slate-300 focus:bg-[#F7931A] focus:text-black">400px</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide ml-1">Redundancy</Label>
            <Select value={errorLevel} onValueChange={(v: string) => onErrorLevelChange(v as ErrorCorrectionLevel)}>
              <SelectTrigger className="h-11 bg-white/5 border-white/5 text-white/90 font-medium rounded-xl focus:bg-white/10 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1F26] border-white/10 rounded-xl">
                <SelectItem value="L" className="text-xs font-bold text-slate-300 focus:bg-[#F7931A] focus:text-black">Low (7%)</SelectItem>
                <SelectItem value="M" className="text-xs font-bold text-slate-300 focus:bg-[#F7931A] focus:text-black">Med (15%)</SelectItem>
                <SelectItem value="Q" className="text-xs font-bold text-slate-300 focus:bg-[#F7931A] focus:text-black">Std (25%)</SelectItem>
                <SelectItem value="H" className="text-xs font-bold text-slate-300 focus:bg-[#F7931A] focus:text-black">Max (30%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-5 glass-panel rounded-2xl border-white/5 space-y-4 bg-white/5">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Generation Logic</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide ml-1">Encoding</Label>
            <Select value={exportFormat} onValueChange={(v: string) => onExportFormatChange(v as QRExportFormat)}>
              <SelectTrigger className="h-11 bg-white/5 border-white/5 text-white/90 font-medium rounded-xl focus:bg-white/10 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1F26] border-white/10 rounded-xl">
                <SelectItem value="png" className="text-xs font-bold text-slate-300 focus:bg-[#F7931A] focus:text-black">PNG Raster</SelectItem>
                <SelectItem value="svg" className="text-xs font-bold text-slate-300 focus:bg-[#F7931A] focus:text-black">SVG Vector</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide ml-1">Real-time</Label>
            <div className="flex items-center justify-between h-11 px-4 bg-white/5 rounded-xl border border-white/5 ring-inset focus-within:ring-1 focus-within:ring-[#F7931A]/30 transition-all group">
              <span className={`text-[10px] font-bold uppercase transition-colors ${generationMode === 'manual' ? 'text-white' : 'text-slate-600'}`}>Manual</span>
              <Switch 
                checked={generationMode === 'auto'} 
                onCheckedChange={(checked: boolean) => onGenerationModeChange(checked ? 'auto' : 'manual')}
                className="data-[state=checked]:bg-[#F7931A] scale-90"
                aria-label="Toggle auto-generation mode"
              />
              <span className={`text-[10px] font-bold uppercase transition-colors ${generationMode === 'auto' ? 'text-[#F7931A]' : 'text-slate-600'}`}>Auto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
