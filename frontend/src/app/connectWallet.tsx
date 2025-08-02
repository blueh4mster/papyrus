import { ethers } from "ethers";

export default function ConnectWallet({account, provider, signer, setAccount, setProvider, setSigner}:{account:string | null,
    provider:ethers.providers.Web3Provider | null, signer:ethers.Signer | null, 
    setAccount: React.Dispatch<React.SetStateAction<string | null>>, 
    setProvider: React.Dispatch<React.SetStateAction<ethers.providers.Web3Provider | null>>, 
    setSigner: React.Dispatch<React.SetStateAction<ethers.Signer | null>>}) {

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not found");
      return;
    }

    try {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      await ethProvider.send("eth_requestAccounts", []); // prompts MetaMask connect
      const userSigner = ethProvider.getSigner();
      const userAddress = await userSigner.getAddress();

      setProvider(ethProvider);
      setSigner(userSigner);
      setAccount(userAddress);
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
      </button>
    </div>
  );
}
