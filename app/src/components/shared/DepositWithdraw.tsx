import { useEffect, useRef } from 'react';
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
    }

    const withdraw = async (data: any) => {
        let conf = await contract?.withdraw(ethers.parseUnits(data.amount.toString(), Units[data.unit]))
        await conf?.wait()
    }

    const caller = useRef<string>("");


    // Initialize
    useEffect(() => {
        // Get initial balance
        getBalance()
    }, [signer, contract])

    const submitForm = async (data: any) => {
        switch(caller.current) {
            case "deposit-button":
                await deposit(data)
                break
            case "withdraw-button":
                await withdraw(data)
                break
        }

        getBalance()
    }

    return (<>
        <h3>Deposit or Withdraw</h3>
        <form id="deposit-withdraw-form" onSubmit={handleSubmit(submitForm)}>
            <label>
                Amount:
                <input type='number' {...register("amount")}></input>
            </label>
            <FormUnit register={register}></FormUnit><br></br>
            <button onClick={() => {caller.current = "deposit-button"}} id="deposit-button" type='submit' style={{ padding: 10, margin: 10 }}>
                Deposit
            </button>
            <button onClick={() => {caller.current = "withdraw-button"}} id="withdraw-button" type='submit' style={{ padding: 10, margin: 10 }}>
                Withdraw
            </button>
        </form>
        <button onClick={getBalance} style={{ padding: 10, margin: 10 }}>
            Update Balance
        </button>
    </>)
}