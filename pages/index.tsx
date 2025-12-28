'use client'

import { useEffect, useState } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { useSetChain } from '@web3-onboard/react'
import { useRouter } from 'next/router'

export default function Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [address, setAddress] = useState<string | null>(null)
  const router = useRouter()


  return (
    <div style={{ padding: '20px' }}>
      <button disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
        {connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect'}
      </button>

      <button type="button" onClick={() => router.push('/Challenges/Challenges_Home')}>
        Click me
      </button>
    </div>
  )
}