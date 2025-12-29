import {
  createPublicClient,
  http,
  createWalletClient,
  custom,
} from 'viem'
import { sepolia } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: sepolia,
  //A public node url
  transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
})


