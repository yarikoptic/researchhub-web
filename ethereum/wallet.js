import API from "../config/api";
import { handleCatch } from "../config/utils";

import {
  checkMnemonicIsValid,
  decryptWithPassword,
  generatePassphrase,
} from "./utils";

/**
 * Sends the password encrypted wallet passphrase for backend API storage.
 * Throws if an error occurs.
 *
 * @param {String} password User's password providing access to signing keys
 */
export const createWallet = async (password) => {
  const passphrase = generatePassphrase(password);
  const response = await fetch(
    API.WALLET(),
    API.POST_CONFIG({ passphrase })
  ).catch(handleCatch);

  if (!response.ok) {
    throw Error("Failed to create wallet");
  }

  return address;
};

export const getUserWalletPassphrase = async (password) => {
  let encryptedPassphrase;

  const response = await fetch(API.WALLET(), API.GET_CONFIG()).catch(
    handleCatch
  );

  if (!response.ok) {
    throw Error("Failed to get wallet passphrase");
  } else {
    const body = await response.json();
    encryptedPassphrase = body.passphrase;
  }

  const mnemonic = decryptWithPassword(encryptedPassphrase);
  if (checkMnemonicIsValid(mnemonic)) {
    return mnemonic;
  } else {
    throw Error("Mnemonic was not valid");
  }
};
