"use client";

import { useState } from "react";

export default function RedeemButton({hash, receiver, amount}:{hash: any, receiver:any, amount:Number}) {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function handleRedeem() {
    setLoading(true);

    const response = await fetch("/api/redeem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hashlock: hash, 
        receiver: receiver,
        amount: amount,
        expiry: 99999999,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      setTxHash(result.txHash);
    } else {
      alert("Error: " + result.error);
    }

    setLoading(false);
  }

  return (
    <div>
      <button onClick={handleRedeem} disabled={loading}>
        {loading ? "Redeeming..." : "Redeem on Aptos"}
      </button>

      {txHash && <p>Transaction Hash: {txHash}</p>}
    </div>
  );
}
