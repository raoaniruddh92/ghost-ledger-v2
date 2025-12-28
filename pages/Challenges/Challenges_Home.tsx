'use client'

import { useEffect, useState } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { useSetChain } from '@web3-onboard/react'
import { useRouter } from 'next/router'

export default function Challenge_Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [address, setAddress] = useState<string | null>(null)
  const router = useRouter()


  return (
    <div style={{ padding: '20px' }}>
      <button disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
        {connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect'}
      </button>
      <h1>This is the challenges home page</h1>
    <p>Challenge 1</p>
    <button type="button" onClick={() => router.push('/Challenges/Challenge/Challenge1')}>
        Click me to go to challenge 1
      </button>

          <p>Challenge 2</p>
    <button type="button" onClick={() => router.push('/Challenges/Challenge/Challenge2')}>
        Click me to go to challenge 2
      </button>
    </div>
  )
}