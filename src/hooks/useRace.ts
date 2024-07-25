import { useState, useEffect } from "react";
import Race from "../contracts/race";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";

export function useRaceContract() {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();

  const raceContract = useAsyncInitialize(async () => {
    if (!client) return;
    const owner = Address.parse("YourOwnerAddressHere"); // Replace with the owner's address
    const contract = new Race(
      Address.parse(
        network === CHAIN.MAINNET
          ? "EQBpRaceMainNetAddressHere" // Replace with mainnet address
          : "EQBraceTestNetAddressHere"  // Replace with testnet address
      ),
      owner
    );
    return client.open(contract) as OpenedContract<Race>;
  }, [client]);

  const { data: raceStartTime, refetch: refetchRaceStartTime } = useQuery(
    ["raceStartTime"],
    async () => {
      if (!raceContract) return null;
      return raceContract.getRaceStartTime();
    },
    { refetchInterval: 3000 }
  );

  const { data: participants, refetch: refetchParticipants } = useQuery(
    ["participants"],
    async () => {
      if (!raceContract) return null;
      // Fetch and return participants (you may need to implement this method in Race contract)
    },
    { refetchInterval: 3000 }
  );

  const { data: winner, refetch: refetchWinner } = useQuery(
    ["winner"],
    async () => {
      if (!raceContract) return null;
      return raceContract.getWinner();
    },
    { refetchInterval: 3000 }
  );

  return {
    raceStartTime,
    participants,
    winner,
    joinRace: () => raceContract?.joinRace(sender),
    submitTime: (time: number) => raceContract?.submitTime(sender, time),
    finalizeRace: () => raceContract?.finalizeRace(sender),
    distributePrize: () => raceContract?.distributePrize(sender),
    refundEntryFee: () => raceContract?.refundEntryFee(sender),
    refetchRaceStartTime,
    refetchParticipants,
    refetchWinner,
  };
}
