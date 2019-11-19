import HDWalletProvider from "@truffle/hdwallet-provider";
import { getUserWalletPassphrase } from "./utils";
/*

TODO

1. Try to connect to metamask first
2. Then try to get the mnemonic from the backend
3. If nothing is return from backend it means they haven't created a wallet yet
4. Ask the user if they want to create a wallet

 */

const userPassword = "userPassword"; // TODO: Replace with user entered password
createWallet(userPassword);

const mnemonic = getUserWalletPassphrase(userPassword);
provider = new HDWalletProvider(mnemonic, INFURA_URL); // TODO: Replace with Infura url
