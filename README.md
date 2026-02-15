# BTC HashFrame

[![Live Demo](https://img.shields.io/badge/demo-live-bg?style=for-the-badge&logoColor=white&color=F7931A)](https://btc-hashframe-lkcs.vercel.app)

BTC HashFrame is a security-centric, client-side Bitcoin QR encoding engine designed for air-gapped workflows. It provides a robust, production-grade interface for generating QR codes for mnemonic seed phrases, wallet descriptors, and transaction data without ever transmitting sensitive information over a network.

## Key Features

- **Mnemonic Generation**: Secure BIP39 seed phrase backups with integrated BIP3 wordlist validation.
- **Descriptor Support**: Full support for BIP380 output descriptors (pkh, wpkh, tr, etc.).
- **Transaction Payloads**: Construct QR codes for PSBTs (BIP174), Raw Hex, and BIP21 Payment URIs.
- **Air-Gapped Ready**: All cryptographic operations and QR generation are performed locally in the browser.
- **Privacy-First Design**: Zero data transmission. Your keys and secrets never leave your device.
- **High-Fidelity Output**: Export QR codes in high-resolution PNG or vector SVG formats.

## Security Architecture

BTC HashFrame is built with a "Zero Knowledge" architecture. The application is a static client-side tool that can be saved and run completely offline.

- **Local Execution**: Utilizes local browser resources for QR matrix calculation.
- **Volatile State Management**: Sensitive data is held in transient React state and is destroyed upon page session termination.

## Getting Started

### Installation

```bash
npm install
# or
pnpm install
```

### Local Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS 4
- **Primitives**: Radix UI
- **Cryptography**: BIP39, BitcoinJS-compatible validation logic
- **Icons**: Lucide React

## License

BTC HashFrame © 2026 Dev. All rights reserved.
