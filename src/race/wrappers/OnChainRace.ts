import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type OnChainRaceConfig = {};

export function onChainRaceConfigToCell(config: OnChainRaceConfig): Cell {
    return beginCell().endCell();
}

export class OnChainRace implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new OnChainRace(address);
    }

    static createFromConfig(config: OnChainRaceConfig, code: Cell, workchain = 0) {
        const data = onChainRaceConfigToCell(config);
        const init = { code, data };
        return new OnChainRace(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendSetData(provider: ContractProvider, via: Sender, value: bigint, time: number, userAddress: Address) {
        console.log(`sendSetData called with time: ${time}, userAddress: ${userAddress.toString()}`);
        const body = beginCell()
            .storeUint(1, 32) // op code
            .storeUint(time, 64)
            .storeRef(beginCell().storeAddress(userAddress).endCell())
            .endCell();
    
        await provider.internal(via, {
            value,
            body,
        });
    }

    async getRunTime(provider: ContractProvider): Promise<number> {
        const { stack } = await provider.get('get_run_time', []); // No arguments needed
        return Number(stack.readBigNumber()); // Convert BigNumber to number
    }

    async getUserAddress(provider: ContractProvider): Promise<Address> {
        const { stack } = await provider.get('get_user_address', []); // No arguments needed
        return stack.readAddress(); // Read Address from stack
    }
}
