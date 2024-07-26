import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import { OnChainRace } from "../wrappers/OnChainRace"; // Adjust the import path as necessary
import axios from "axios";

export async function getDataFromOnChainRace(client: TonClient, onChainRaceAddress: Address) {
  try {
    // Open OnChainRace instance by address
    const onChainRace = OnChainRace.createFromAddress(onChainRaceAddress);
    const contractAddress = onChainRaceAddress.toString();
    console.log(`OnChainRace contract address: ${contractAddress}`);

    // Create a ContractProvider for OnChainRace contract
    const onChainRaceProvider = client.provider(onChainRaceAddress);

    // Retrieve and log run time and user address from the smart contract
    const runTimeMilliseconds = await onChainRace.getRunTime(onChainRaceProvider);
    const runTimeSeconds = runTimeMilliseconds / 1000;
    const runTimeMessage = `Run Time: ${runTimeSeconds.toFixed(3)}`; // Show the run time with millisecond precision
    console.log(runTimeMessage);

    const userAddressObj = await onChainRace.getUserAddress(onChainRaceProvider);
    const userAddressMessage = `User Address: ${userAddressObj.toString()}`;
    console.log(userAddressMessage);

    // Combine all messages into a single alert
    const combinedMessage = `
      OnChainRace contract address: ${contractAddress}
      ${runTimeMessage}
      ${userAddressMessage}
    `;
    alert(combinedMessage.trim());

  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle AxiosError
      const axiosErrorMessage = `Axios error: ${error.message}`;
      const responseData = `Response data: ${error.response?.data}`;
      console.error(axiosErrorMessage);
      console.error(responseData);
      alert(`${axiosErrorMessage}\n${responseData}`);
    } else {
      // Handle other errors
      const unexpectedErrorMessage = `Unexpected error: ${error}`;
      console.error(unexpectedErrorMessage);
      alert(unexpectedErrorMessage);
    }
  }
}
