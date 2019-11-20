import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";

import { createWallet, getUserWalletPassphrase } from "./wallet";
/*

TODO

1. Try to connect to metamask first
2. Then try to get the mnemonic from the backend
3. If nothing is return from backend it means they haven't created a wallet yet
4. Ask the user if they want to create a wallet

 */

export const configureWeb3 = async (walletType, options = {}) => {
  let w3 = null;

  switch (walletType) {
    case "metamask":
      w3 = await configureMetaMask();
      const accounts = await w3.eth.getAccounts();
      console.log(accounts);
      break;
    case "local":
      const password = options.userPassword;
      w3 = await configureLocalWallet(password);
      break;
    default:
      break;
  }

  if (w3 !== null) {
    // TODO: Store it in redux
  } else {
    throw Error("Faile to configure web3");
  }
};

export const configureMetaMask = async () => {
  // TODO: Clean up and add error messaging
  const ethereum =
    typeof window.ethereum !== "undefined" ? window.ethereum : null;
  if (ethereum) {
    if (ethereum.isMetaMask) {
      const connected = await enableMetaMask(ethereum);
      if (connected) {
        return new Web3(ethereum);
      }
    }
  }
};

async function enableMetaMask(ethereum) {
  try {
    const accounts = await ethereum.enable();
    if (accounts) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    // TODO: Handle error
    console.error(err);
  }
  return false;
}

export const configureLocalWallet = async (userPassword) => {
  // TODO: Error handling for failures
  createWallet(userPassword);
  const mnemonic = await getUserWalletPassphrase(userPassword);

  provider = new HDWalletProvider(mnemonic, INFURA_URL); // TODO: Replace with Infura url
  return Web3(provider);
};
