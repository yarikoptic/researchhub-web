import * as bip39 from "bip39";
import { randomBytes } from "crypto";
import secp256k1 from "secp256k1";
import { encrypt, decrypt } from "sjcl";

// TODO: Need to test these utils with cypress

/**
 * Returns a randomly generated ECDSA keypair based on the secp256k1 curve.
 */
export const generateKeypair = () => {
  const message = randomBytes(32);
  let privateKey = randomBytes(32);

  while (!secp256k1.privateKeyVerify(privateKey)) {
    privateKey = randomBytes(32);
  }

  const publicKey = secp256k1.publicKeyCreate(privateKey); // compressed

  const signed = secp256k1.sign(message, privateKey);
  const signatureIsVerified = secp256k1.verify(
    message,
    signed.signature,
    publicKey
  );

  if (signatureIsVerified === true) {
    console.log(publicKey);
    return publicKey;
  } else {
    throw Error("Failed to generate key pair");
  }
};

/**
 * Returns the AES ciphertext of a random 12-word, password encrypted, mnemonic.
 *
 * @param {String} password Password used for encryption
 * @returns {String} Ciphertext
 */
export const generatePassphrase = (password) => {
  // Generate a random mnemonic (uses crypto.randomBytes under the hood),
  // defaults to 128-bits of entropy
  const mnemonic = bip39.generateMnemonic();

  if (checkMnemonicIsValid(mnemonic)) {
    return encryptWithPassword(password, mnemonic);
  } else {
    throw Error("Mnemonic was not valid");
  }
};

export const checkMnemonicIsValid = (mnemonic) => {
  return bip39.validateMnemonic(mnemonic);
};

export const encryptWithPassword = (password, data) => {
  encrypt(password, data);
};

export const decryptWithPassword = (password, encryptedData) => {
  decrypt(password, encryptedData);
};
