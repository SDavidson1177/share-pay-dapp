import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef} from 'react'
import { Denominations, DenomMultiplier} from '../shared/constants';
import { ethers } from 'ethers'

export function BillPanel({contract, signer} : {contract: ethers.Contract | undefined, signer: ethers.JsonRpcSigner | undefined}) {
    const {
        register,
        handleSubmit,
      } = useForm();

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
                <label>
                    Unit:
                    <select {...register("unit")}>
                        <option value={Denominations.WEI}>wei</option>
                        <option value={Denominations.GWEI}>gwei</option>
                        <option value={Denominations.ETHER}>ether</option>
                    </select>
                </label><br></br>
                <button type='submit' >Create</button>
            </form>
        </>)
}