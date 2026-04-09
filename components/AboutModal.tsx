'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Logo } from '@/components/Logo'

interface AboutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#12151C] border-white/5 rounded-[2rem] p-8 text-slate-200">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <Logo className="w-10 h-10 text-[#F7931A]" />
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-white mb-0.5">BTC HashFrame</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#F7931A] rounded-full" />
              Runtime Architecture
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Implemented with a <strong className="text-slate-200">Zero-Transmission architecture</strong>. All QR generation logic and validation routines execute strictly in the local browser runtime.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#F7931A] rounded-full" />
              Security Hardening
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Designed for high-security environments. Temporary data remains in volatile application memory and is never persisted to disk or external analytics engines.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#F7931A] rounded-full" />
              Engine Specifications
            </h4>
            <ul className="text-[10px] text-slate-500 space-y-2 font-mono uppercase font-bold">
              <li className="flex items-center gap-2">• Optimized QR Matrix</li>
              <li className="flex items-center gap-2">• Type Verification Architecture</li>
              <li className="flex items-center gap-2">• Vector/PNG Multi-sampling</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center justify-between opacity-50">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              BTC HashFrame
            </p>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              Production Build
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
