import { generateKeypair } from "../../../../../ethereum/utils";

describe("Ethereum Utils", function() {
  context("generateKeyPair", function() {
    it("returns a secp256k1 public key", () => {
      const result = generateKeypair();
    });
  });
});
