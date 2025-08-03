import { watchHTLCEvents } from './ethereumClient';
import { redeemOnAptos } from './aptosClient';

export async function startResolver(secret : string, receiver: string) {
  console.log("Starting cross-chain resolver...");

  await watchHTLCEvents(async (event: any) => {
    const { id, sender, receiver, amount, hashlock, timelock } = event;

    console.log(` Swap Event Detected:
      Sender: ${sender}
      Receiver: ${receiver}
      Id: ${id}
      Amount: ${amount}
      Hashlock: ${hashlock}
      Timelock: ${timelock}
    `);

    const tx_hash = await redeemOnAptos(receiver, hashlock, secret, timelock, amount);
    console.log(tx_hash);
  });
}
