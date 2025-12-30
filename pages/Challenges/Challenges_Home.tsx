'use client'

import { useConnectWallet } from '@web3-onboard/react'
import { useRouter } from 'next/router'

export default function Challenge_Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const router = useRouter()

  const challenges = [
    { id: 1, path: '/Challenges/Challenge/Challenge1' },
    { id: 2, path: '/Challenges/Challenge/Challenge2' },
    { id: 3, path: '/Challenges/Challenge/Challenge3' },
    { id: 4, path: '/Challenges/Challenge/Challenge4' },
    { id: 5, path: '/Challenges/Challenge/Challenge5' },
    { id: 6, path: '/Challenges/Challenge/Challenge6' }
  ]

  return (
    <div className="terminal">
      <div className="scanlines" />

      <div className="window">
        <div className="header">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="title">ghost@ledger:/challenges</span>
        </div>

        <div className="content">
          <div className="status">
            <span className="prompt">$</span>{' '}
            <span className="cmd">walletctl status</span>
            <span className="output">
              → {wallet ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>

          <button
            className="command"
            disabled={connecting}
            onClick={() => (wallet ? disconnect(wallet) : connect())}
          >
            $ {connecting ? 'connecting...' : wallet ? 'disconnect' : 'connect'}
          </button>

          <div className="divider" />

          <p className="sectionTitle">Available Targets</p>

          <ul className="challengeList">
            {challenges.map((c) => (
              <li key={c.id}>
                <span className="prompt">$</span>{' '}
                <button
                  className="link"
                  onClick={() => router.push(c.path)}
                >
                  ./challenge_{c.id}.bin
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .terminal {
          min-height: 100vh;
          background: #05070a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          color: #cbd5f5;
          position: relative;
          overflow: hidden;
        }

        .scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.03),
            rgba(255, 255, 255, 0.03) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        .window {
          width: 92%;
          max-width: 900px;
          background: #020617;
          border: 1px solid #1e293b;
          box-shadow:
            0 0 40px rgba(56, 189, 248, 0.25),
            inset 0 0 20px rgba(15, 23, 42, 0.8);
        }

        .header {
          background: #020617;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #1e293b;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .red {
          background: #ef4444;
        }

        .yellow {
          background: #eab308;
        }

        .green {
          background: #22c55e;
        }

        .title {
          margin-left: auto;
          font-size: 0.85rem;
          color: #64748b;
        }

        .content {
          padding: 24px;
        }

        .status {
          font-size: 0.85rem;
          margin-bottom: 12px;
          color: #94a3b8;
        }

        .prompt {
          color: #22c55e;
        }

        .cmd {
          color: #38bdf8;
        }

        .output {
          margin-left: 8px;
          color: ${wallet ? '#22c55e' : '#ef4444'};
        }

        .command {
          margin-top: 10px;
          background: transparent;
          border: 1px solid #38bdf8;
          color: #38bdf8;
          padding: 10px 18px;
          font-family: inherit;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .command:hover {
          background: rgba(56, 189, 248, 0.1);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
        }

        .command:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .divider {
          height: 1px;
          background: #1e293b;
          margin: 24px 0;
        }

        .sectionTitle {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .challengeList {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .challengeList li {
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .link {
          background: none;
          border: none;
          color: #cbd5f5;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
        }

        .link:hover {
          color: #38bdf8;
          text-shadow: 0 0 8px rgba(56, 189, 248, 0.5);
        }
      `}</style>
    </div>
  )
}
