import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const HTLC_ABI:any = [ /* ... fill in based on deployed Ethereum contract ABI ... */ ];
const HTLC_ADDRESS = process.env.ETHEREUM_HTLC_ADDRESS!;

export async function watchHTLCEvents(callback: Function) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
  const contract = new ethers.Contract(HTLC_ADDRESS, HTLC_ABI, provider);

  contract.on("Locked", (sender, receiver, hashlock, amount, expiry, event) => {
    callback({
      sender,
      receiver,
      hashlock,
      amount: amount.toString(),
      expiry: expiry.toNumber(),
      txHash: event.transactionHash,
    });
  });

  console.log("👀 Watching for Locked HTLC events...");
}
