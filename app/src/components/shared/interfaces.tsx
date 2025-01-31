export interface Bill {
    owner: string
    key: string
    title: string
    amount: bigint
    participants: string[]
    requests: string[]
}

export interface BillIndex {
    owner: string
    title: string
}