import { Aptos, Account, Ed25519PrivateKey, Network, AptosConfig } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

const resolverAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(process.env.NEXT_PUBLIC_APTOS_RESOLVER_KEY!),
});

const strToBytes = (str: string) =>
  Array.from(new TextEncoder().encode(str));

export async function redeemOnAptos({
  sender,
  id,
  secret
}: {
  sender: string;
  id: string;
  secret: string;
}) {
  const arg1 = strToBytes(sender);
  const arg2 = strToBytes(id);
  const arg3 = strToBytes(secret);

  const tx = await aptos.transaction.build.simple({
    sender: resolverAccount.accountAddress,
    data: {
      function: "0x55e3708368f22c77c445935373cc68c187d2171a395177fd79a25b185fc38461::htlc_aptos::claim",
      functionArguments: [
        arg1,
        arg2,
        arg3
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
