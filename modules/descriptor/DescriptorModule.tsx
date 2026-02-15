'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { QRControls } from '@/components/QRControls'
import { QRDisplay } from '@/components/QRDisplay'
import { generateQR, generateQRSVG } from '@/lib/qr'
import { validateDescriptor } from '@/lib/validation'
import { getDescriptorType, createInspectorInfo } from '@/lib/format'
import { X, RefreshCw, Wand2, Info } from 'lucide-react'
import type { QRSize, ErrorCorrectionLevel, QRExportFormat, GenerationMode } from '@/types'

export function DescriptorModule() {
  const [descriptor, setDescriptor] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [svgContent, setSvgContent] = useState('')
  const [error, setError] = useState('')
  const [qrSize, setQrSize] = useState<QRSize>(300)
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('H')
  const [exportFormat, setExportFormat] = useState<QRExportFormat>('png')
  const [generationMode, setGenerationMode] = useState<GenerationMode>('manual')
  const [isLoading, setIsLoading] = useState(false)

  const handleDescriptorChange = (value: string) => {
    setDescriptor(value)
    setError('')
    setQrCodeUrl('')
    setSvgContent('')
  }
  
  const generate = useCallback(async () => {
    if (!descriptor.trim()) return

    const validation = validateDescriptor(descriptor)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid descriptor')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const cleanDescriptor = descriptor.trim()
      const [dataUrl, svg] = await Promise.all([
        generateQR(cleanDescriptor, qrSize, errorLevel),
        generateQRSVG(cleanDescriptor, qrSize, errorLevel)
      ])
      
      setQrCodeUrl(dataUrl)
      setSvgContent(svg)
    } catch {
      setError('Failed to generate QR code')
    } finally {
      setIsLoading(false)
    }
  }, [descriptor, qrSize, errorLevel])

  // Auto-generation effect
  useEffect(() => {
    if (generationMode === 'auto' && descriptor.trim()) {
      const timer = setTimeout(() => {
        generate()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [descriptor, generationMode, generate])

  // Ctrl+Enter listener
  useEffect(() => {
    const handleGenerateEvent = () => {
      if (descriptor.trim()) {
        generate()
      }
    }
    window.addEventListener('generateQR', handleGenerateEvent)
    return () => window.removeEventListener('generateQR', handleGenerateEvent)
  }, [descriptor, generate])

  const clearAll = () => {
    setDescriptor('')
    setQrCodeUrl('')
    setSvgContent('')
    setError('')
  }

  const loadExample = () => {
    const exampleDescriptor = 'wpkh([d34db33f/84h/0h/0h]xpub6ERApfZwUNrhLCkDtcHTcxd75RbzS1ed54G1LkBUHQVHQKqhMkhgbmJbZRkrgZw4koxb5JaHWkY4ALHY2grBGRjaDMzQLcgJvLJuZZvRcEL/0/*)'
    setDescriptor(exampleDescriptor)
    setError('')
    setQrCodeUrl('')
    setSvgContent('')
  }

  const descriptorType = descriptor.trim() ? getDescriptorType(descriptor) : null

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between ml-1">
          <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Wallet Output Descriptor</Label>
          <Button
            onClick={loadExample}
            variant="ghost"
            size="sm"
            className="text-[10px] uppercase tracking-widest font-bold text-[#F7931A] hover:bg-[#F7931A]/10 transition-colors"
          >
            <Wand2 className="w-3 h-3 mr-2" />
            Load Protocol Example
          </Button>
        </div>
        <div className="relative group">
          <Textarea
            value={descriptor}
            onChange={(e) => handleDescriptorChange(e.target.value)}
            placeholder="wpkh([fingerprint/derivation]xpub.../*) or other descriptor format"
            className="font-mono text-sm bg-white/5 border-white/5 text-white min-h-[140px] rounded-2xl p-5 focus:bg-white/[0.08] focus:border-[#F7931A]/30 transition-all placeholder:text-slate-700 resize-none"
            spellCheck={false}
          />
          {descriptorType && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-[#F7931A]/20 border border-[#F7931A]/30 rounded-lg text-[9px] font-black uppercase tracking-widest text-[#F7931A] shadow-2xl backdrop-blur-md">
              {descriptorType}
            </div>
          )}
        </div>
        <p className="text-[11px] text-slate-500 font-medium ml-1">
          Enter an output descriptor for your wallet. Standardized cross-wallet compatibility (BIP380+).
        </p>
      </div>

      <div className="p-5 glass-panel rounded-2xl border-white/5 bg-gradient-to-br from-[#F7931A]/5 to-transparent flex gap-4 items-start">
        <div className="w-8 h-8 rounded-lg bg-[#F7931A]/10 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4 text-[#F7931A]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Technical Overview</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Output descriptors define the derivation logic for Bitcoin addresses. They provide a standardized method for wallet recovery and cross-application interoperability.
          </p>
        </div>
      </div>

      <QRControls
        size={qrSize}
        errorLevel={errorLevel}
        exportFormat={exportFormat}
        generationMode={generationMode}
        onSizeChange={setQrSize}
        onErrorLevelChange={setErrorLevel}
        onExportFormatChange={setExportFormat}
        onGenerationModeChange={setGenerationMode}
      />

      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400 rounded-xl">
          <AlertDescription className="text-xs font-bold uppercase tracking-wide">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
        <Button
          onClick={generate}
          disabled={!descriptor.trim() || isLoading}
          className="flex-1 h-14 bg-[#F7931A] hover:bg-[#F7931A]/90 text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(247,147,26,0.15)] hover:shadow-[0_0_40px_rgba(247,147,26,0.25)] transition-all"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
              Processing...
            </>
          ) : (
            'Generate Protocol QR'
          )}
        </Button>
        <Button 
          onClick={clearAll} 
          variant="outline" 
          className="h-14 px-8 border-white/10 text-slate-400 hover:bg-white/5 hover:text-white font-bold rounded-2xl"
        >
          <X className="w-5 h-5 mr-2" />
          Clear
        </Button>
      </div>

      {(qrCodeUrl || isLoading) && (
        <QRDisplay
          qrUrl={qrCodeUrl}
          svgContent={svgContent}
          data={descriptor.trim()}
          exportFormat={exportFormat}
          moduleType="descriptor"
          warningMessage="This descriptor contains extended public keys (xpubs) which can reveal all your addresses. Share carefully."
          inspectorInfo={createInspectorInfo('descriptor', descriptor.trim())}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

