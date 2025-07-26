import { Aptos, Account, Ed25519PrivateKey, Network, AptosConfig } from "@aptos-labs/ts-sdk";
import dotenv from "dotenv";

dotenv.config();

const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

const resolverAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(process.env.APTOS_RESOLVER_KEY!),
});

export async function redeemOnAptos({
  hashlock,
  receiver,
  amount,
  expiry,
}: {
  hashlock: string;
  receiver: string;
  amount: number;
  expiry: number;
}) {
  const tx = await aptos.transaction.build.simple({
    sender: resolverAccount.accountAddress,
    data: {
      function: "0xYourModuleAddress::htlc::redeem",
      functionArguments: [
        `0x${hashlock}`,
        receiver,
        amount,
        expiry,
      ],
    },
  });

  const committedTx = await aptos.signAndSubmitTransaction({
    signer: resolverAccount,
    transaction: tx,
  });

  await aptos.waitForTransaction({ transactionHash: committedTx.hash });

  return committedTx.hash;
}
