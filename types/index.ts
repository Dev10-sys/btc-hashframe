export type ModuleType = 'mnemonic' | 'descriptor' | 'transaction'

export type QRSize = 200 | 300 | 400

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export type QRExportFormat = 'png' | 'svg'

export type GenerationMode = 'manual' | 'auto'

export interface QROptions {
  size: QRSize
  errorCorrectionLevel: ErrorCorrectionLevel
}

export interface ValidationResult {
  isValid: boolean
  error?: string
  metadata?: Record<string, unknown>
}

export interface MnemonicState {
  wordCount: 12 | 24
  words: string[]
}

export interface DescriptorState {
  descriptor: string
}

export interface TransactionState {
  format: 'psbt' | 'raw' | 'payment-uri'
  transactionData: string
  address: string
  amount: string
  label: string
  message: string
}

export interface DataInspectorInfo {
  type: string
  details: Array<{ label: string; value: string }>
}

export interface ParsedBIP21 {
  address: string
  amount?: string
  label?: string
  message?: string
}
