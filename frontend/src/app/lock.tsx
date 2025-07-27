"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { lockFunds } from "@/service/ethereumClient";

declare global {
    interface Window {
      ethereum?: ethers.providers.ExternalProvider;
    }
}

export default function LockButton({hash, receiver, amount}:{hash: any, receiver:any, amount:Number}) {
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    async function handleLock() {
        setLoading(true);
        if (typeof window !== "undefined" && window.ethereum) {
            const response = await lockFunds({
                receiver:receiver,
                hashlock:hash,
                amountInEth: amount.toString()
            })
            setLoading(false);
            }
    }
    
  
    return (
      <div>
        <Button onClick={handleLock} disabled={loading}>
          {loading ? "locking..." : "lock on Ethereum"}
        </Button>
  
        {txHash && <p>Transaction Hash: {txHash}</p>}
      </div>
    );
  }
  