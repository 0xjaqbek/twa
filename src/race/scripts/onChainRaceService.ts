import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, WalletContractV4, Address, Sender, ContractProvider } from "@ton/ton";
import { OnChainRace } from "../wrappers/OnChainRace"; // Adjust the import path as necessary
import { TonConnectUI, SendTransactionRequest } from "@tonconnect/ui-react"; // Use TonConnectUI instead of TonConnect
import { Buffer } from "buffer"; // Add this import for Buffer
import axios from "axios";

export async function sendTransactionToOnChainRace(userAddress: string, elapsedTime: number, tonConnectUI: TonConnectUI) {
  try {
    console.log("Starting interaction with OnChainRace contract...");

    // Initialize TON RPC client on testnet
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    console.log(`Using endpoint: ${endpoint}`);
    const client = new TonClient({ endpoint });

    // Ensure wallet is connected
    const connectedWallet = tonConnectUI.wallet;
    if (!connectedWallet) {
      throw new Error("No wallet connected");
    }

    const publicKeyHex = connectedWallet.account?.publicKey;
    if (!publicKeyHex) {
      throw new Error("No public key found");
    }

    const publicKeyBuffer = Buffer.from(publicKeyHex, "hex");
    const walletAddress = connectedWallet.account.address;
    console.log(`Connected wallet address: ${walletAddress}`);
    
    // Create a wallet contract instance using the connected wallet's public key
    const wallet = WalletContractV4.create({ publicKey: publicKeyBuffer, workchain: 0 });
    const isDeployed = await client.isContractDeployed(wallet.address);
    console.log(`Wallet is deployed: ${isDeployed}`);
    if (!isDeployed) {
      return console.log("Wallet is not deployed");
    }

    // Open wallet and read the current seqno of the wallet
    const walletContract = client.open(wallet);

    // Adapted for proper signing
    const walletSender: Sender = {
      send: async (message) => {
        const transactionRequest: SendTransactionRequest = {
          validUntil: Math.floor(Date.now() / 1000) + 60, // 1 minute validity
          messages: [
            {
              address: message.to.toString(), // Ensuring the correct address is used
              amount: message.value.toString(), // Ensure amount is a string
              payload: message.body?.toBoc().toString('base64'), // Convert the payload to base64
            },
          ],
        };
        await tonConnectUI.sendTransaction(transactionRequest);
      },
    };

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
