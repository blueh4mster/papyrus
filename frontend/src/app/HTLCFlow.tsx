'use client';

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sha256 } from "js-sha256";
import RedeemButton from './redeem' 

export default function HTLCFlow() {
  const [step, setStep] = useState(1);
  const [secret, setSecret] = useState("");
  const [hash, setHash] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amt, setAmt] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const generateSecret = () => {
    const random = crypto.getRandomValues(new Uint8Array(32));
    const hexSecret = Array.from(random).map(b => b.toString(16).padStart(2, "0")).join("");
    setSecret(hexSecret);
    setHash(sha256(hexSecret));
    setStep(2);
  };

  const revealSecret = () => {
    setRevealed(true);
    setStep(3);
  };

  const lock = () =>{

  }

  return (
    <main className="max-w-xl mx-auto mt-10 space-y-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-xl font-bold mb-4">HTLC Cross-Chain Swap</h1>

          {step === 1 && (
            <div className="space-y-4">
              <p>Step 1: Generate a secret to use for the hashlock.</p>
              <Button onClick={generateSecret}>Generate Secret</Button>
            </div>
          )}

          {step >= 2 && (
            <div className="space-y-3">
              <p className="text-sm">Secret:</p>
              <Input readOnly value={secret} className="text-xs" />
              <p className="text-sm">SHA-256 Hash (for hashlock):</p>
              <Input readOnly value={hash} className="text-xs" />
            </div>
          )}

          {step === 2 && (
            <div className="mt-6 space-y-3">
                <p className="text-sm">Receiver :</p>
                <Input readOnly value={receiver} className="text-xs" />
                <p className="text-sm">Amount :</p>
                <Input readOnly value={amt} className="text-xs" />
                <p className="text-sm">
                Step 2: Lock funds on Ethereum using the hash above. Once the other party locks on Aptos, click below.
              </p>
              <Button onClick={lock}> Lock Funds On Aptos </Button>
              <Button onClick={revealSecret}>I locked on Aptos</Button>
            </div>
          )}

          {step === 3 && revealed && (
            <div className="mt-6">
              <p className="text-sm mb-2">Step 3: Reveal the secret on Ethereum to claim the funds.</p>
              <Input readOnly value={secret} className="text-xs" />
              <RedeemButton hash={hash} receiver={receiver} amount={amt}/>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
