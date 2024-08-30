import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
    toNano
} from '@ton/core';

export type RaceEntry = {
    time: number;
    address: Address;
};

export const Opcodes = {
    recordTime: 0x9fd3,
    distributePrize: 0xf8a7,
    withdrawFees: 0x0cab
};

export class Race implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Race(address);
    }

    static createFromConfig(owner: Address, code: Cell, workchain = 0) {
        const data = Race.createDataCell(owner);
        const init = { code, data };
        return new Race(contractAddress(workchain, init), init);
    }

    static createDataCell(owner: Address): Cell {
        return beginCell()
            .storeAddress(owner)
            .storeUint(0, 64) // lastPayout
            .storeUint(0, 120) // totalFees
            .storeUint(0, 32) // currentTournamentNumber
            .storeUint(0, 64) // bestTime
            .storeAddress(Address.parse('0:0000000000000000000000000000000000000000000000000000000000000000')) // bestPlayer
            .storeDict(null) // playerEntries
            .endCell();
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x44, 32).endCell(),
        });
    }

    async sendRecordTime(
        provider: ContractProvider,
        via: Sender,
        opts: {
            time: number;
            value?: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value ?? toNano('1.1'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.recordTime, 32)
                .storeUint(opts.time, 64)
                .endCell(),
        });
    }

    async sendDistributePrize(
        provider: ContractProvider,
        via: Sender,
        opts: {
            tournamentNumber: number;
            value?: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value ?? toNano('0.1'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.distributePrize, 32)
                .storeUint(opts.tournamentNumber, 32)
                .endCell(),
        });
    }

    async sendWithdrawFees(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value?: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value ?? toNano('0.1'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.withdrawFees, 32)
                .endCell(),
        });
    }

    async getInfo(provider: ContractProvider): Promise<{
        bestTime: number;
        totalFees: bigint;
        currentTournamentNumber: number;
        bestPlayer: Address;
    }> {
        const result = await provider.get('get_info', []);
        return {
            bestTime: result.stack.readNumber(),
            totalFees: result.stack.readBigNumber(),
            currentTournamentNumber: result.stack.readNumber(),
            bestPlayer: result.stack.readAddress(),
        };
    }

    async getPlayerEntry(provider: ContractProvider, address: Address): Promise<{
        time: number;
        timestamp: number;
        tournamentNumber: number;
    } | null> {
        const result = await provider.get('get_player_entry', [
            { type: 'slice', cell: beginCell().storeAddress(address).endCell() },
        ]);
        
        const time = result.stack.readNumber();
        const timestamp = result.stack.readNumber();
        const tournamentNumber = result.stack.readNumber();

        if (time === 0 && timestamp === 0 && tournamentNumber === 0) {
            return null;
        }
        
        return {
            time,
            timestamp,
            tournamentNumber,
        };
    }
}