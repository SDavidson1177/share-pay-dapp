// BigInt
export function weiToEther(a: bigint) :string {
    const exp: number = 18
    let val = a.toString()
    for (let i = val.length; i < exp + 1; i++) {
        val = "0" + val
    }

    let insert: number = val.length - exp
    return val.substring(0, insert) + "." + val.substring(insert)
}