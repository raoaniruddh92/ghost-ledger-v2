'use client'

import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  return (
    <div className="terminal">
      <div className="scanlines" />

      <div className="window">
        <div className="header">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="title">ghost@ledger:~</span>
        </div>

        <div className="content">
          <pre className="ascii">
{`   ██████╗ ██╗  ██╗ ██████╗ ███████╗████████╗
  ██╔════╝ ██║  ██║██╔═══██╗██╔════╝╚══██╔══╝
  ██║  ███╗███████║██║   ██║███████╗   ██║   
  ██║   ██║██╔══██║██║   ██║╚════██║   ██║   
  ╚██████╔╝██║  ██║╚██████╔╝███████║   ██║   
   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   
`}
          </pre>

          <p className="text">
            Ghost Ledger v2 — Blockchain CTF Platform  
            <br />
            Network: <span className="accent">Sepolia</span>
          </p>

          <button
            className="command"
            onClick={() => router.push('/Challenges/Challenges_Home')}
          >
            $ ./enter_challenges.sh
          </button>
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

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
          width: 90%;
          max-width: 780px;
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

        .ascii {
          color: #38bdf8;
          font-size: 0.75rem;
          line-height: 1.2;
          margin-bottom: 20px;
          text-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
        }

        .text {
          font-size: 0.9rem;
          margin-bottom: 24px;
          color: #94a3b8;
        }

        .accent {
          color: #22c55e;
        }

        .command {
          background: transparent;
          border: 1px solid #38bdf8;
          color: #38bdf8;
          padding: 12px 20px;
          font-family: inherit;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
        }

        .command:hover {
          background: rgba(56, 189, 248, 0.1);
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.4);
        }

        .command:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  )
}
