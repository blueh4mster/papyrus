'use client';

import HTLCFlow from "./HTLCFlow";
import { MultiWalletUI } from "./bothWallets";
import LockedInstanceCard from "./lockedInstanceCard";
import { connection } from "@/service/helper";

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
  const [lockedInstances, setLockedInstances] = useState<LockedInstance[]>([]);

  useEffect(() => {
    const getLocks = async () => {
      const contract = (await connection()).contract;
      const logs = await contract!.queryFilter("Locked"); // event Lock(bytes32 id, address sender, ...)
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
    <MultiWalletUI/>
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
