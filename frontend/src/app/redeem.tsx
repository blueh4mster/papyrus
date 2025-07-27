"use client";

import { useState } from "react";
import { startResolver } from "@/service/resolver";

export default function RedeemButton({secret}:{secret:string}) {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleRedeem = async() => {
    console.log("claiming...")
    setLoading(true)
    await startResolver(secret);
    console.log("claimed!")
    setLoading(false)
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
