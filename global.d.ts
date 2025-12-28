import type { Ethereum } from 'viem'

declare global {
  interface Window {
    ethereum?: Ethereum
  }
}

export {}
