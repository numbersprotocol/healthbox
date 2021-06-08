import Web3 from "web3";

const web3 = new Web3();

export function createEthAccount() {
  console.log("02");
  return web3.eth.accounts.create();
}

export function loadEthAccount(privateKey: string) {
  console.log("loadEthAccount-02");

  return web3.eth.accounts.privateKeyToAccount(privateKey);
}

export function verifyWithEthSignature(
  message: string,
  signature: string,
  publicKey: string
) {
  try {
    return web3.eth.accounts.recover(message, signature) === publicKey;
  } catch (e: unknown) {
    return false;
  }
}
