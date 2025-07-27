import { Button } from "@/components/ui/button";
import React from "react";
import { signer } from "@/service/helper";

interface LockedInstanceCardProps {
  id: string;
  sender:string;
  receiver: string;
  amt: Number; // e.g., "0.01 ETH"
}

const LockedInstanceCard: React.FC<LockedInstanceCardProps> = async ({
  id,
  sender,
  receiver,
  amt,
}) => {
    const amt_string = amt.toString()
    const addr = await signer.getAddress();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Assuming it's in seconds
    return date.toLocaleString();
  };

  const lockAptos = async() => {

  }

  const claim = async() => {
    
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 w-full max-w-xl mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Locked HTLC Instance</h2>
      <div className="text-sm text-gray-700">
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Sender:</strong>{sender}</p>
        <p><strong>Receiver:</strong> {receiver}</p>
        <p><strong>Amount:</strong> {amt_string}</p>
      </div>
      {addr === sender} && (
      <Button onClick={claim}></Button>
      )
      {addr === receiver} && (
        <Button onClick={lockAptos}></Button>
      )
    </div>
  );
};

export default LockedInstanceCard;