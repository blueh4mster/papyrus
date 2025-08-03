import { Aptos, Account, Ed25519PrivateKey, Network, AptosConfig } from "@aptos-labs/ts-sdk";
import { sha256 } from "js-sha256";

async function fetchEthToAptRate() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,aptos&vs_currencies=usd';

  try {
    const response = await fetch(url);
    const data = await response.json();

    const ethPrice = data.ethereum.usd;
    const aptPrice = data.aptos.usd;

    const ethToAptRate = ethPrice / aptPrice;

    console.log(`1 ETH = ${ethToAptRate} APT`);
    return ethToAptRate;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return 5000;
  }
}

async function getClaimAmount(ethInWei: any) {
  const eth = Number(ethInWei) / 1e18;
  const rate = await fetchEthToAptRate();
  const apt = eth * rate;
  const aptOctas = Math.floor(apt * 1e8); // 1 APT = 10^8 octas
  return aptOctas;
}

const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

const resolverAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(process.env.NEXT_PUBLIC_APTOS_RESOLVER_KEY!),
});

const strToBytes = (str: string) =>
  Array.from(new TextEncoder().encode(str));

function hexToBytes(hex: string): number[] {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  return hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16));
}


export async function redeemOnAptos(
  receiver: string,
  hashlock: string,
  secret: string,
  timelock: number,
  amount: number
) {
  const hex = hashlock.startsWith("0x") ? hashlock.slice(2) : hashlock;
  const amount_in_octas = await getClaimAmount(amount);
  console.log(amount_in_octas)
  const arg0 = receiver;
  const arg1 = hexToBytes(hex);
  const arg2 = strToBytes(secret);
  const arg3 = timelock;
  const arg4 = amount_in_octas;

  const tx = await aptos.transaction.build.simple({
    sender: resolverAccount.accountAddress,
    data: {
      function: "0x8b5cbf559e7998837bf87c3762774b7b418e8278f03f2305da38827ff2665918::htlc_aptos::claimSingle",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [
        arg0,
        arg1,
        arg2,
        arg3,
        arg4
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

