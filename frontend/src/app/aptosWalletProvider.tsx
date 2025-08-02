import React from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

export const AptosWalletProvider = ({ children }: { children: React.ReactNode }) => (
  <AptosWalletAdapterProvider autoConnect={true}>
    {children}
  </AptosWalletAdapterProvider>
);

