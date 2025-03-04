export enum Denominations {
    WEI,
    GWEI,
    ETHER
}

export const SECONDS = 1
export const MINUTES = 60
export const HOURS = 60 * MINUTES
export const DAYS = 24 * HOURS
export const WEEKS = 7 * DAYS

export const DenomMultiplier = new Map<Denominations, string>([[Denominations.WEI, "wei"], [Denominations.GWEI, "gwei"], [Denominations.ETHER, "ether"]])
export  const Units = ["wei", "gwei", "ether"]