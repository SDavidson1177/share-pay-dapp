import { ethers } from 'ethers'
import React, { useEffect, useRef, useState } from 'react';
import { BillIndex } from '../shared/interfaces';
import './Requests.scss'

export function PendingRequests({contract, signer, rerender} : {contract: ethers.Contract | undefined, signer: ethers.JsonRpcSigner | undefined, rerender: any}) {
    const [requests, setRequests] = useState<BillIndex[]>([])

    // Get pending requests
    const get_pending_requests = async () => {
        let pr_arr: BillIndex[] = []
        await contract?.getPendingRequests().then((v) => {
            pr_arr = v.toArray()
        })

        let pr: BillIndex[] = []

        pr_arr.forEach((v: any) => {
            let v_obj = v.toObject()
            pr.push({
                owner: v_obj.owner,
                title: v_obj.title
            })
        })

        setRequests(pr)
        console.log(requests)
    }

    const cancel_request = async (owner: string, title: string) => {
        let tx = await contract?.cancelRequestToJoin(owner, title)
        await tx.wait()
        console.log(tx)
        
        // Update the requests
        for (let i = 0; i < requests.length; i++) {
            if (requests[i].title == title && requests[i].owner == owner) {
                let tmp = requests.slice(0, i).concat(requests.slice(i + 1))
                setRequests(tmp)
            }
        }
    }

    // Intialize
    useEffect(() => {
        get_pending_requests()
    }, [contract, signer, rerender])

    // Rerender updates
    useEffect(() => {}, [requests])

    return(<>
        {requests?.length > 0 && (<>
        <h3>Pending Requests</h3>
        {requests.map((v: BillIndex, i) => <div className='pending-request'>
            <p key={i}>{v.title} ({v.owner})</p>
            <button onClick={() => {cancel_request(v.owner, v.title)}}>Cancel</button>
            </div>
        )}
        </>)}
    </>)
}