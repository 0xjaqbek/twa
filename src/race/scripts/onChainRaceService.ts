import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, WalletContractV4, Address, Sender, ContractProvider, toNano } from "@ton/ton";
import { Race } from "../wrappers/OnChainRace"; // Adjust the import path as necessary
import { TonConnectUI, SendTransactionRequest } from "@tonconnect/ui-react"; 
import { Buffer } from "buffer"; 
import axios from "axios";

export async function sendRecordTimeToRace(userAddress: string, elapsedTime: number, tonConnectUI: TonConnectUI) {
  try {
    console.log("Starting interaction with Race contract...");

    // Initialize TON RPC client on testnet
    const endpoint = await getHttpEndpoint({ network: "testnet" });
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
    const wallet = WalletContractV4.create({ publicKey: publicKeyBuffer, workchain: 0 });
    const walletContract = client.open(wallet);

    const walletSender: Sender = {
      send: async (message) => {
        const transactionRequest: SendTransactionRequest = {
          validUntil: Math.floor(Date.now() / 1000) + 60, 
          messages: [
            {
              address: message.to.toString(),
              amount: message.value.toString(),
              payload: message.body?.toBoc().toString('base64'), 
            },
          ],
        };
        await tonConnectUI.sendTransaction(transactionRequest);
      },
    };

    const seqno = await walletContract.getSeqno();
    console.log("Seqno: ", seqno);

    // Open Race instance by address
    const raceAddress = Address.parse("kQC_8HjVICJndonC88WPdsekT072YY0vvcj3I2oXgmEcDWT1"); // Replace with your contract address
    const raceContract = Race.createFromAddress(raceAddress);
    console.log(`Race contract address: ${raceAddress.toString()}`);

    // Create a ContractProvider for Race contract
    const raceProvider = client.provider(raceAddress);

    // Send the recorded time
    const userAddr = Address.parse(userAddress); // Use the provided user address
    await raceContract.sendRecordTime(raceProvider, walletSender, {
      time: Math.floor(elapsedTime * 1000), // Ensure time is in milliseconds
      value: toNano('1.1'), // Adjust value as necessary
    });

    // Wait until confirmed
    let currentSeqno = seqno;
    while (currentSeqno === seqno) {
      console.log("Waiting for transaction to confirm...");
      await sleep(1500);
      currentSeqno = await walletContract.getSeqno();
    }
    console.log("Transaction confirmed!");

    // Retrieve and log the updated race info
    const raceInfo = await raceContract.getInfo(raceProvider);
    console.log("Best Time:", raceInfo.bestTime);
    console.log("Total Fees:", raceInfo.totalFees.toString());
    console.log("Current Tournament Number:", raceInfo.currentTournamentNumber);
    console.log("Best Player Address:", raceInfo.bestPlayer.toString());

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      console.error('Response data:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
