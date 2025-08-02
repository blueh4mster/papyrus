import { PetraConnectButton } from "./aptosWallet";
import { AptosWalletProvider } from "./aptosWalletProvider";
import ConnectWallet from "./connectWallet";
import { useState } from "react";
import { ethers } from "ethers";

export const MultiWalletUI = () => {
    const [account, setAccount] = useState<string | null>(null);
      const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
      const [signer, setSigner] = useState<ethers.Signer | null>(null);
  return (
    <div>
      <h2>Wallet Connections</h2>
      <ConnectWallet account={account} provider={provider} signer={signer} setAccount={setAccount} setProvider={setProvider} setSigner={setSigner}/>
      <AptosWalletProvider>
        <PetraConnectButton />
      </AptosWalletProvider>
    </div>
  );
};