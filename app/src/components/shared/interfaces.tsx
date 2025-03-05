export interface Bill {
    owner: string
    key: string
    title: string
    amount: bigint
    participants: string[]
    paused_participants: string[]
    requests: string[]
    paused: boolean
    delta: number
    last_payment: number
    start_payment: number
}

export interface BillIndex {
    owner: string
    title: string
}