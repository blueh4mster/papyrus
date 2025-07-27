'use client';

import HTLCFlow from "./HTLCFlow";
import ConnectWallet from "./connectWallet";
import LockedInstanceCard from "./lockedInstanceCard";
import { contract } from "@/service/helper";

import { useState, useEffect } from "react";
import {ethers} from "ethers"


type LockedInstance = {
  id: string;
  sender: string;
  receiver: string;
  amt: ethers.BigNumber;
  claimed: boolean
};

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [lockedInstances, setLockedInstances] = useState<LockedInstance[]>([]);

  useEffect(() => {
    const getLocks = async () => {
      const logs = await contract!.queryFilter("Lock"); // event Lock(bytes32 id, address sender, ...)
      const instances = logs.map(log => (
        {
        id: log.args!.id,
        amt: log.args!.amount,
        sender: log.args!.sender,
        receiver: log.args!.receiver,
        claimed: false
      }));
      setLockedInstances(instances);
    };

    getLocks();
  }, []);

  return (
    <>
    <ConnectWallet account={account} provider={provider} signer={signer} setAccount={setAccount} setProvider={setProvider} setSigner={setSigner}/>
    <HTLCFlow/>
    {lockedInstances.length === 0 && 
      (<div>
        <ul>
        {lockedInstances.map((l, idx)=>(
          <LockedInstanceCard 
          id={l.id}
          sender={l.sender}
          receiver={l.receiver}
          amt={l.amt.toNumber()}/>
        ))}
        </ul>
      </div>)
    }
    </>
  );
}
