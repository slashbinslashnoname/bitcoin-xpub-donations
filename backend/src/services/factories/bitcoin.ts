import { BitcoinService } from '../bitcoin'

let bitcoinService: BitcoinService | null = null

export function getBitcoinService(): BitcoinService {
  if (!bitcoinService) {
    bitcoinService = new BitcoinService()
  }
  return bitcoinService
} 