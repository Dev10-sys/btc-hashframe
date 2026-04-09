'use client'

import { useState, useEffect } from 'react'
import { MnemonicModule } from '@/modules/mnemonic/MnemonicModule'
import { DescriptorModule } from '@/modules/descriptor/DescriptorModule'
import { TransactionModule } from '@/modules/transaction/TransactionModule'
import { AboutModal } from '@/components/AboutModal'
import { Logo } from '@/components/Logo'
import { Key, FileText, ArrowRightLeft, Shield, Info } from 'lucide-react'
import type { ModuleType } from '@/types'

export function QRWorkbench() {
  const [activeModule, setActiveModule] = useState<ModuleType>('mnemonic')
  const [aboutOpen, setAboutOpen] = useState(false)

  const modules = [
    { id: 'mnemonic' as ModuleType, label: 'Mnemonic', icon: Key },
    { id: 'descriptor' as ModuleType, label: 'Descriptor', icon: FileText },
    { id: 'transaction' as ModuleType, label: 'Transaction', icon: ArrowRightLeft },
  ]

  // Keyboard shortcut: Ctrl+Enter to generate QR (modules will handle this)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        // Dispatch custom event for modules to listen to
        window.dispatchEvent(new CustomEvent('generateQR'))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const renderModule = () => {
    switch (activeModule) {
      case 'mnemonic':
        return <MnemonicModule />
      case 'descriptor':
        return <DescriptorModule />
      case 'transaction':
        return <TransactionModule />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-200">
      {/* Header */}
      <header className="bg-[#1C1F26]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10 text-[#F7931A]" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">BTC HashFrame</h1>
            <span className="text-[10px] uppercase tracking-widest text-[#F7931A] font-bold mt-1">Bitcoin QR Encoding Engine</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-72 p-6 border-r border-white/5 space-y-8 bg-[#12151C]/40">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2">Modules</p>
              <nav className="space-y-2">
                {modules.map((module) => {
                  const Icon = module.icon
                  const isActive = activeModule === module.id
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-[#F7931A] text-black shadow-[0_0_20px_rgba(247,147,26,0.3)]'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                      aria-label={`Switch to ${module.label} module`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-slate-500 group-hover:text-[#F7931A]'}`} />
                      <span className="font-bold tracking-wide">{module.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/5 opacity-50">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Local Execution</span>
              </div>
            </div>
          </aside>

          {/* Right Content Panel */}
          <main className="flex-1 p-6 lg:p-10 bg-[#0B0D11]/50">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">

                <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">
                  {activeModule === 'descriptor' ? 'Wallet Descriptor' : modules.find((m) => m.id === activeModule)?.label}
                </h2>
                <p className="text-slate-400 text-sm max-w-2xl font-medium leading-relaxed">
                  {activeModule === 'mnemonic' && 'Generate secure BIP39 seed phrase backups. Perfect for hardware wallet recovery or paper storage.'}
                  {activeModule === 'descriptor' && 'Generate QR codes from Bitcoin output descriptors for multisig and advanced wallet recovery workflows.'}
                  {activeModule === 'transaction' && 'Construct and visualize Bitcoin transactions. Support for PSBT, Raw Hex, and Payment URIs.'}
                </p>
              </div>

              <div className="glass-panel p-1 rounded-[2rem] orange-glow">
                <div className="bg-[#12151C] rounded-[1.8rem] p-8 lg:p-10 border border-white/5">
                  {renderModule()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0B0D11] border-t border-white/5 py-4 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-widest text-zinc-600 flex items-center gap-2">
            BTC HashFrame Engine
          </div>
          <button
            onClick={() => setAboutOpen(true)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-full transition-all group text-zinc-500"
          >
            <Info className="w-3.5 h-3.5 group-hover:text-[#F7931A]" />
            <span className="text-[11px] font-bold uppercase tracking-wide">About Platform</span>
        </div>
      </footer>

      {/* About Modal */}
      <AboutModal open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  )
}

