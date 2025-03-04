import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef} from 'react'
import { DenomMultiplier } from '../shared/constants';
import { ethers } from 'ethers'
import { FormUnit, FormTimeUnit } from '../shared/form';
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

    const accept_payment = async () => {
        let tx = await contract?.acceptPayment(billTitle.current)
        console.log(tx)
    }

    const remove_participant = async (participant: string, title: string) => {
        console.log(`participant$: ${participant} and title: ${title}`)
        let tx = await contract?.removeParticipant(participant, title)
        console.log(tx)
    }

    const leave_bill = async () => {
        let tx = await contract?.leave(billOwner.current, billTitle.current)
        console.log(tx)
    }

    const pause = async () => {
        if (isPaused.current) {
            let tx = await contract?.unpause(billOwner.current, billTitle.current)
            console.log(tx)
        } else {
            let tx = await contract?.pause(billOwner.current, billTitle.current)
            console.log(tx)
        }
    }

    return (<>{bills?.map(v => {
            return(
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
                        <p key={i} onClick={() => {remove_participant(part, v.title)}} className='bill-panel-part'>{part + (v?.paused_participants && v.paused_participants?.includes(part) ? " (paused)" : "")}</p>
                        :
                        <p key={i}>{(signer?.address == part ? "me" : part) + (v?.paused_participants && v.paused_participants?.includes(part) ? " (paused)" : "")}</p>
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
                    {v.paused ? 
                        <p style={{color: "red"}}>Cannot pay bill while it is paused</p>
                    : 
                        <form onSubmit={handleSubmit(accept_payment)}>
                                <button onClick={() => {billTitle.current = v.title}} className="bill-panel-pay" type="submit">Pay Bill</button>
                        </form>
                    }
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
                            isPaused.current = v?.paused_participants && signer?.address && v?.paused_participants.includes(signer?.address) ? true : false
                        }} className="bill-panel-pay" type="submit">{(v?.paused_participants && signer?.address && v?.paused_participants.includes(signer?.address)) ? "Unpause" : "Pause"}</button>
                    </form>
                </>
                }
            </div>)})}
    </>)
}

export function BillPanel({contract, signer} : {contract: ethers.Contract | undefined, signer: ethers.JsonRpcSigner | undefined}) {
    const ErrNoName = new Error("missing bill name")
    const ErrNoCost = new Error("cost must be a value greater than zero")
    const ErrNoInterval = new Error("payment interval must be a value greater than zero")
    
    const {
        register,
        handleSubmit,
      } = useForm();

    const [bills, setBills] = useState<Bill[]>()

    const create_bill = async (data: any) => {
        console.log(JSON.stringify(data))

        try {
            // sanity checks
            if ((data?.name ?? "") == "") {
                throw ErrNoName
            }

            if ((data?.cost ?? 0) <= 0) {
                throw ErrNoCost
            }

            if ((data?.timeValue ?? 0) <= 0) {
                throw ErrNoInterval
            }
           
            // submit the transactions
            let tx = await contract?.createBill.populateTransaction(data.name, ethers.parseUnits(data.cost, DenomMultiplier.get(data.unit)), data.timeValue * data.timeUnit)
            console.log(tx)
            let prom = await signer?.sendTransaction(tx!)
            await prom?.wait()

            list_bills()
        } catch (err) {
            alert(err)
        }
    }

    const list_bills = async () => {
        try {
            let resp = await contract?.getBills(signer?.address)
            let resp_arr = resp.toArray()
            let bill_arr: Bill[] = []
            resp_arr.forEach((v: Result) => {
                console.log(v.toObject())
                let v_obj = v.toObject()
                if (v_obj.participants.includes(signer?.address!) || signer?.address! == v_obj.owner) {
                    bill_arr.push({
                        owner: v_obj.owner,
                        key: v_obj.title,
                        title: v_obj.title,
                        amount: v_obj.amount,
                        participants: v_obj.participants,
                        paused_participants: v_obj.paused_participants,
                        requests: v_obj.requests,
                        paused: (v_obj?.paused_participants && v_obj?.paused_participants.length > 0) ?? false,
                    })
                }
            })
            setBills(bill_arr)
        } catch (err) {
            console.log(`Error: ${err}: No bills present`)
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
                <FormTime register={register}></FormTime><br></br>
                <button type='submit' >Create</button>
            </form>
            <h3>Bills:</h3>
            <BillList bills={bills ? bills : []} contract={contract} signer={signer} />
            <button style={{ padding: 10, margin: 10 }} onClick={list_bills}>
                List Bills
            </button><br></br>
        </>)
}