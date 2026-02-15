import type { ValidationResult } from '@/types'

const MAX_BTC_SUPPLY = 21_000_000

export function validateBitcoinAddress(address: string): ValidationResult {
  const trimmed = address.trim()
  
  if (!trimmed) {
    return { isValid: false, error: 'Address is required' }
  }

  // Legacy P2PKH/P2SH (Base58)
  const legacyPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/
  // Native SegWit (Bech32)
  const segwitPattern = /^bc1[a-z0-9]{39,87}$/i
  // Testnet
  const testnetPattern = /^(tb1|[mn2])[a-z0-9]{25,87}$/i

  let addressType = 'Unknown'
  let isValid = false

  if (legacyPattern.test(trimmed)) {
    addressType = trimmed.startsWith('1') ? 'Legacy P2PKH' : 'Legacy P2SH'
    isValid = true
  } else if (segwitPattern.test(trimmed)) {
    addressType = trimmed.startsWith('bc1q') ? 'SegWit P2WPKH' : 'SegWit/Taproot'
    isValid = true
  } else if (testnetPattern.test(trimmed)) {
    addressType = 'Testnet'
    isValid = true
  }
  
  return isValid 
    ? { isValid: true, metadata: { addressType } } 
    : { isValid: false, error: 'Invalid Bitcoin address format' }
}

export function validateHex(data: string): ValidationResult {
  const trimmed = data.trim()
  
  if (!trimmed) {
    return { isValid: false, error: 'Hex data is required' }
  }

  if (!/^[0-9a-fA-F]+$/.test(trimmed)) {
    return { isValid: false, error: 'Invalid hex format (only 0-9, a-f allowed)' }
  }

  if (trimmed.length % 2 !== 0) {
    return { isValid: false, error: 'Hex string must have even length' }
  }
  
  const byteLength = trimmed.length / 2
  
  return { isValid: true, metadata: { byteLength } }
}

export function validateBase64(data: string): ValidationResult {
  const trimmed = data.trim()
  
  if (!trimmed) {
    return { isValid: false, error: 'Base64 data is required' }
  }

  try {
    const decoded = atob(trimmed)
    const reencoded = btoa(decoded)
    
    if (reencoded !== trimmed) {
      return { isValid: false, error: 'Invalid base64 encoding' }
    }
    
    const byteLength = decoded.length
    
    return { isValid: true, metadata: { byteLength } }
  } catch {
    return { isValid: false, error: 'Invalid base64 format' }
  }
}

export function validateDescriptor(descriptor: string): ValidationResult {
  const trimmed = descriptor.trim()
  
  if (!trimmed) {
    return { isValid: false, error: 'Descriptor is required' }
  }

  const descriptorPatterns = [
    /^pkh\(/i,
    /^wpkh\(/i,
    /^sh\(wpkh\(/i,
    /^wsh\(/i,
    /^sh\(wsh\(/i,
    /^tr\(/i,
    /^combo\(/i,
    /^multi\(/i,
    /^sortedmulti\(/i,
    /^addr\(/i,
    /^raw\(/i,
  ]

  const isValid = descriptorPatterns.some((pattern) => pattern.test(trimmed))
  
  if (!isValid) {
    return { isValid: false, error: 'Invalid descriptor format' }
  }

  // Check parentheses balance
  const openCount = (trimmed.match(/\(/g) || []).length
  const closeCount = (trimmed.match(/\)/g) || []).length
  
  if (openCount !== closeCount) {
    return { 
      isValid: false, 
      error: `Unbalanced parentheses (${openCount} open, ${closeCount} close)` 
    }
  }
  
  return { isValid: true, metadata: { parenthesesBalanced: true } }
}

export function validateAmount(amount: string): ValidationResult {
  if (!amount) {
    return { isValid: true }
  }

  const parsed = parseFloat(amount)
  
  if (isNaN(parsed)) {
    return { isValid: false, error: 'Amount must be a valid number' }
  }
  
  if (parsed <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' }
  }
  
  if (parsed > MAX_BTC_SUPPLY) {
    return { isValid: false, error: `Amount exceeds maximum supply (${MAX_BTC_SUPPLY} BTC)` }
  }

  return { isValid: true, metadata: { parsedAmount: parsed } }
}
