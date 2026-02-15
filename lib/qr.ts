import QRCode from 'qrcode'
import type { QRSize, ErrorCorrectionLevel } from '@/types'

export async function generateQR(
  data: string,
  size: QRSize = 300,
  level: ErrorCorrectionLevel = 'H'
): Promise<string> {
  try {
    const url = await QRCode.toDataURL(data, {
      width: size,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: level,
    })
    return url
  } catch (error) {
    throw new Error('Failed to generate QR code')
  }
}

export async function generateQRSVG(
  data: string,
  size: QRSize = 300,
  level: ErrorCorrectionLevel = 'H'
): Promise<string> {
  try {
    const svg = await QRCode.toString(data, {
      type: 'svg',
      width: size,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: level,
    })
    return svg
  } catch (error) {
    throw new Error('Failed to generate SVG QR code')
  }
}

export function downloadQR(url: string, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
}

export function downloadSVG(svgContent: string, filename: string): void {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    throw new Error('Failed to copy to clipboard')
  }
}

export function formatFilename(prefix: string, extension: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${prefix}-${year}${month}${day}.${extension}`
}
