import { ethers } from "ethers";
import abi from "./abi.json"
import {connection} from './helper'

const HTLC_ABI:any = abi;
const HTLC_ADDRESS = process.env.NEXT_PUBLIC_ETHEREUM_HTLC_ADDRESS!;

export async function lockFunds({
  receiver,
  hashlock,
  amountInEth
}: {
  receiver: string;
  hashlock: string;
  amountInEth: string;
}) {
  const contract = (await connection()).contract;
  const signer = (await connection()).signer;

  const tokenAddress = "0xdd13E55209Fd76AfE204dBda4007C227904f0a81" //weth address sepolia
  const timelock = Math.floor(Date.now() / 1000) + 3600; 
  const id = ethers.utils.hexlify(ethers.utils.randomBytes(32));
  const amt = ethers.utils.parseEther(amountInEth);
  const hashlock_ = `0x${hashlock}`
  // const WETH_ABI = [
  //   "function deposit() public payable",
  //   "function approve(address spender, uint256 amount) external returns (bool)",
  //   "function balanceOf(address account) external view returns (uint256)"
  // ];

  // const WETH_ADDRESS = "0xdd13E55209Fd76AfE204dBda4007C227904f0a81";
  // const weth = new ethers.Contract(WETH_ADDRESS, WETH_ABI, signer);
  // const balance = await weth.balanceOf("0x54794702f3c99e225569c7743B26c20d6360E762");
  // console.log("WETH Balance:", ethers.utils.formatEther(balance));
  // await weth.approve(HTLC_ADDRESS, ethers.utils.parseEther("0.002"));
  console.log(receiver)
  console.log(id)
  console.log(amt)
  console.log(tokenAddress)
  console.log(hashlock_)

  const tx = await contract.lock(
    id, 
    receiver,
    tokenAddress,
    amt,
    hashlock_,
    timelock
  );

  await tx.wait();
  return {id:id, receiver, amt, tokenAddress, hashlock: hashlock_, txn_hash: tx.hash, timelock:timelock};
}

export async function watchHTLCEvents(callback: Function) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETH_RPC_URL);
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

  console.log("Watching for Locked HTLC events...");
}
