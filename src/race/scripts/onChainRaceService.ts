import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import { OnChainRace } from "../wrappers/OnChainRace"; // Adjust the import path as necessary
import axios from "axios";

export async function sendTransactionToOnChainRace(userAddress: string, elapsedTime: number) {
  try {
    console.log("Starting interaction with OnChainRace contract...");

    // Initialize TON RPC client on testnet
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    console.log(`Using endpoint: ${endpoint}`);
    const client = new TonClient({ endpoint });

    // Open wallet v4
    const mnemonic = "clarify friend crime route horse daughter convince chalk feed power desk mystery knock ocean tornado actor skill glow theory off suspect nut obvious yard"; // Replace with your 24 secret words
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

    const isDeployed = await client.isContractDeployed(wallet.address);
    console.log(`Wallet is deployed: ${isDeployed}`);
    if (!isDeployed) {
      return console.log("Wallet is not deployed");
    }
    console.log(`Wallet address: ${wallet.address.toString()}`);

    // Open wallet and read the current seqno of the wallet
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);
    const seqno = await walletContract.getSeqno();
    console.log("Seqno: ", seqno);

    // Open OnChainRace instance by address
    const onChainRaceAddress = Address.parse("kQDW1VLFvS3FJW5rl2tyNfQ-mOfN5nPYGPAHh1vueJsRywwm"); // Replace with your contract address
    const onChainRace = OnChainRace.createFromAddress(onChainRaceAddress);
    console.log(`OnChainRace contract address: ${onChainRaceAddress.toString()}`);

    // Create a ContractProvider for OnChainRace contract
    const onChainRaceProvider = client.provider(onChainRaceAddress);

    // Ensure elapsedTime is an integer in milliseconds
    const elapsedTimeMilliseconds = Math.floor(elapsedTime * 1000);
    console.log(`Sending transaction with elapsedTime (ms): ${elapsedTimeMilliseconds}, userAddress: ${userAddress}`);

    // Send the set data transaction
    const userAddr = Address.parse(userAddress); // Use the provided user address
    await onChainRace.sendSetData(onChainRaceProvider, walletSender, BigInt(0.1 * 1e9), elapsedTimeMilliseconds, userAddr);

    // Wait until confirmed
    let currentSeqno = seqno;
    while (currentSeqno === seqno) {
      console.log("Waiting for transaction to confirm...");
      await sleep(1500);
      currentSeqno = await walletContract.getSeqno();
    }
    console.log("Transaction confirmed!");

    // Retrieve and log run time from the smart contract
    const runTimeMilliseconds = await onChainRace.getRunTime(onChainRaceProvider);
    const runTimeSeconds = runTimeMilliseconds / 1000;
    console.log("Run Time:", runTimeSeconds.toFixed(3)); // Show the run time with millisecond precision

  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle AxiosError
      console.error('Axios error:', error.message);
      console.error('Response data:', error.response?.data);
    } else {
      // Handle other errors
      console.error('Unexpected error:', error);
    }
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
