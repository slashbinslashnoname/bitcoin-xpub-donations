import { z } from 'zod'

const priceResponseSchema = z.object({
  bitcoin: z.object({
    usd: z.number(),
  }),
  ethereum: z.object({
    usd: z.number(),
  }),
})

type CryptoCurrency = 'BTC' | 'ETH'

class PriceService {
  private prices: { [key in CryptoCurrency]?: number } = {}
  private lastUpdate: number = 0
  private readonly UPDATE_INTERVAL = 60 * 1000 // 1 minute

  async getPrice(currency: CryptoCurrency): Promise<number> {
    await this.updatePricesIfNeeded()
    const price = this.prices[currency]
    if (!price) {
      throw new Error(`Price not available for ${currency}`)
    }
    return price
  }

  async convertUSDToCrypto(usdAmount: number, currency: CryptoCurrency): Promise<number> {
    const price = await this.getPrice(currency)
    return usdAmount / price
  }

  private async updatePricesIfNeeded() {
    const now = Date.now()
    if (now - this.lastUpdate < this.UPDATE_INTERVAL) {
      return
    }

    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
      )
      const data = priceResponseSchema.parse(await response.json())

      this.prices = {
        BTC: data.bitcoin.usd,
        ETH: data.ethereum.usd,
      }
      this.lastUpdate = now

      console.log('Updated crypto prices:', this.prices)
    } catch (error) {
      console.error('Failed to update crypto prices:', error)
      throw new Error('Failed to fetch current crypto prices')
    }
  }
}

export const priceService = new PriceService() 