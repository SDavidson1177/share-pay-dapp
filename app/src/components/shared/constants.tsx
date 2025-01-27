export enum Denominations {
    WEI,
    GWEI,
    ETHER
}

export const DenomMultiplier = new Map<Denominations, string>([[Denominations.WEI, "wei"], [Denominations.GWEI, "gwei"], [Denominations.ETHER, "ether"]])