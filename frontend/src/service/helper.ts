import { ethers } from "ethers";
import abi from "./abi.json"

declare global {
    interface Window {
      ethereum?: import('ethers').providers.ExternalProvider;
    }
}

const HTLC_ABI:any = abi;
const HTLC_ADDRESS = process.env.NEXT_PUBLIC_ETHEREUM_HTLC_ADDRESS!;

export async function connection() {
  const provider = new ethers.providers.Web3Provider(window.ethereum!);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(HTLC_ADDRESS, HTLC_ABI, signer);

  return {
    provider, signer, contract
  }
  
}