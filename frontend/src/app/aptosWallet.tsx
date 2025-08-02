import { useWallet } from "@aptos-labs/wallet-adapter-react";

export const PetraConnectButton = () => {
  const { connect, disconnect, connected, account } = useWallet();

  return (
    <div>
      {!connected ? (
        <button onClick={() => connect("Petra")}>Connect Petra</button>
      ) : (
        <>
          <p>Petra: {account?.address.toString()}</p>
          <button onClick={disconnect}>Disconnect Petra</button>
        </>
      )}
    </div>
  );
};