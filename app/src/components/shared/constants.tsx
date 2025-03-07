export enum Denominations {
    WEI,
    GWEI,
    ETHER
}

export const SECONDS: number = 1
export const MINUTES: number = 60
export const HOURS: number = 60 * MINUTES
export const DAYS: number = 24 * HOURS
export const WEEKS: number = 7 * DAYS

export const DenomMultiplier = new Map<Denominations, string>([[Denominations.WEI, "wei"], [Denominations.GWEI, "gwei"], [Denominations.ETHER, "ether"]])
export const Units = ["wei", "gwei", "ether"]

export function getTimeIntervalString(value: number) :string {
    if (Math.abs(value) < MINUTES) {
        return value + " seconds"
    } else if (Math.abs(value) < HOURS) {
        return value/MINUTES + " minutes"
    } else if (Math.abs(value) < DAYS) {
        return value/HOURS + " hours"
    } else if (Math.abs(value) < WEEKS) {
        return value/DAYS + " days"
    }

    return value/WEEKS + " weeks"
}