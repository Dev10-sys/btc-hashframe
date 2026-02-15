import type { ParsedBIP21, DataInspectorInfo } from '@/types'

export function getDescriptorType(descriptor: string): string {
  const trimmed = descriptor.trim()
  
  if (trimmed.startsWith('pkh(')) return 'Legacy (P2PKH)'
  if (trimmed.startsWith('wpkh(')) return 'Native SegWit (P2WPKH)'
  if (trimmed.startsWith('sh(wpkh(')) return 'Nested SegWit (P2SH-P2WPKH)'
  if (trimmed.startsWith('wsh(')) return 'Native SegWit (P2WSH)'
  if (trimmed.startsWith('sh(wsh(')) return 'Nested SegWit (P2SH-P2WSH)'
  if (trimmed.startsWith('tr(')) return 'Taproot (P2TR)'
  if (trimmed.startsWith('combo(')) return 'Combo'
  if (trimmed.startsWith('multi(') || trimmed.startsWith('sortedmulti(')) return 'Multisig'
  if (trimmed.startsWith('addr(')) return 'Address'
  if (trimmed.startsWith('raw(')) return 'Raw'
  
  return 'Unknown'
}

export function generatePaymentURI(
  address: string,
  amount?: string,
  label?: string,
  message?: string
): string {
  let uri = `bitcoin:${address.trim()}`
  const params: string[] = []

  if (amount) params.push(`amount=${amount}`)
  if (label) params.push(`label=${encodeURIComponent(label)}`)
  if (message) params.push(`message=${encodeURIComponent(message)}`)

  if (params.length > 0) {
    uri += `?${params.join('&')}`
  }

  return uri
}

export function parseBIP21(uri: string): ParsedBIP21 | null {
  try {
    const bitcoinPrefix = 'bitcoin:'
    if (!uri.startsWith(bitcoinPrefix)) return null

    const withoutPrefix = uri.substring(bitcoinPrefix.length)
    const parts = withoutPrefix.split('?')
    const address = parts[0] || ''
    const queryString = parts[1]

    const result: ParsedBIP21 = { address }

    if (queryString) {
      const params = new URLSearchParams(queryString)
      if (params.has('amount')) result.amount = params.get('amount') ?? undefined
      if (params.has('label')) result.label = decodeURIComponent(params.get('label') ?? '')
      if (params.has('message')) result.message = decodeURIComponent(params.get('message') ?? '')
    }

    return result
  } catch {
    return null
  }
}

export function createInspectorInfo(
  type: 'bip21' | 'psbt' | 'raw' | 'descriptor' | 'mnemonic',
  data: string,
  metadata?: Record<string, unknown>
): DataInspectorInfo {
  const details: Array<{ label: string; value: string }> = []

  switch (type) {
    case 'bip21': {
      const parsed = parseBIP21(data)
      if (parsed) {
        details.push({ label: 'Address', value: parsed.address })
        if (parsed.amount) details.push({ label: 'Amount', value: `${parsed.amount} BTC` })
        if (parsed.label) details.push({ label: 'Label', value: parsed.label })
        if (parsed.message) details.push({ label: 'Message', value: parsed.message })
      }
      return { type: 'BIP21 Payment URI', details }
    }

    case 'psbt': {
      const byteLength = metadata?.byteLength as number | undefined
      if (byteLength) {
        details.push({ label: 'Format', value: 'Base64' })
        details.push({ label: 'Size', value: `${byteLength} bytes` })
      }
      return { type: 'Partially Signed Bitcoin Transaction', details }
    }

    case 'raw': {
      const byteLength = metadata?.byteLength as number | undefined
      if (byteLength) {
        details.push({ label: 'Format', value: 'Hexadecimal' })
        details.push({ label: 'Size', value: `${byteLength} bytes` })
      }
      return { type: 'Raw Bitcoin Transaction', details }
    }

    case 'descriptor': {
      const descriptorType = getDescriptorType(data)
      details.push({ label: 'Type', value: descriptorType })
      details.push({ label: 'Format', value: 'Output Descriptor' })
      return { type: 'Wallet Descriptor', details }
    }

    case 'mnemonic': {
      const wordCount = data.trim().split(/\s+/).length
      details.push({ label: 'Words', value: wordCount.toString() })
      details.push({ label: 'Standard', value: 'BIP39' })
      return { type: 'Mnemonic Seed Phrase', details }
    }

    default:
      return { type: 'Unknown', details: [] }
  }
}
