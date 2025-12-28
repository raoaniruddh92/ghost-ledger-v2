"use client";

import { useRef, useState, useEffect } from "react";
import { useConnectWallet, useNotifications } from "@web3-onboard/react";
import { useRouter } from "next/router";
import { Challenges3abi as abi, Challenges3bytecode as bytecode} from "../../../utils/abi";
import { publicClient } from "@/utils/client";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

const STORAGE_KEY = "challenge3_contract_address";

export default function Challenge1() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [, customNotification] = useNotifications();
  const notifyController = useRef<{
    update: Function;
    dismiss: Function;
  } | null>(null);

  const [address, setAddress] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const router = useRouter();

  // --- Persistence Logic ---

  // 1. Load address from localStorage on initial mount
  useEffect(() => {
    const savedAddress = localStorage.getItem(STORAGE_KEY);
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  // 2. Save address to localStorage whenever it changes
  useEffect(() => {
    if (address) {
      localStorage.setItem(STORAGE_KEY, address);
    }
  }, [address]);

  async function solve() {
    if (!address) {
      customNotification({
        type: "error",
        message: "No contract deployed yet",
        autoDismiss: 4000,
      });
      return;
    }

    try {
      notifyController.current = customNotification({
        type: "pending",
        message: "Checking solution...",
        autoDismiss: 0,
      });

      const result = await publicClient.readContract({
        address: address as `0x${string}`,
        abi: abi,
        functionName: "isComplete",
      });

      if (result === true) {
        notifyController.current.update({
          type: "success",
          message: "Challenge solved! ✅",
          autoDismiss: 5000,
        });

        // 3. Clear storage only after successful completion
        localStorage.removeItem(STORAGE_KEY);
        setAddress(null);

        // optional: redirect to next challenge
        // router.push("/challenges/2")
      } else {
        notifyController.current.update({
          type: "error",
          message: "Challenge not solved yet ❌",
          autoDismiss: 5000,
        });
      }
    } catch (err) {
      console.error(err);
      notifyController.current?.update({
        type: "error",
        message: "Failed to check solution",
        autoDismiss: 5000,
      });
    }
  }

  async function deploy() {
    if (!wallet?.provider) {
      customNotification({
        type: "error",
        message: "Please connect your wallet first",
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

const feeData = await publicClient.estimateFeesPerGas();

const maxFeePerGas =
  (feeData.maxFeePerGas! * BigInt(130)) / BigInt(100);

const maxPriorityFeePerGas =
  (feeData.maxPriorityFeePerGas! * BigInt(130)) / BigInt(100);

const hash = await walletClient.deployContract({
  abi,
  account,
  bytecode: bytecode as `0x${string}`,
  maxFeePerGas,
  maxPriorityFeePerGas,
});

      notifyController.current = customNotification({
        type: "pending",
        message: "Deploying contract...",
        autoDismiss: 0,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (!receipt.contractAddress) {
        throw new Error("Deployment failed: no contract address");
      }

      setAddress(receipt.contractAddress);
     const contractAddress = receipt.contractAddress;

 await new Promise((resolve) => setTimeout(resolve, 5_000));

    // --- 4. Call verification API ---
    const res = await fetch("/api/verify3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: contractAddress }),
    });

    if (!res.ok) {
      throw new Error(`Verification request failed (${res.status})`);
    }

    const data = await res.json();

    if (!data.success) {
      console.warn("Contract verification failed:", data);
      notifyController.current?.update({
        type: "warning",
        message: "Contract deployed, but verification failed.",
        autoDismiss: 6000,
      });
    }
    notifyController.current.update({
        type: "success",
        message: "Contract deployed successfully!",
        autoDismiss: 5000,
      });
    } catch (err) {
      console.error(err);
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
    <div style={{ padding: "20px" }}>
      {/* Wallet connect */}
      <button
        disabled={connecting}
        onClick={() => (wallet ? disconnect(wallet) : connect())}
      >
        {connecting ? "Connecting..." : wallet ? "Disconnect" : "Connect"}
      </button>

      <h1>Challenge 3</h1>

      <h2>Mission Objective</h2>
      <p>Send some ether to this address to continue(Sepolia)</p>
<p>Your contract code</p>
<pre className="bg-gray-900 text-green-300 p-4 rounded">
{`// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Challenge {
    address public immutable TARGET = 0x32E4D1CfAbE68Ae8192DE49B1E1d1C6Cb4c4c1E5;

    uint256 public immutable STARTING_BALANCE;

    constructor() {
        STARTING_BALANCE = address(TARGET).balance;
    }

    function isSolved() external view returns (bool) {
        return TARGET.balance > STARTING_BALANCE + 0.001 ether;
    }
}
            `}
</pre>


      {/* Deploy button */}
      <button
        onClick={deploy}
        disabled={!wallet || deploying}
        style={{ marginTop: "12px" }}
      >
        {deploying ? "Deploying..." : "Deploy"}
      </button>

      <button
        onClick={solve}
        disabled={!address}
        style={{ marginTop: "12px", marginLeft: "8px" }}
      >
        Check Solution
      </button>

      {/* Deployed address display */}
      {address && (
        <div style={{ marginTop: "16px", padding: "10px", backgroundColor: "#f4f4f4", borderRadius: "8px" }}>
          <strong>Active Contract Address:</strong>
          <code style={{ display: "block", marginTop: "4px", wordBreak: "break-all" }}>
            {address}
          </code>
          <small style={{ color: "gray" }}>This address is saved and will persist if you refresh.</small>
        </div>
      )}
    </div>
  );
}