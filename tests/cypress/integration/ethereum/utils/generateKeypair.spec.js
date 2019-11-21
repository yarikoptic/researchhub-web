import {
  generatePassphrase,
  generateKeypair,
  decryptWithPassword,
  checkMnemonicIsValid,
} from "../../../../../ethereum/utils";

describe("Ethereum Utils", function() {
  context("generateKeyPair", function() {
    it("returns a secp256k1 public key", () => {
      const result = generateKeypair();
      expect(result).to.be.an('Uint8Array');
    });
  });

  context("generatePassphrase", function() {
    it("returns aes sjcl cipher object", () => {
      const password = "hello, cipher";
      const result = generatePassphrase(password);
      expect(result).to.contain(`"cipher":"aes"`);
    });
    it("creates a password decryptable BIP39 mnemonic", () => {
      const password = "hello, cipher";
      const cipher = generatePassphrase(password);
      const mnemonic = decryptWithPassword(password, cipher);
      const words = mnemonic.split(" ");
      expect(words.length).to.equal(12);
      expect(checkMnemonicIsValid(mnemonic)).to.be.true;
    });
    it("decrypts with the password used for encryption", () => {
      const password = "hello, cipher";
      const cipher = generatePassphrase(password);
      const password1 = "hello cipher";
      expect(() => decryptWithPassword(password1, cipher)).to.throw();
    });
  });

});
