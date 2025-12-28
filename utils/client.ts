import {
  createPublicClient,
  http,
  createWalletClient,
  custom,
} from 'viem'
import { sepolia } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://eth-sepolia.g.alchemy.com/v2/Bwug1YOz73ikwdHD2BYO2'),
})


