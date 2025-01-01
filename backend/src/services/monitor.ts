import { EventEmitter } from 'events';
import { BitcoinService } from './bitcoin';

interface AddressMonitor {
  address: string;
  lastChecked: number;
  status: 'pending' | 'confirmed' | 'failed' | 'processing';
}

export class MonitorService {
  private static instance: MonitorService;
  private monitors: Map<string, AddressMonitor> = new Map();
  private readonly bitcoinService: BitcoinService;
  private readonly eventEmitter = new EventEmitter();
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(bitcoinService: BitcoinService) {
    if (MonitorService.instance) {
      this.bitcoinService = MonitorService.instance.bitcoinService;
      this.monitors = MonitorService.instance.monitors;
      MonitorService.instance = this;
      return;
    }
    
    this.bitcoinService = bitcoinService;
    this.startMonitoring();
    MonitorService.instance = this;
  }

  public addAddress(address: string) {
    console.log(`Starting monitoring for address: ${address}`);
    this.monitors.set(address, {
      address,
      lastChecked: Date.now(),
      status: 'failed'
    });
    this.checkAddress(this.monitors.get(address)!);
  }

  public removeAddress(address: string) {
    console.log(`Stopping monitoring for address: ${address}`);
    this.monitors.delete(address);
  }

  private async checkAddress(monitor: AddressMonitor) {
    try {
      const status = await this.bitcoinService.getPaymentStatus(monitor.address);
      if (status !== monitor.status) {
        console.log(`Status changed for ${monitor.address}: ${monitor.status} -> ${status}`);
        monitor.status = status;
        this.eventEmitter.emit('status_change', monitor.address, status);
      }
      monitor.lastChecked = Date.now();
    } catch (error) {
      console.error(`Error checking address ${monitor.address}:`, error);
    }
  }

  private startMonitoring() {
    if (this.checkInterval) return;

    this.checkInterval = setInterval(async () => {
      console.log(`Checking ${this.monitors.size} addresses`);
      for (const monitor of this.monitors.values()) {
        await this.checkAddress(monitor);
      }
    }, 1000); // Check every 10 seconds
  }

  public stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  public onStatusChange(callback: (address: string, status: string) => void) {
    this.eventEmitter.on('status_change', callback);
  }
} 