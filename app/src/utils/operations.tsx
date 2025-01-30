// BigInt
export function weiToEther(a: bigint) :string {
    const exp: number = 18
    let val = a.toString()
    for (let i = val.length; i < exp + 1; i++) {
        val = "0" + val
    }

    let insert: number = val.length - exp
    let full = val.substring(0, insert) + "." + val.substring(insert)

    // truncate trailing zeros
    let i = full.length - 1
    for (; full[i] == "0"; i--) {
    }
    if (full[i] == ".") {
        i--
    }

    return i == full.length ? full : full.substring(0, i+1)
}