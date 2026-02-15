'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, Download, Check, AlertCircle } from 'lucide-react'
import { downloadQR, downloadSVG, copyToClipboard, formatFilename } from '@/lib/qr'
import { DataInspector } from '@/components/DataInspector'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import type { QRExportFormat, DataInspectorInfo } from '@/types'

interface QRDisplayProps {
  qrUrl: string
  svgContent?: string
  data: string
  exportFormat: QRExportFormat
  moduleType: string
  warningMessage?: string
  inspectorInfo?: DataInspectorInfo
  isLoading?: boolean
}

export function QRDisplay({ 
  qrUrl, 
  svgContent,
  data, 
  exportFormat,
  moduleType,
  warningMessage,
  inspectorInfo,
  isLoading = false
}: QRDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await copyToClipboard(data)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silent fail
    }
  }

  const handleDownload = () => {
    const filename = formatFilename(moduleType, exportFormat)
    if (exportFormat === 'svg' && svgContent) {
      downloadSVG(svgContent, filename)
    } else {
      downloadQR(qrUrl, filename)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-8 pt-8 border-t border-white/5 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="relative group">
          {/* Animated Glow Backdrop - Reduced Opacity */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#F7931A] to-[#B66B0D] rounded-3xl blur opacity-[0.15] group-hover:opacity-[0.25] transition duration-1000 group-hover:duration-200" />
          
          <div className="relative bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-3xl shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden">
            {/* Inner background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            
            <div className="relative bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.02)]">
              <img src={qrUrl} alt="Secure QR Code" className="w-[280px] h-[280px]" />
            </div>
            
            <div className="mt-4 flex flex-col items-center">
              <div className="h-1.5 w-12 bg-white/10 rounded-full mb-1" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F7931A]">Secure Hashed Frame</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 space-y-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleDownload}
              className="h-14 bg-[#F7931A] hover:bg-[#F7931A]/90 text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_15px_rgba(247,147,26,0.15)] hover:shadow-[0_0_24px_rgba(247,147,26,0.35)] transition-all flex items-center justify-center gap-3"
            >
              <Download className="w-5 h-5" />
              Store {exportFormat.toUpperCase()}
            </Button>
            
            <Button
              onClick={async () => {
                try {
                  const response = await fetch(qrUrl);
                  const blob = await response.blob();
                  await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                  ]);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                  console.error('Failed to copy image: ', err);
                }
              }}
              variant="outline"
              className="h-14 bg-white/5 border-white/5 text-slate-300 font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
            >
               {copied ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  Copied QR
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Image
                </>
              )}
            </Button>

            <Button
              onClick={handleCopy}
              variant="outline"
              className="col-span-1 sm:col-span-2 h-14 bg-white/5 border-white/5 text-slate-300 font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <Copy className="w-5 h-5" />
              Copy Payload Data
            </Button>
          </div>

          {warningMessage && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-amber-500 mb-1">Security Advisory</p>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  {warningMessage}
                </p>
              </div>
            </div>
          )}
          
          <div className="text-[10px] text-slate-500 font-medium px-4 py-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
            <span className="uppercase tracking-widest">Protocol Version</span>
            <span className="font-mono text-[#F7931A] font-bold">1.0.0</span>
          </div>
        </div>
      </div>

      {inspectorInfo && (
        <div className="mt-10">
          <DataInspector info={inspectorInfo} />
        </div>
      )}
    </div>
  )
}
