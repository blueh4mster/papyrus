import { watchHTLCEvents } from './ethereumClient';
import { redeemOnAptos } from './aptosClient';

export async function startResolver(secret : string) {
  console.log("Starting cross-chain resolver...");

  await watchHTLCEvents(async (event: any) => {
    const { id, sender, receiver, amount } = event;

    console.log(` Swap Event Detected:
      Sender: ${sender}
      Receiver: ${receiver}
      Id: ${id}
      Amount: ${amount}
    `);

    // Validate time + hashlock on Aptos and attempt redeem
    try {
      const txHash = await redeemOnAptos({
        sender, id, secret
      });

      console.log(`Redeemed on Aptos: ${txHash}`);
    } catch (err) {
      console.error("Error resolving swap on Aptos:", err);
    }
  });
}
