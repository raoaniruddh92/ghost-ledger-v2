"use client";

import { useRef, useState, useEffect } from "react";
import { useConnectWallet, useNotifications } from "@web3-onboard/react";
import { useRouter } from "next/router";
import { Challenges1abi as abi, Challenges1bytecode as bytecode } from "../../../utils/abi";
import { publicClient } from "@/utils/client";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

const STORAGE_KEY = "challenge1_contract_address";

export default function Challenge1() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [, customNotification] = useNotifications();
  const notifyController = useRef<any>(null);

  const [address, setAddress] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedAddress = localStorage.getItem(STORAGE_KEY);
    if (savedAddress) setAddress(savedAddress);
  }, []);

  useEffect(() => {
    if (address) localStorage.setItem(STORAGE_KEY, address);
  }, [address]);

  async function solve() {
    if (!address) {
      customNotification({
        type: "error",
        message: "No active contract",
        autoDismiss: 4000,
      });
      return;
    }

    try {
      notifyController.current = customNotification({
        type: "pending",
        message: "Verifying exploit...",
        autoDismiss: 0,
      });

      const result = await publicClient.readContract({
        address: address as `0x${string}`,
        abi,
        functionName: "isComplete",
      });

      notifyController.current.update({
        type: result ? "success" : "error",
        message: result ? "Target compromised ✅" : "Exploit failed ❌",
        autoDismiss: 5000,
      });

      if (result) {
        localStorage.removeItem(STORAGE_KEY);
        setAddress(null);
      }
    } catch {
      notifyController.current?.update({
        type: "error",
        message: "Verification error",
        autoDismiss: 5000,
      });
    }
  }

  async function deploy() {
    if (!wallet?.provider) {
      customNotification({
        type: "error",
        message: "Wallet not connected",
        autoDismiss: 4000,
      });
      return;
    }

    try {
      setDeploying(true);

      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum!),
      });

      const [account] = await walletClient.getAddresses();

      notifyController.current = customNotification({
        type: "pending",
        message: "Deploying target...",
        autoDismiss: 0,
      });

      const hash = await walletClient.deployContract({
        abi,
        account,
        bytecode: bytecode as `0x${string}`,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (!receipt.contractAddress) throw new Error();

      setAddress(receipt.contractAddress);

      notifyController.current.update({
        type: "success",
        message: "Target deployed",
        autoDismiss: 5000,
      });
    } catch {
      notifyController.current?.update({
        type: "error",
        message: "Deployment failed",
        autoDismiss: 5000,
      });
    } finally {
      setDeploying(false);
    }
  }

  return (
    <div className="terminal">
      <div className="scanlines" />

      <div className="window">
        <div className="header">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="title">ghost@ledger:/challenge_1</span>
        </div>

        <div className="content">
          <p><span className="prompt">$</span> mission_brief --load</p>

          <pre className="block">
{`OBJECTIVE:
• Connect wallet
• Deploy target contract
• Verify completion

NETWORK: SEPOLIA
DIFFICULTY: EASY
`}
          </pre>

          <button
            className="command"
            disabled={connecting}
            onClick={() => (wallet ? disconnect(wallet) : connect())}
          >
            $ {connecting ? "connecting..." : wallet ? "wallet disconnect" : "wallet connect"}
          </button>

          <button
            className="command"
            onClick={deploy}
            disabled={!wallet || deploying}
          >
            $ {deploying ? "deploying target..." : "deploy target"}
          </button>

          <button
            className="command"
            onClick={solve}
            disabled={!address}
          >
            $ verify exploit
          </button>

          {address && (
            <div className="output">
              <p><span className="prompt">$</span> active_target</p>
              <code>{address}</code>
              <small>persisted locally</small>
            </div>
          )}
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
            rgba(255,255,255,0.03),
            rgba(255,255,255,0.03) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
        }

        .window {
          width: 95%;
          max-width: 900px;
          background: #020617;
          border: 1px solid #1e293b;
          box-shadow: 0 0 40px rgba(56,189,248,0.25);
        }

        .header {
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

        .red { background: #ef4444; }
        .yellow { background: #eab308; }
        .green { background: #22c55e; }

        .title {
          margin-left: auto;
          font-size: 0.8rem;
          color: #64748b;
        }

        .content {
          padding: 24px;
        }

        .prompt {
          color: #22c55e;
        }

        .block {
          background: #020617;
          border: 1px solid #1e293b;
          padding: 16px;
          font-size: 0.8rem;
          margin: 16px 0;
          color: #94a3b8;
        }

        .command {
          display: block;
          width: 100%;
          margin-bottom: 10px;
          background: transparent;
          border: 1px solid #38bdf8;
          color: #38bdf8;
          padding: 10px;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
        }

        .command:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .command:hover:not(:disabled) {
          background: rgba(56,189,248,0.1);
          box-shadow: 0 0 20px rgba(56,189,248,0.4);
        }

        .output {
          margin-top: 16px;
          background: #020617;
          border: 1px dashed #1e293b;
          padding: 12px;
        }

        code {
          display: block;
          word-break: break-all;
          color: #38bdf8;
          margin-top: 6px;
        }

        small {
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
