import { useEffect } from 'react';
import { useForm, UseFormHandleSubmit, FieldValues } from 'react-hook-form';
import { FormUnit } from './form';
import { ethers } from 'ethers'
import { Denominations, DenomMultiplier, Units} from '../shared/constants';

export function Deposit({contract, signer, setBalance} : {contract: ethers.Contract | undefined, signer: ethers.JsonRpcSigner | undefined, setBalance: any}) {
    const {
        register,
        handleSubmit,
    } = useForm();
    
    const getBalance = async () => {
        await contract?.balance().then((v) => {
            setBalance(v)
        })
    }

    const deposit = async (data: any) => {
        let tx: ethers.ContractTransaction
        await contract?.deposit.populateTransaction().then((v) => {
        tx = v
        tx.value = ethers.parseUnits(data.amount.toString(), Units[data.unit])
        })

        let conf = await signer?.sendTransaction(tx!)
        await conf?.wait()

        getBalance()
    }

    // Initialize
    useEffect(() => {
        // Get initial balance
        getBalance()
    }, [])

    return (<>
        <form onSubmit={handleSubmit(deposit)}>
            <label>
                Amount:
                <input type='number' {...register("amount")}></input>
            </label>
            <FormUnit register={register}></FormUnit><br></br>
            <button type='submit' style={{ padding: 10, margin: 10 }}>
                Deposit
            </button>
        </form>
        <button onClick={getBalance} style={{ padding: 10, margin: 10 }}>
            Balance
        </button>
    </>)
}