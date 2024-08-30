import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import { Race } from "../wrappers/OnChainRace"; // Adjust the import path as necessary
import axios from "axios";

export async function getDataFromRace(client: TonClient, raceAddress: Address) {
  try {
    // Open Race instance by address
    const raceContract = Race.createFromAddress(raceAddress);
    const contractAddress = raceAddress.toString();
    console.log(`Race contract address: ${contractAddress}`);

    // Create a ContractProvider for Race contract
    const raceProvider = client.provider(raceAddress);

    // Retrieve and log race information from the smart contract| Best Time: ${bestTimeSeconds.toFixed(3)} seconds
    const raceInfo = await raceContract.getInfo(raceProvider);
    const bestTimeSeconds = raceInfo.bestTime / 1000;
    const raceInfoMessage = `
      
      Total Fees: ${raceInfo.totalFees.toString()} nanoTON
      Current Tournament Number: ${raceInfo.currentTournamentNumber}
      Best Player Address: ${raceInfo.bestPlayer.toString()}
    `;
    console.log(raceInfoMessage);

    // Alert the retrieved information
    alert(`
      Race contract address: ${contractAddress}
      ${raceInfoMessage.trim()}
    `.trim());

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
