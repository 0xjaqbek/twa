import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import { OnChainRace } from "../wrappers/OnChainRace"; // Adjust the import path as necessary
import axios from "axios";

export async function getDataFromOnChainRace(client: TonClient, onChainRaceAddress: Address) {
  try {
    // Open OnChainRace instance by address
    const onChainRace = OnChainRace.createFromAddress(onChainRaceAddress);
    console.log(`OnChainRace contract address: ${onChainRaceAddress.toString()}`);

    // Create a ContractProvider for OnChainRace contract
    const onChainRaceProvider = client.provider(onChainRaceAddress);

    // Retrieve and log run time and user address from the smart contract
    const runTimeMilliseconds = await onChainRace.getRunTime(onChainRaceProvider);
    const runTimeSeconds = runTimeMilliseconds / 1000;
    console.log("Run Time:", runTimeSeconds.toFixed(3)); // Show the run time with millisecond precision

    const userAddressObj = await onChainRace.getUserAddress(onChainRaceProvider);
    console.log("User Address:", userAddressObj.toString());

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

export async function run() {
  try {
    console.log("Starting interaction with OnChainRace contract...");

    // Initialize TON RPC client on testnet
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    console.log(`Using endpoint: ${endpoint}`);
    const client = new TonClient({ endpoint });

    // Define the OnChainRace contract address
    const onChainRaceAddress = Address.parse("kQDW1VLFvS3FJW5rl2tyNfQ-mOfN5nPYGPAHh1vueJsRywwm"); // Replace with your contract address

    // Call the function to get data from OnChainRace
    await getDataFromOnChainRace(client, onChainRaceAddress);

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

run().catch(console.error);
