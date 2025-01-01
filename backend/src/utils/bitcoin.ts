import { BIP32Factory } from 'bip32';
import { networks } from 'bitcoinjs-lib';
import bs58check from 'bs58check';
import * as tinysecp from 'tiny-secp256k1';

const MAINNET_ZPUB_VERSION = Buffer.from('04b24746', 'hex');
const MAINNET_XPUB_VERSION = Buffer.from('0488b21e', 'hex');

// Initialize bip32 with secp256k1
const bip32 = BIP32Factory(tinysecp);

export function fromZPub(zpub: string): ReturnType<typeof bip32.fromBase58> {
  if (!zpub.startsWith('zpub')) {
    throw new Error('Invalid zpub format');
  }

  // Decode the base58check string
  const data = bs58check.decode(zpub);

  // Replace the version bytes
  const xpubData = Buffer.concat([
    MAINNET_XPUB_VERSION,
    data.slice(4)
  ]);

  // Encode back to base58check
  const xpub = bs58check.encode(xpubData);

  // Create BIP32 node using the initialized bip32 factory
  return bip32.fromBase58(xpub, networks.bitcoin);
} 