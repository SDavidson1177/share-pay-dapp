export interface Bill {
    owner: string
    key: string
    title: string
    amount: bigint
    participants: string[]
    paused_participants: string[]
    requests: string[]
    paused: boolean
}

export interface BillIndex {
    owner: string
    title: string
}