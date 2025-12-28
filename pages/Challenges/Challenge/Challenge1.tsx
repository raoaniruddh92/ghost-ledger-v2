"use client";

import { useRef, useState, useEffect } from "react";
import { useConnectWallet, useNotifications } from "@web3-onboard/react";
import { useRouter } from "next/router";
import { Challenges1abi as abi, Challenges1bytecode as bytecode} from "../../../utils/abi";
import { publicClient } from "@/utils/client";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

const STORAGE_KEY = "challenge1_contract_address";

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

      const hash = await walletClient.deployContract({
        abi: abi,
        account,
        bytecode: bytecode as `0x${string}`,
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

      <h1>Challenge 1</h1>

      <h2>Mission Objective</h2>
      <ol>
        <li>Install MetaMask</li>
        <li>Switch to the Sepolia test network</li>
        <li>Get some Sepolia ETH</li>
      </ol>

      <p>
        After you’ve received test ETH, click deploy to deploy the challenge
        contract. You don’t need to interact with the contract — just deploy it.
      </p>

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