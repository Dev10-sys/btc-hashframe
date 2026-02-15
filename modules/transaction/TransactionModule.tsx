'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QRControls } from '@/components/QRControls'
import { QRDisplay } from '@/components/QRDisplay'
import { generateQR, generateQRSVG } from '@/lib/qr'
import { validateBitcoinAddress, validateHex, validateBase64, validateAmount } from '@/lib/validation'
import { generatePaymentURI, createInspectorInfo } from '@/lib/format'
import { X, RefreshCw, Wand2, Info } from 'lucide-react'
import type { QRSize, ErrorCorrectionLevel, QRExportFormat, GenerationMode } from '@/types'

type TransactionFormat = 'payment-uri' | 'psbt' | 'raw'

export function TransactionModule() {
  const [format, setFormat] = useState<TransactionFormat>('payment-uri')
  const [transactionData, setTransactionData] = useState('')
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [label, setLabel] = useState('')
  const [message, setMessage] = useState('')
  
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [svgContent, setSvgContent] = useState('')
  const [error, setError] = useState('')
  const [qrSize, setQrSize] = useState<QRSize>(300)
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('M')
  const [exportFormat, setExportFormat] = useState<QRExportFormat>('png')
  const [generationMode, setGenerationMode] = useState<GenerationMode>('manual')
  const [isLoading, setIsLoading] = useState(false)

  const handleFormatChange = (newFormat: TransactionFormat) => {
    setFormat(newFormat)
    setQrCodeUrl('')
    setSvgContent('')
    setError('')
  }
  
  const clearResults = () => {
    setQrCodeUrl('')
    setSvgContent('')
    setError('')
  }

  const generate = useCallback(async () => {
    setError('')
    setIsLoading(true)

    let dataToEncode = ''
    let isValid = false

    // Validation logic
    if (format === 'payment-uri') {
      if (!address.trim()) {
        setIsLoading(false)
        return // Don't show error if empty during auto-gen
      }
      
      const addressValidation = validateBitcoinAddress(address)
      if (!addressValidation.isValid) {
        setError(addressValidation.error || 'Invalid address')
        setIsLoading(false)
        return
      }

      const amountValidation = validateAmount(amount)
      if (!amountValidation.isValid) {
        setError(amountValidation.error || 'Invalid amount')
        setIsLoading(false)
        return
      }

      dataToEncode = generatePaymentURI(address, amount, label, message)
      isValid = true
    } else {
      if (!transactionData.trim()) {
        setIsLoading(false)
        return
      }

      if (format === 'psbt') {
        const validation = validateBase64(transactionData)
        if (!validation.isValid) {
          setError(validation.error || 'Invalid PSBT format')
          setIsLoading(false)
          return
        }
      } else if (format === 'raw') {
        const validation = validateHex(transactionData)
        if (!validation.isValid) {
          setError(validation.error || 'Invalid hex format')
          setIsLoading(false)
          return
        }
      }
      
      dataToEncode = transactionData.trim()
      isValid = true
    }

    if (!isValid) {
      setIsLoading(false)
      return
    }

    try {
      const currentErrorLevel = (format === 'psbt' || format === 'raw') ? 'L' : errorLevel
      
      const [dataUrl, svg] = await Promise.all([
        generateQR(dataToEncode, qrSize, currentErrorLevel),
        generateQRSVG(dataToEncode, qrSize, currentErrorLevel)
      ])
      
      setQrCodeUrl(dataUrl)
      setSvgContent(svg)
    } catch {
      setError('Failed to generate QR code. Data might be too long.')
    } finally {
      setIsLoading(false)
    }
  }, [format, address, amount, label, message, transactionData, qrSize, errorLevel])

  // Auto-generation effect
  useEffect(() => {
    if (generationMode === 'auto') {
      const hasData = format === 'payment-uri' 
        ? !!address.trim() 
        : !!transactionData.trim()
      
      if (hasData) {
        const timer = setTimeout(() => {
          generate()
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [format, address, amount, label, message, transactionData, generationMode, generate])

  // Ctrl+Enter listener
  useEffect(() => {
    const handleGenerateEvent = () => {
      const hasData = format === 'payment-uri' 
        ? !!address.trim() 
        : !!transactionData.trim()
        
      if (hasData) {
        generate()
      }
    }
    window.addEventListener('generateQR', handleGenerateEvent)
    return () => window.removeEventListener('generateQR', handleGenerateEvent)
  }, [format, address, transactionData, generate])

  const clearAll = () => {
    setTransactionData('')
    setAddress('')
    setAmount('')
    setLabel('')
    setMessage('')
    setQrCodeUrl('')
    setSvgContent('')
    setError('')
  }

  const loadExample = () => {
    if (format === 'payment-uri') {
      setAddress('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
      setAmount('0.001')
      setLabel('Coffee Payment')
      setMessage('Thanks for the coffee!')
    } else if (format === 'psbt') {
      setTransactionData(
        'cHNidP8BAHECAAAAAeVj0LhXaN8SLlGHGcqZpz8pKXVKVlGUCqFALNqC9m2qAAAAAAD/////AkBCDwAAAAAAFgAUxkgHzf0wgZwLmKG3LggTvqo0gR6w4gEAAAAAABYAFPfEVfn7fG74VR/fS1GYfvpRVRcDAAAAAAEBKwDh9QUAAAAAIgAgi9NlGq47iScWGxrKT5Z+6EXJCxwz8+2XWnWw9LxEWW0AAA=='
      )
    } else {
      setTransactionData(
        '0200000001e563d0b8576adf122e51871cea19a73f2929754a56519402a1402cdaa2f66daa0000000000ffffffff0240420f0000000000160014c64807cdfd30819c0b98a1b72e0813bea3348116b0e201000000000016001477c455f9fb7c6ef8551fdf4b51987efc51551703'
      )
    }
    clearResults()
  }

  const getQRData = () => {
    if (format === 'payment-uri') {
      return generatePaymentURI(address, amount, label, message)
    }
    return transactionData.trim()
  }

  const getInspectorType = () => {
    if (format === 'payment-uri') return 'bip21'
    if (format === 'psbt') return 'psbt'
    return 'raw'
  }

  return (
    <div className="space-y-6">
      <Tabs value={format} onValueChange={(v: string) => handleFormatChange(v as TransactionFormat)} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <TabsTrigger value="payment-uri" className="rounded-xl font-bold py-2.5 data-[state=active]:bg-[#F7931A] data-[state=active]:text-black transition-all">Payment URI</TabsTrigger>
          <TabsTrigger value="psbt" className="rounded-xl font-bold py-2.5 data-[state=active]:bg-[#F7931A] data-[state=active]:text-black transition-all">PSBT</TabsTrigger>
          <TabsTrigger value="raw" className="rounded-xl font-bold py-2.5 data-[state=active]:bg-[#F7931A] data-[state=active]:text-black transition-all">Raw Hex</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-uri" className="space-y-4 mt-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Bitcoin Recipient Address</Label>
              <Button
                onClick={loadExample}
                variant="ghost"
                size="sm"
                className="text-[10px] uppercase tracking-widest font-bold text-[#F7931A] hover:bg-[#F7931A]/10"
              >
                <Wand2 className="w-3 h-3 mr-2" />
                Load Template
              </Button>
            </div>
            <Input
              value={address}
              onChange={(e) => { setAddress(e.target.value); clearResults(); }}
              placeholder="bc1q... or payment alias"
              className="h-12 bg-white/5 border-white/5 text-white font-mono rounded-xl focus:bg-white/[0.08] focus:border-[#F7931A]/30 placeholder:text-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide ml-1">Amount (BTC, optional)</Label>
              <Input
                type="number"
                step="0.00000001"
                min="0"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); clearResults(); }}
                placeholder="0.001"
                className="h-12 bg-white/5 border-white/5 text-white font-mono rounded-xl focus:bg-white/[0.08] focus:border-[#F7931A]/30 placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide ml-1">Label (optional)</Label>
              <Input
                value={label}
                onChange={(e) => { setLabel(e.target.value); clearResults(); }}
                placeholder="Payment description"
                className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:bg-white/[0.08] focus:border-[#F7931A]/30 placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide ml-1">Message (optional)</Label>
            <Input
              value={message}
              onChange={(e) => { setMessage(e.target.value); clearResults(); }}
              placeholder="Additional message"
              className="h-12 bg-white/5 border-white/5 text-white rounded-xl focus:bg-white/[0.08] focus:border-[#F7931A]/30 placeholder:text-slate-700"
            />
          </div>

          <div className="p-5 glass-panel rounded-2xl border-white/5 bg-gradient-to-br from-[#F7931A]/5 to-transparent flex gap-4 items-start">
            <div className="w-8 h-8 rounded-lg bg-[#F7931A]/10 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-[#F7931A]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Payment Standards</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Generates a BIP21 compatible payment request. Supported by consensus-compliant Bitcoin wallets.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="psbt" className="space-y-4 mt-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">PSBT (Base64 Encoding)</Label>
              <Button
                onClick={loadExample}
                variant="ghost"
                size="sm"
                className="text-[10px] uppercase tracking-widest font-bold text-[#F7931A] hover:bg-[#F7931A]/10"
              >
                <Wand2 className="w-3 h-3 mr-2" />
                Load Template
              </Button>
            </div>
            <Textarea
              value={transactionData}
              onChange={(e) => { setTransactionData(e.target.value); clearResults(); }}
              placeholder="cHNidP8BAH..."
              className="font-mono text-sm bg-white/5 border-white/5 text-white min-h-[160px] rounded-2xl p-5 focus:bg-white/[0.08] focus:border-[#F7931A]/30 transition-all placeholder:text-slate-700 resize-none"
              spellCheck={false}
            />
            <p className="text-[11px] text-slate-500 font-medium ml-1">
              Partially Signed Bitcoin Transaction (BIP174) in base64. Typically used for multisig and air-gapped coordination.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="raw" className="space-y-4 mt-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Raw Transaction (Hexadecimal)</Label>
              <Button
                onClick={loadExample}
                variant="ghost"
                size="sm"
                className="text-[10px] uppercase tracking-widest font-bold text-[#F7931A] hover:bg-[#F7931A]/10"
              >
                <Wand2 className="w-3 h-3 mr-2" />
                Load Template
              </Button>
            </div>
            <Textarea
              value={transactionData}
              onChange={(e) => { setTransactionData(e.target.value); clearResults(); }}
              placeholder="0200000001..."
              className="font-mono text-sm bg-white/5 border-white/5 text-white min-h-[160px] rounded-2xl p-5 focus:bg-white/[0.08] focus:border-[#F7931A]/30 transition-all placeholder:text-slate-700 resize-none"
              spellCheck={false}
            />
            <p className="text-[11px] text-slate-500 font-medium ml-1">
              Broadcasting-ready hex payload. Encodes the complete signed transaction data for network transmission.
            </p>
          </div>
        </TabsContent>
      </Tabs>

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
          disabled={(format === 'payment-uri' ? !address.trim() : !transactionData.trim()) || isLoading}
          className="flex-1 h-14 bg-[#F7931A] hover:bg-[#F7931A]/90 text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(247,147,26,0.15)] hover:shadow-[0_0_40px_rgba(247,147,26,0.25)] transition-all"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
              Processing...
            </>
          ) : (
            'Generate Transaction QR'
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
          data={getQRData()}
          exportFormat={exportFormat}
          moduleType={format}
          warningMessage={
            format === 'payment-uri'
              ? 'Scan this QR code with a Bitcoin wallet to create a payment.'
              : 'This QR code contains transaction data. Use a compatible wallet to sign or broadcast.'
          }
          inspectorInfo={createInspectorInfo(getInspectorType(), getQRData())}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
