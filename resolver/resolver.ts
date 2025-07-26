import { watchHTLCEvents } from './ethereumClient';
import { redeemOnAptos } from './aptosClient';

async function startResolver() {
  console.log("Starting cross-chain resolver...");

  await watchHTLCEvents(async (event: any) => {
    const { hashlock, sender, receiver, amount, expiry } = event;

    console.log(`🔁 Swap Event Detected:
      Sender: ${sender}
      Receiver: ${receiver}
      Hashlock: ${hashlock}
    `);

    // Validate time + hashlock on Aptos and attempt redeem
    try {
      const txHash = await redeemOnAptos({
        hashlock,
        receiver,
        amount,
        expiry,
      });

      console.log(`✅ Redeemed on Aptos: ${txHash}`);
    } catch (err) {
      console.error("❌ Error resolving swap on Aptos:", err);
    }
  });
}

startResolver();
