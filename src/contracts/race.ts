import {
    Contract,
    ContractProvider,
    Sender,
    Address,
    Cell,
    contractAddress,
    beginCell,
  } from "ton-core";
  
  export default class Race implements Contract {
    private raceStartTime: number | null = null;
    private participants: Map<string, { joinTime: number, times: number[] }> = new Map(); // Map to store participant addresses, join times, and their race times
    private owner: Address;
  
    static createForDeploy(code: Cell, owner: Address): Race {
      const data = beginCell().endCell();
      const workchain = 0; // deploy to workchain 0
      const address = contractAddress(workchain, { code, data });
      return new Race(address, owner, { code, data });
    }
  
    constructor(
      readonly address: Address,
      owner: Address,
      readonly init?: { code: Cell; data: Cell }
    ) {
      this.owner = owner;
    }
  
    async sendDeploy(provider: ContractProvider, via: Sender) {
      await provider.internal(via, {
        value: "0.01", // send 0.01 TON to contract for rent
        bounce: false,
      });
    }
  
    async joinRace(provider: ContractProvider, via: Sender) {
      if (!via.address) {
        throw new Error("Sender address is undefined.");
      }
      const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
  
      if (this.raceStartTime === null) {
        this.raceStartTime = currentTime; // set race start time to current time
      }
  
      this.participants.set(via.address.toString(), { joinTime: currentTime, times: [] }); // store participant's join time and initialize times array
  
      const messageBody = beginCell()
        .storeUint(1, 32) // op (op #1 = join race)
        .storeAddress(via.address) // participant's address
        .endCell();
      await provider.internal(via, {
        value: "1", // entry fee 1 TON
        body: messageBody,
      });
    }
  
    async submitTime(provider: ContractProvider, via: Sender, time: number) {
      if (!via.address) {
        throw new Error("Sender address is undefined.");
      }
      const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
      const participant = this.participants.get(via.address.toString());
  
      if (participant && currentTime <= participant.joinTime + 20 * 60) { // 20 minutes after join time
        if (participant.times.length < 3) {
          participant.times.push(time); // store race time
        } else {
          throw new Error("You can only submit up to 3 times.");
        }
  
        const messageBody = beginCell()
          .storeUint(2, 32) // op (op #2 = submit time)
          .storeUint(time, 64) // race time
          .storeAddress(via.address) // participant's address
          .endCell();
        await provider.internal(via, {
          value: "0.002", // send 0.002 TON for gas
          body: messageBody,
        });
      } else {
        throw new Error("Time to submit results has expired.");
      }
    }
  
    async finalizeRace(provider: ContractProvider, via: Sender) {
      const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
      const raceStartTime = this.getRaceStartTime();
      const joinEndTime = raceStartTime + 40 * 60; // 40 minutes after race start
  
      if (currentTime > joinEndTime + 20 * 60) { // 20 minutes after join end time
        const messageBody = beginCell()
          .storeUint(3, 32) // op (op #3 = finalize race)
          .endCell();
        await provider.internal(via, {
          value: "0.002", // send 0.002 TON for gas
          body: messageBody,
        });
      } else {
        throw new Error("Race finalization time has not ended yet.");
      }
    }
  
    async distributePrize(provider: ContractProvider, via: Sender) {
      if (!via.address) {
        throw new Error("Sender address is undefined.");
      }
      const winner = this.getWinner();
      if (via.address.toString() === winner) {
        const messageBody = beginCell()
          .storeUint(5, 32) // op (op #5 = distribute prize)
          .storeAddress(Address.parse(winner)) // winner's address
          .endCell();
        await provider.internal(via, {
          value: "0.002", // send 0.002 TON for gas
          body: messageBody,
        });
      } else {
        throw new Error("Only the winner can withdraw the prize.");
      }
    }
  
    async refundEntryFee(provider: ContractProvider, via: Sender) {
      if (!via.address) {
        throw new Error("Sender address is undefined.");
      }
      const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
      const raceStartTime = this.getRaceStartTime();
      const joinEndTime = raceStartTime + 40 * 60; // 40 minutes after race start
  
      if (currentTime > joinEndTime && this.participants.size === 1) {
        const messageBody = beginCell()
          .storeUint(6, 32) // op (op #6 = refund entry fee)
          .storeAddress(via.address) // participant's address
          .endCell();
        await provider.internal(via, {
          value: "0.002", // send 0.002 TON for gas
          body: messageBody,
        });
      } else {
        throw new Error("Refund is not allowed.");
      }
    }
  
    getRaceStartTime(): number {
      if (this.raceStartTime === null) {
        throw new Error("Race has not started yet.");
      }
      return this.raceStartTime;
    }
  
    getWinner(): string {
      let winner = "";
      let bestTime = Infinity;
  
      this.participants.forEach((participant, address) => {
        const bestParticipantTime = Math.min(...participant.times);
        if (bestParticipantTime < bestTime) {
          bestTime = bestParticipantTime;
          winner = address;
        }
      });
  
      return winner;
    }
  }
  