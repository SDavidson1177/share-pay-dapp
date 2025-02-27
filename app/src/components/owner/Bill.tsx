import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef} from 'react'
import { Denominations, DenomMultiplier} from '../shared/constants';
import { ethers } from 'ethers'
import { FormUnit } from '../shared/form';
import { Result } from 'ethers';
import { weiToEther } from '../../utils/operations';
import "./Bill.scss"
import { Bill } from '../shared/interfaces';

function BillList({bills, contract, signer} : {bills: Bill[] | undefined, contract: ethers.Contract | 
    undefined, signer: ethers.JsonRpcSigner | undefined}) {

    const {
        register,
        handleSubmit,
        } = useForm();
    
    const billTitle = useRef<string>()
    const billOwner = useRef<string>()
    const isPaused = useRef<boolean>()
    const [rerender, setRerender] = useState<boolean>(false)
    const billParticipant = useRef<string>()

    useEffect(() => {}, [bills, rerender])

    const accept_request = async (e: any, title: string, requester: string) => {
        e.preventDefault()

        if (confirm("Do you want to accept " + requester + "'s request to join this bill (" + title + ")?")) {
            // submit the transactions
            let tx = await contract?.acceptRequest(title, requester)
            console.log(tx)

            // TODO: rerender
        }
    }

    const accept_payment = async (data: any) => {
        let tx = await contract?.acceptPayment(billTitle.current)
        console.log(tx)
    }

    const remove_participant = async (participant: string, title: string) => {
        console.log(`participant$: ${participant} and title: ${title}`)
        let tx = await contract?.removeParticipant(participant, title)
        console.log(tx)
    }

    const leave_bill = async (data: any) => {
        let tx = await contract?.leave(billOwner.current, billTitle.current)
        console.log(tx)
    }

    const pause = async (data: any) => {
        if (isPaused.current) {
            let tx = await contract?.unpause(billOwner.current, billTitle.current)
            console.log(tx)
        } else {
            let tx = await contract?.pause(billOwner.current, billTitle.current)
            console.log(tx)
        }
    }

    return (<>{bills?.map(v => {return(
            <div key={v.title} className='bill-panel'>
                <h3 className='bill-panel-title'>{v.title+(v.paused ? " (paused)" : "")}</h3>
                <div className='bill-panel-metadiv'>
                    <p className='bill-panel-cost'>Cost: {weiToEther(v.amount)} ETH</p>
                </div>
                <div className='bill-panel-metadiv'>
                    <p>Number of participants: {v.participants.length + 1}</p>
                </div>
                <h4>Owner</h4>
                <p>{v.owner == signer?.address ? "me" : v.owner}</p>
                <h4>Participants</h4>
                {v.participants.map((part, i) => {
                    return (v.owner == signer?.address ? 
                        <p key={i} onClick={() => {remove_participant(part, v.title)}} className='bill-panel-part'>{part}</p>
                        :
                        <p key={i}>{part}</p>
                    )
                })}
                
                {v.owner == signer?.address ? 
                <>
                    {v.requests.length > 0 && <>
                        <h4>Requests</h4>
                        {v.requests.map((req, i) => 
                            <p key={i} className='bill-panel-req' onClick={(e) => {accept_request(e, v.title, req)}}>{req}</p>
                        )}
                    </>}
                    <form onSubmit={handleSubmit(accept_payment)}>
                            <button onClick={() => {billTitle.current = v.title}} className="bill-panel-pay" type="submit">Pay Bill</button>
                    </form>
                </>
                :
                <>
                    <form onSubmit={handleSubmit(leave_bill)}>
                            <button onClick={() => {
                                billTitle.current = v.title
                                billOwner.current = v.owner
                            }} className="bill-panel-pay" type="submit">Leave Bill</button>
                    </form>
                    <form onSubmit={handleSubmit(pause)}>
                        <button onClick={() => {
                            billTitle.current = v.title
                            billOwner.current = v.owner
                            isPaused.current = v.paused
                        }} className="bill-panel-pay" type="submit">{v.paused ? "Unpause" : "Pause"}</button>
                    </form>
                </>
                }
            </div>)})}
    </>)
}

export function BillPanel({contract, signer} : {contract: ethers.Contract | undefined, signer: ethers.JsonRpcSigner | undefined}) {
    const {
        register,
        handleSubmit,
      } = useForm();

    const [bills, setBills] = useState<Bill[]>()

    const create_bill = async (data: any) => {
        console.log(JSON.stringify(data))

        // submit the transactions
        let tx = await contract?.createBill.populateTransaction(data.name, ethers.parseUnits(data.cost, DenomMultiplier.get(data.unit)), 100)
        console.log(tx)
        let prom = await signer?.sendTransaction(tx!)
        await prom?.wait()

        list_bills()
    }

    const list_bills = async () => {
        try {
            let resp = await contract?.getBills(signer?.address)
            let resp_arr = resp.toArray()
            let bill_arr: Bill[] = []
            resp_arr.forEach((v: Result) => {
                console.log(v.toObject())
                let v_obj = v.toObject()
                bill_arr.push({
                    owner: v_obj.bill.owner,
                    key: v_obj.bill.title,
                    title: v_obj.bill.title,
                    amount: v_obj.bill.amount,
                    participants: v_obj.bill.participants,
                    requests: v_obj.bill.requests,
                    paused: v_obj.paused,
                })
            })
            setBills(bill_arr)
        } catch {
            console.log("No bills present")
            setBills([])
        }
    }

    // Initialize
    useEffect(() => {
        if (signer) {
            list_bills()
        }
    }, [signer, contract])

    return (<>
            <h3>Create Bill</h3>
            <form onSubmit={handleSubmit(create_bill)}>
                <label>
                    Bill Name:
                    <input type='text' {...register("name")}></input>
                </label><br></br>
                <label>
                    Cost:
                    <input type='number' {...register("cost")}></input>
                </label>
                <FormUnit register={register}></FormUnit><br></br>
                <button type='submit' >Create</button>
            </form>
            <h3>Bills:</h3>
            <BillList bills={bills ? bills : []} contract={contract} signer={signer} />
            <button style={{ padding: 10, margin: 10 }} onClick={list_bills}>
                List Bills
            </button><br></br>
        </>)
}