import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef} from 'react'
import { Denominations, DenomMultiplier} from '../shared/constants';
import { ethers } from 'ethers'
import { FormUnit } from '../shared/form';
import { Result } from 'ethers';
import { weiToEther } from '../../utils/operations';

interface Bill {
    title: string
    amount: bigint
}

function BillList({bills} : {bills: Bill[] | undefined}) {
    useEffect(() => {
        console.log(bills)
    })

    return (<>{bills?.map(v =>
            <h4>{v.title} | {weiToEther(v.amount)} ETH</h4>)}
    </>)
}

export function BillPanel({contract, signer} : {contract: ethers.Contract | undefined, signer: ethers.JsonRpcSigner | undefined}) {
    const {
        register,
        handleSubmit,
      } = useForm();

    const [bills, setBills] = useState<Bill[]>()

    const create_bill = async (data: any) => {
        alert(JSON.stringify(data))

        // submit the transactions
        let tx = await contract?.createBill.populateTransaction(data.name, ethers.parseUnits(data.cost, DenomMultiplier.get(data.unit)), 100)
        console.log(tx)
        let prom = await signer?.sendTransaction(tx!)
        await prom?.wait()

        let resp = await contract?.getBill(signer?.address, data.name)
        console.log(resp)
    }

    const list_bills = async () => {
        let resp = await contract?.getBills(signer?.address)
        let resp_arr = resp.toArray()
        let bill_arr: Bill[] = []
        resp_arr.forEach((v: Result) => {
            console.log(v.toObject())
            let v_obj = v.toObject()
            bill_arr.push({
                title: v_obj.title,
                amount: v_obj.amount,
            })
        })
        console.log(bill_arr)
        setBills(bill_arr)
    }

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
            <h3>Active Bills:</h3>
            <BillList bills={bills}/>
            <button style={{ padding: 10, margin: 10 }} onClick={list_bills}>
                List Bills
            </button><br></br>
        </>)
}